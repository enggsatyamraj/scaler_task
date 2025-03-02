// components/login-button.jsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { ThemeSelector } from "./theme-selector";
import { useState } from "react";

export default function LoginButton({ size = "default" }) {
    const { data: session, status } = useSession();
    const isAuthLoading = status === "loading";
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = () => {
        setIsSigningIn(true);
        signIn("google");
    };

    if (isAuthLoading) {
        return (
            <Button disabled className="min-w-[120px]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </Button>
        );
    }

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <ThemeSelector />
                <div className="hidden md:flex items-center gap-2">
                    {session.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                            </span>
                        </div>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{session.user?.name || session.user?.email}</span>
                </div>
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    size={size}
                >
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <ThemeSelector />
            <Button
                onClick={handleSignIn}
                size={size}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                disabled={isSigningIn}
            >
                {isSigningIn ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    "Sign in with Google"
                )}
            </Button>
        </div>
    );
}