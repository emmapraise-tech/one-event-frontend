import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Welcome to OneEvent
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        The ultimate platform for managing and booking event services and providers.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/register">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
