import LoginButton from "@/components/login-button";
import ChatInterface from "@/components/chat-interface";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ThemeProvider } from "@/components/theme-provider";
import { Code2, BookOpen, LightbulbIcon } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-gray-800 dark:text-gray-200" />
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DSA Learning Assistant
              </h1>
            </div>
            <LoginButton />
          </div>
        </header>

        {session ? (
          <div className="max-w-6xl mx-auto p-4">
            <ChatInterface />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="max-w-3xl w-full">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                  Master Data Structures & Algorithms
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Get guided hints, intuition-building explanations, and step-by-step assistance for your
                  LeetCode problems without spoiling the solution.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Guide, Don't Solve"
                  description="Our assistant nudges you in the right direction without giving away the answers, helping you truly learn."
                />

                <FeatureCard
                  icon={<Code2 className="h-5 w-5" />}
                  title="Intuition Building"
                  description="Understand the core concepts and patterns behind each problem to strengthen your problem-solving skills."
                />

                <FeatureCard
                  icon={<LightbulbIcon className="h-5 w-5" />}
                  title="Step-by-Step Guidance"
                  description="Receive detailed explanations and dry runs of algorithms to clarify your understanding."
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Ready to elevate your DSA skills?</h2>
                <div className="flex justify-center">
                  <LoginButton size="lg" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </ThemeProvider>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full w-10 h-10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
