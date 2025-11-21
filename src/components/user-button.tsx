import { auth } from "@/auth"
import { SignIn, SignOut } from "./auth-components"
import { Button } from "./ui/button"

export default async function UserButton() {
    const session = await auth()

    if (!session?.user) return <SignIn />

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {session.user.image ? (
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-border"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {session.user.name?.[0] || "U"}
                    </div>
                )}
                <span className="text-sm font-medium hidden md:inline-block">
                    {session.user.name}
                </span>
            </div>
            <SignOut />
        </div>
    )
}
