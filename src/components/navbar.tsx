import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import UserButton from "./user-button"

export function Navbar() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl tracking-tight">
                        Kites
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/sessions" className="hover:text-foreground transition-colors">
                            Sessions
                        </Link>
                        <Link href="/settings/api-keys" className="hover:text-foreground transition-colors">
                            Settings
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
