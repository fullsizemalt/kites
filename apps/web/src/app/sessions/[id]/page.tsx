import Link from "next/link";
import { db } from "@/db";
import { agentSessions, pastes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = (await db.select().from(agentSessions).where(eq(agentSessions.id, id)).limit(1))[0];

    if (!session) {
        notFound();
    }

    const sessionPastes = await db.select()
        .from(pastes)
        .where(eq(pastes.sessionId, session.id))
        .orderBy(desc(pastes.createdAt));

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">{session.title || "Session " + session.id}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDistanceToNow(session.createdAt!, { addSuffix: true })}</span>
                    <span>•</span>
                    <span className="font-mono">{session.agentName || "Unknown Agent"}</span>
                </div>
            </div>

            <div className="grid gap-4">
                {sessionPastes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No pastes in this session.
                    </div>
                ) : (
                    sessionPastes.map((paste) => (
                        <Link
                            key={paste.id}
                            href={`/paste/${paste.id}`}
                            className="block p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">
                                    {paste.title || "Untitled Paste"}
                                </h3>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {paste.syntax || "text"}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2 font-mono bg-muted/50 p-1.5 rounded mb-2">
                                {paste.content}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(paste.createdAt!, { addSuffix: true })}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
