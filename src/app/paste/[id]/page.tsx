import { db } from "@/db";
import { pastes, tags, pastesToTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CodeViewer } from "@/components/code-viewer";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // We don't have this yet, I'll inline styles or create it

// Inline simple Badge component for now to avoid creating too many files
function SimpleBadge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}>
            {children}
        </span>
    );
}

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paste = (await db.select().from(pastes).where(eq(pastes.id, id)).limit(1))[0];

    if (!paste) {
        notFound();
    }

    const pasteTags = await db.select({
        id: tags.id,
        name: tags.name,
    })
        .from(tags)
        .innerJoin(pastesToTags, eq(tags.id, pastesToTags.tagId))
        .where(eq(pastesToTags.pasteId, id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{paste.title || "Untitled Paste"}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDistanceToNow(paste.createdAt!, { addSuffix: true })}</span>
                        <span>•</span>
                        <span className="font-mono">{paste.syntax || "text"}</span>
                        <span>•</span>
                        <span className="capitalize">{paste.visibility}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={`/api/v1/pastes/${paste.id}?raw=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                        Raw
                    </a>
                    {/* Copy button could go here */}
                </div>
            </div>

            {pasteTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {pasteTags.map((tag) => (
                        <Link key={tag.id} href={`/tag/${tag.id}`}>
                            <SimpleBadge>#{tag.name}</SimpleBadge>
                        </Link>
                    ))}
                </div>
            )}

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CodeViewer code={paste.content} language={paste.syntax || 'text'} />
            </div>
        </div>
    );
}
