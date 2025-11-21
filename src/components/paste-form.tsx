"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function PasteForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const data = {
            title: formData.get("title"),
            content: formData.get("content"),
            syntax: formData.get("syntax"),
            visibility: formData.get("visibility"),
            tags: formData.get("tags")?.toString().split(",").map(t => t.trim()).filter(Boolean),
        }

        try {
            const res = await fetch("/api/v1/pastes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(JSON.stringify(json.error) || "Failed to create paste")
            }

            const created = await res.json()
            router.push(`/paste/${created.id}`)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {error && (
                <div className="p-4 rounded bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Title (Optional)
                </label>
                <input
                    id="title"
                    name="title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="My awesome snippet"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="syntax" className="text-sm font-medium leading-none">
                        Syntax
                    </label>
                    <select
                        id="syntax"
                        name="syntax"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="text">Plain Text</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="json">JSON</option>
                        <option value="markdown">Markdown</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="bash">Bash</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="visibility" className="text-sm font-medium leading-none">
                        Visibility
                    </label>
                    <select
                        id="visibility"
                        name="visibility"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium leading-none">
                    Tags (comma separated)
                </label>
                <input
                    id="tags"
                    name="tags"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="bug, feature, wip"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium leading-none">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Paste your code here..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
                {loading ? "Creating..." : "Create Paste"}
            </button>
        </form>
    )
}
