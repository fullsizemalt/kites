import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { KeyRound, Plus } from "lucide-react";

export default async function ApiKeysPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Generate New Key
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg border border-dashed text-center text-muted-foreground flex flex-col items-center justify-center h-[200px]">
        <KeyRound className="w-10 h-10 mb-3" />
        <p className="text-lg">No API Keys yet.</p>
        <p className="text-sm">Generate keys to connect your agents and desktop clients.</p>
      </div>

      {/* Placeholder for listing existing keys */}
      {/* <div className="space-y-4">
        <div className="bg-muted p-4 rounded-md flex items-center justify-between">
          <span className="font-mono text-sm text-foreground">sk_live_********************</span>
          <Button variant="destructive" size="sm">Revoke</Button>
        </div>
      </div> */}
    </div>
  );
}
