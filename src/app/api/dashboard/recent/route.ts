import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Record from '@/models/Record';
import { extractUserFromRequest, checkRole } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!checkRole(authUser, ['ADMIN', 'ANALYST'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const recentRecords = await Record.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    return NextResponse.json({ recentRecords });
  } catch (error: any) {
    console.error('Fetch recent records error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
