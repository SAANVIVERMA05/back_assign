import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Record from '@/models/Record';
import { extractUserFromRequest, checkRole } from '@/middleware/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!checkRole(authUser, ['ADMIN'])) {
      return NextResponse.json({ error: 'Forbidden. Admin access required' }, { status: 403 });
    }

    // In Next.js App Router 15+ or 14 dynamic routes, params should be awaited if they are promises (sometimes required)
    // or just synchronous. Since Next.js 14, params can be used sync or async, but 15 enforces async params.
    const { id } = await params;

    const data = await request.json();

    if (data.amount !== undefined && data.amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (data.type && !['INCOME', 'EXPENSE'].includes(data.type)) {
      return NextResponse.json({ error: 'Valid type (INCOME/EXPENSE) is required' }, { status: 400 });
    }

    await connectToDatabase();

    const record = await Record.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record updated successfully', record });
  } catch (error: any) {
    console.error('Update record error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!checkRole(authUser, ['ADMIN'])) {
      return NextResponse.json({ error: 'Forbidden. Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    await connectToDatabase();

    const record = await Record.findByIdAndDelete(id);

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error: any) {
    console.error('Delete record error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
