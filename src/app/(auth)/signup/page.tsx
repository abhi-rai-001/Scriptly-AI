import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { signup } from "../actions";

export const metadata = {
  title: "Create Account | Scriptly AI",
  description: "Create your Scriptly AI account and start generating viral video scripts and thumbnails.",
};

export default async function SignupPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="w-full flex flex-col gap-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1
          className="text-3xl font-black tracking-[-0.03em] text-foreground"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          Start creating.
        </h1>
        <p className="text-sm text-muted-foreground">
          Join 2,400+ creators — your first 10 scripts are free.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form action={signup} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Alex Mitchell"
            type="text"
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect="off"
            className="h-11 bg-secondary/40 border-white/10 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] focus-visible:border-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="h-11 bg-secondary/40 border-white/10 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] focus-visible:border-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className="h-11 bg-secondary/40 border-white/10 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] focus-visible:border-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
          />
          <p className="text-[11px] text-muted-foreground">Must be at least 8 characters long.</p>
        </div>

        <Button
          className="w-full h-11 mt-1 btn-amber rounded-xl font-bold text-sm border-0"
          type="submit"
        >
          Create Free Account
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/8" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-background px-3 text-muted-foreground tracking-[0.1em] font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social auth */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-11 border-white/10 bg-secondary/40 hover:bg-secondary/60 rounded-xl font-medium text-sm"
        >
          <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          className="h-11 border-white/10 bg-secondary/40 hover:bg-secondary/60 rounded-xl font-medium text-sm"
        >
          <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.372.79 1.102.79 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </Button>
      </div>

      {/* Legal + login link */}
      <div className="flex flex-col gap-3">
        <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[oklch(0.72_0.20_285)] hover:text-[oklch(0.62_0.24_285)] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
