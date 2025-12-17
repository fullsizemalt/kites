import { PasteForm } from "@/components/paste-form";
import Link from "next/link";
import { Copy, Terminal, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewPastePage() {
    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center">Create New Paste</h1>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
                Kites helps you manage code snippets, agent outputs, and clipboard history. Create a paste below, or learn how to integrate with your tools.
            </p>

            {/* Instruction Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-card p-6 rounded-lg border flex flex-col items-start space-y-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Copy className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">For Humans</h2>
                    <p className="text-muted-foreground flex-1">
                        Simply paste your content below. Choose a title, syntax, and visibility. Your paste will be available in your personal feed.
                    </p>
                    <Button variant="outline">
                        <Link href="/">View My Pastes</Link>
                    </Button>
                </div>
                <div className="bg-card p-6 rounded-lg border flex flex-col items-start space-y-4">
                    <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">For Agents & Clients</h2>
                    <p className="text-muted-foreground flex-1">
                        Integrate your LLMs, scripts, or desktop clipboard managers using the Kites API. Generate an API key to securely push data.
                    </p>
                    <Button>
                        <Link href="/settings/api-keys">
                            <Key className="w-4 h-4 mr-2" /> Manage API Keys
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Paste Form */}
            <h2 className="text-2xl font-bold tracking-tight mb-6">Your Content Here</h2>
            <PasteForm />
        </div>
    );
}