import { auth } from "@/auth";
import { db } from "@/db";
import { pastes, tags as tagsTable, pastesToTags, agentSessions } from "@/db/schema";
import { desc, eq, and, inArray, ilike } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Code, Cpu, Search, Layers, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: {
  searchParams: { q?: string; tags?: string; sessionId?: string; syntax?: string }
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;
  const { q, tags, sessionId, syntax } = searchParams;

  // Fetch all tags for filtering UI
  const allTags = await db.select().from(tagsTable).orderBy(tagsTable.name);

  // Fetch all sessions for filtering UI
  const allSessions = await db.query.agentSessions.findMany({
    where: eq(agentSessions.userId, userId),
    orderBy: desc(agentSessions.createdAt),
    columns: { id: true, title: true }
  });

  // Build query conditions
  const conditions = [eq(pastes.authorId, userId)];

  if (q) {
    conditions.push(ilike(pastes.content, `%${q}%`));
  }
  if (sessionId) {
    conditions.push(eq(pastes.sessionId, sessionId));
  }
  if (syntax) {
    conditions.push(eq(pastes.syntax, syntax));
  }
  if (tags) {
    const selectedTagNames = tags.split(',');
    const selectedTags = await db.select({ id: tagsTable.id }).from(tagsTable).where(inArray(tagsTable.name, selectedTagNames));
    const selectedTagIds = selectedTags.map(t => t.id);

    if (selectedTagIds.length > 0) {
      const pasteIdsWithTags = await db.select({ pasteId: pastesToTags.pasteId }).from(pastesToTags).where(inArray(pastesToTags.tagId, selectedTagIds));
      const pasteIds = pasteIdsWithTags.map(p => p.pasteId).filter(Boolean) as string[];
      if (pasteIds.length > 0) {
        conditions.push(inArray(pastes.id, pasteIds));
      } else {
        // If no pastes match the tags, return empty result
        conditions.push(eq(pastes.id, 'none')); 
      }
    }
  }


  const userPastes = await db.select()
    .from(pastes)
    .where(and(...conditions))
    .orderBy(desc(pastes.createdAt))
    .limit(50); // Limit for dashboard view

  const availableSyntaxes = [
    "text", "javascript", "typescript", "python", "json", "markdown",
    "html", "css", "bash", "go", "rust"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Your Kites Dashboard</h1>

      {/* Filter Bar */}
      <div className="bg-card p-4 rounded-lg shadow-sm border mb-8 flex flex-wrap gap-4 items-end">
        {/* Search Query */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="search-q" className="text-sm font-medium sr-only">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-q"
              placeholder="Search content, title..."
              className="pl-9"
              defaultValue={q || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const newSearchParams = new URLSearchParams(window.location.search);
                  if (e.currentTarget.value) newSearchParams.set('q', e.currentTarget.value);
                  else newSearchParams.delete('q');
                  window.location.search = newSearchParams.toString();
                }
              }}
            />
          </div>
        </div>

        {/* Tags Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[150px] justify-between">
              <Tag className="w-4 h-4 mr-2" /> Tags {tags ? `(${tags.split(',').length})` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2">
            <div className="grid gap-2">
              {allTags.map((t) => (
                <div key={t.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${t.id}`}
                    checked={tags?.split(',').includes(t.name) || false}
                    onChange={(e) => {
                      const newSearchParams = new URLSearchParams(window.location.search);
                      let currentTags = tags ? tags.split(',') : [];
                      if (e.target.checked) {
                        currentTags.push(t.name);
                      } else {
                        currentTags = currentTags.filter(name => name !== t.name);
                      }
                      if (currentTags.length > 0) newSearchParams.set('tags', currentTags.join(','));
                      else newSearchParams.delete('tags');
                      window.location.search = newSearchParams.toString();
                    }}
                  />
                  <label htmlFor={`tag-${t.id}`} className="text-sm font-medium leading-none">{t.name}</label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sessions Filter */}
        <Select
          onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(window.location.search);
            if (value) newSearchParams.set('sessionId', value);
            else newSearchParams.delete('sessionId');
            window.location.search = newSearchParams.toString();
          }}
          value={sessionId || ''}
        >
          <SelectTrigger className="min-w-[150px]">
            <Layers className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sessions</SelectItem>
            {allSessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Syntax Filter */}
        <Select
          onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(window.location.search);
            if (value) newSearchParams.set('syntax', value);
            else newSearchParams.delete('syntax');
            window.location.search = newSearchParams.toString();
          }}
          value={syntax || ''}
        >
          <SelectTrigger className="min-w-[150px]">
            <Code className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by Syntax" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Syntaxes</SelectItem>
            {availableSyntaxes.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {(q || tags || sessionId || syntax) && (
          <Button variant="ghost" onClick={() => window.location.search = ''}>Clear Filters</Button>
        )}
      </div>

      {/* Pastes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userPastes.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            <div className="mb-2">👻</div>
            No pastes found matching your criteria.
          </div>
        ) : (
          userPastes.map((paste) => (
            <Link
              key={paste.id}
              href={`/paste/${paste.id}`}
              className="group block p-5 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {paste.syntax ? <Code className="w-4 h-4 text-primary" /> : <Cpu className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-xs font-medium text-muted-foreground uppercase">{paste.syntax || 'Text'}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(paste.createdAt!, { addSuffix: true })}</span>
              </div>
              
              <h3 className="font-semibold truncate mb-2 group-hover:text-primary transition-colors">
                {paste.title || "Untitled Snippet"}
              </h3>
              
              <div className="relative">
                <div className="text-sm text-muted-foreground line-clamp-3 font-mono bg-muted/50 p-3 rounded-md text-xs">
                    {paste.content}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/10 group-hover:to-transparent" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
