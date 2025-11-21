import Link from "next/link";
import { db } from "@/db";
import { pastes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const recentPastes = await db.select()
    .from(pastes)
    .orderBy(desc(pastes.createdAt))
    .limit(20)
    .all();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Recent Pastes</h1>
        <Link
          href="/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          New Paste
        </Link>
      </div>

      <div className="grid gap-4">
        {recentPastes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No pastes found. Create one to get started.
          </div>
        ) : (
          recentPastes.map((paste) => (
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
