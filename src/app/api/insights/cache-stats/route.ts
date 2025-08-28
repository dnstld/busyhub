import { auth } from '@/auth/next';
import { analysisCache } from '@/lib/analysis-cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Only allow authenticated users to see cache stats
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = analysisCache.getStats();
    
    return NextResponse.json({
      cacheStats: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cache stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
