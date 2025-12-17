import Link from "next/link";
import { db } from "@/db";
import { tags, pastes, pastesToTags } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tag = (await db.select().from(tags).where(eq(tags.id, id)).limit(1))[0];

    if (!tag) {
        notFound();
    }

    const taggedPastes = await db.select({
        id: pastes.id,
        title: pastes.title,
        content: pastes.content,
        syntax: pastes.syntax,
        createdAt: pastes.createdAt,
        visibility: pastes.visibility,
    })
        .from(pastes)
        .innerJoin(pastesToTags, eq(pastes.id, pastesToTags.pasteId))
        .where(eq(pastesToTags.tagId, tag.id))
        .orderBy(desc(pastes.createdAt))
    .limit(50);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Tag:</h1>
                <Badge className="text-lg px-3 py-1">#{tag.name}</Badge>
            </div>

            <div className="grid gap-4">
                {taggedPastes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No pastes found with this tag.
                    </div>
                ) : (
                    taggedPastes.map((paste) => (
                        <Link
                            key={paste.id}
                            href={`/paste/${paste.id}`}
                            className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold text-lg truncate">
                                    {paste.title || "Untitled Paste"}
                                </h2>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {paste.syntax || "text"}
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 font-mono bg-muted/50 p-2 rounded">
                                {paste.content}
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatDistanceToNow(paste.createdAt!, { addSuffix: true })}</span>
                                {paste.visibility !== 'public' && (
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                        {paste.visibility}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
