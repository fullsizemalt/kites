import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pastes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z, ZodError } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('raw') === '1';

    const paste = await db.select().from(pastes).where(eq(pastes.id, id)).get();

    if (!paste) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (raw) {
        return new NextResponse(paste.content, {
            headers: {
                'Content-Type': paste.contentType || 'text/plain',
            },
        });
    }

    return NextResponse.json(paste);
}

const updatePasteSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    visibility: z.enum(['public', 'unlisted', 'private']).optional(),
    syntax: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validated = updatePasteSchema.parse(body);

        const updated = await db.update(pastes)
            .set({
                ...validated,
                updatedAt: new Date(),
            })
            .where(eq(pastes.id, id))
            .returning()
            .get();

        if (!updated) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await db.delete(pastes).where(eq(pastes.id, id)).run();
    return new NextResponse(null, { status: 204 });
}
