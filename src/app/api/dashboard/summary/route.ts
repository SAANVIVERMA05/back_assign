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

    const summary = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach(item => {
      if (item._id === 'INCOME') totalIncome = item.total;
      if (item._id === 'EXPENSE') totalExpense = item.total;
    });

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    });
  } catch (error: any) {
    console.error('Fetch dashboard summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
