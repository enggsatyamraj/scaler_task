"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginButton() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    if (isLoading) {
        return (
            <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </Button>
        );
    }

    if (session) {
        console.log(session.user);
        return (
            <div className="flex items-center gap-4">
                {/* <p className="text-sm">Signed in as {session.user.email}</p> */}
                <Image src={session.user.image} alt="User profile picture" width={32} height={32} className="rounded-full" />
                <Button onClick={() => signOut()} variant="outline">
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={() => signIn("google")}>
            Sign in with Google
        </Button>
    );
}