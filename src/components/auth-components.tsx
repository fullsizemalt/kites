import { signIn, signOut } from "@/auth"
import { Button } from "./ui/button"

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn()
            }}
        >
            <Button variant="outline" size="sm">Sign In</Button>
        </form>
    )
}

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <Button variant="ghost" size="sm" className="w-full justify-start">
                Sign Out
            </Button>
        </form>
    )
}
