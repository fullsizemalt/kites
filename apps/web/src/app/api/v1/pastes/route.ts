import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pastes, tags, pastesToTags } from '@/db/schema';
import { nanoid } from 'nanoid';
import { z, ZodError } from 'zod';
import { eq, desc, like, and } from 'drizzle-orm';
import { auth } from '@/auth';

const createPasteSchema = z.object({
    content: z.string().min(1),
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    sessionId: z.string().optional(),
    visibility: z.enum(['public', 'unlisted', 'private']).optional().default('public'),
    expiresIn: z.number().optional(), // seconds
    contentType: z.string().optional(),
    syntax: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await auth();
        
        // API Key Auth for Desktop Client
        const apiKey = req.headers.get('x-api-key');
        const isApiAuth = apiKey && apiKey === process.env.KITES_API_KEY;

        if (!session && !isApiAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const validated = createPasteSchema.parse(body);

        const id = nanoid(10);

        // Calculate expiration
        let expiresAt = null;
        if (validated.expiresIn) {
            // Simple expiration logic (seconds)
            expiresAt = new Date(Date.now() + validated.expiresIn * 1000);
        }

        await db.insert(pastes).values({
            id,
            content: validated.content,
            title: validated.title,
            sessionId: validated.sessionId,
            visibility: validated.visibility,
            expiresAt,
            contentType: validated.contentType,
            syntax: validated.syntax,
            authorId: session?.user?.id,
        });

        if (validated.tags && validated.tags.length > 0) {
            for (const tagName of validated.tags) {
                // Simple tag handling: create if not exists, then link
                // In a real app, might want to optimize this
                let tagId = nanoid(8);

                // Check if tag exists
                const existingTag = (await db.select().from(tags).where(eq(tags.name, tagName)).limit(1))[0];

                if (existingTag) {
                    tagId = existingTag.id;
                } else {
                    await db.insert(tags).values({ id: tagId, name: tagName });
                }

                await db.insert(pastesToTags).values({
                    pasteId: id,
                    tagId: tagId,
                });
            }
        }

        const created = (await db.select().from(pastes).where(eq(pastes.id, id)).limit(1))[0];

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sessionId = searchParams.get('session_id');
    const authorId = searchParams.get('author_id');
    const q = searchParams.get('q');

    // Basic filtering
    let conditions = [];
    if (sessionId) conditions.push(eq(pastes.sessionId, sessionId));
    if (authorId) conditions.push(eq(pastes.authorId, authorId));
    if (q) conditions.push(like(pastes.title, `%${q}%`)); // Simple title search

    // TODO: Tag filtering requires join

    const results = await db.select()
        .from(pastes)
        .where(and(...conditions))
        .orderBy(desc(pastes.createdAt))
        .limit(limit)
        .offset(offset);

    return NextResponse.json(results);
}
