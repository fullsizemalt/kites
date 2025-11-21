import Link from "next/link";
import { db } from "@/db";
import { agentSessions, pastes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function SessionsPage() {
    // Fetch sessions with paste count
    const allSessions = await db.select({
        id: agentSessions.id,
        title: agentSessions.title,
        agentName: agentSessions.agentName,
        createdAt: agentSessions.createdAt,
        pasteCount: sql<number>`count(${pastes.id})`,
    })
        .from(agentSessions)
        .leftJoin(pastes, eq(agentSessions.id, pastes.sessionId))
        .groupBy(agentSessions.id)
        .orderBy(desc(agentSessions.createdAt))
        .all();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>

            <div className="grid gap-4">
                {allSessions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No sessions found.
                    </div>
                ) : (
                    allSessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/sessions/${session.id}`}
                            className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold text-lg">
                                    {session.title || session.id}
                                </h2>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {session.agentName || "Unknown Agent"}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatDistanceToNow(session.createdAt!, { addSuffix: true })}</span>
                                <span>{session.pasteCount} pastes</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
