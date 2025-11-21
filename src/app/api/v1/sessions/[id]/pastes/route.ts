import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pastes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = await params;

    const results = await db.select()
        .from(pastes)
        .where(eq(pastes.sessionId, sessionId))
        .orderBy(desc(pastes.createdAt))
        .all();

    return NextResponse.json(results);
}
