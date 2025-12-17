import Link from "next/link";
import { db } from "@/db";
import { pastes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Terminal, Cpu, Share2, Shield, Code, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation"; // Import redirect

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (userId) { // Redirect if logged in
    redirect("/dashboard");
  }

  const recentPastes = await db.select()
    .from(pastes)
    .orderBy(desc(pastes.createdAt))
    .limit(12);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              v1.0 Public Beta
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              The Shared Brain for <br/> Humans & AI Agents
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem]">
              Stop copy-pasting into the void. Kites is an agent-native clipboard that gives your LLMs a persistent memory and you a unified history.
            </p>
            <div className="flex gap-4">
              <Link href="/new">
                <Button size="lg" className="h-12 px-8">Start Pasting</Button>
              </Link>
              {userId ? ( // Conditional button for logged-in users
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-12 px-8">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="https://github.com/fullsizemalt/kites">
                  <Button variant="outline" size="lg" className="h-12 px-8">View on GitHub</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Abstract "Network" Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* Feature Grid */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-xl hover:bg-background transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                <Terminal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Agent-Native API</h3>
              <p className="text-muted-foreground">
                Give your agents a <code>POST /pastes</code> endpoint. Let them save context, code blocks, and logs directly to your view.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-xl hover:bg-background transition-colors">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-full">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Unified History</h3>
              <p className="text-muted-foreground">
                Your desktop clipboard, your agent's output, and your mobile saves—all in one structured, searchable timeline.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-xl hover:bg-background transition-colors">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="text-muted-foreground">
                Self-hostable. Private by default. You control the retention policy and visibility of every snippet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Feed (Recent Pastes) */}
      <section className="py-16">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{userId ? "My Recent Pastes" : "Live Context Feed"}</h2>
              <p className="text-muted-foreground">{userId ? "Your latest snippets and agent interactions." : "Recent items from our community."}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPastes.length === 0 ? (
              <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                <div className="mb-2">👻</div>
                No context yet. Create your first paste!
              </div>
            ) : (
              recentPastes.map((paste) => (
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
      </section>
    </div>
  );
}