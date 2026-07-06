import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div
        className="rounded-full p-6 text-white shadow-2xl animate-in zoom-in duration-500"
        style={{ background: "var(--grad-accent)" }}
      >
        <Check className="h-16 w-16" strokeWidth={3} />
      </div>

      <h1 className="mt-8 text-2xl font-bold text-foreground">Survey Submitted Successfully!</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Thank you for your response. Your data has been recorded.
      </p>

      <div className="mt-10 w-full max-w-xs space-y-3">
        <Button
          asChild
          className="w-full h-12 rounded-xl font-semibold"
          style={{ background: "var(--grad-accent)" }}
        >
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-12 rounded-xl">
          <Link to="/survey">Submit Another</Link>
        </Button>
      </div>
    </main>
  );
}
