import LoginButton from "@/components/login-button";
import ChatInterface from "@/components/chat-interface";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">DSA Learning Assistant</h1>
          <LoginButton />
        </div>

        <p className="text-center mb-8 text-muted-foreground">
          Ask questions about LeetCode problems and get guided help without direct solutions
        </p>

        {session ? (
          <ChatInterface />
        ) : (
          <div className="text-center p-12 border rounded-lg">
            <p className="mb-4">Please sign in to use the DSA Learning Assistant</p>
          </div>
        )}
      </div>
    </main>
  );
}