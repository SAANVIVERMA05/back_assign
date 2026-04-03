import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Record from '@/models/Record';
import { extractUserFromRequest, checkRole } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!checkRole(authUser, ['ADMIN'])) {
      return NextResponse.json({ error: 'Forbidden. Admin access required' }, { status: 403 });
    }

    const { amount, type, category, date, description } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!type || !['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json({ error: 'Valid type (INCOME/EXPENSE) is required' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    await connectToDatabase();

    const record = new Record({
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
      description,
      createdBy: authUser?.id
    });

    await record.save();

    return NextResponse.json({ message: 'Record created successfully', record }, { status: 201 });
  } catch (error: any) {
    console.error('Create record error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!checkRole(authUser, ['ADMIN', 'ANALYST', 'VIEWER'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Record.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Record.countDocuments(query)
    ]);

    return NextResponse.json({ 
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Fetch records error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
