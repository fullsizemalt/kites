import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentSessions } from '@/db/schema';
import { nanoid } from 'nanoid';
import { z, ZodError } from 'zod';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

const createSessionSchema = z.object({
    title: z.string().optional(),
    agentName: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await auth();
        const validated = createSessionSchema.parse(body);

        const id = nanoid(12);

        await db.insert(agentSessions).values({
            id,
            title: validated.title,
            agentName: validated.agentName,
            userId: session?.user?.id,
        });

        const created = await db.select().from(agentSessions).where(eq(agentSessions.id, id)).get(); // Re-fetch to get default fields if any

        // Since we inserted, we can just return what we have + id if we trust it, but fetching is safer for timestamps
        // Actually better-sqlite3 insert doesn't return the row by default unless using returning() which is supported in Drizzle now
        // Let's use returning() in the insert above if possible, but I used .values().
        // Drizzle with SQLite supports .returning()

        // Let's refactor to use returning() for cleaner code in next iteration or just re-fetch.
        // Re-fetching is fine.

        return NextResponse.json({ id, ...validated }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
