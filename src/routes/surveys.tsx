import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "../components/BottomNav";
import { fetchAllSurveys, currentUser, type SurveyRecord } from "../lib/auth";

export const Route = createFileRoute("/surveys")({
  component: SurveysPage,
});

function SurveysPage() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);

  useEffect(() => {
    if (!currentUser()) {
      navigate({ to: "/login" });
      return;
    }
    setSurveys(fetchAllSurveys());
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6 text-white" style={{ background: "var(--grad-primary)" }}>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="rounded-full bg-white/15 p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">My Surveys</h1>
        </div>
      </header>

      <div className="px-5 mt-5 space-y-3">
        <Button
          asChild
          className="w-full h-12 rounded-xl font-semibold"
          style={{ background: "var(--grad-accent)" }}
        >
          <Link to="/survey">
            <Plus className="h-4 w-4 mr-2" />
            New Survey
          </Link>
        </Button>

        {surveys.length === 0 && (
          <div className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
            No surveys submitted yet.
          </div>
        )}

        {surveys.map((s) => (
          <div key={s.id} className="rounded-2xl bg-card p-4 flex items-center gap-3 shadow-sm">
            <div className="rounded-xl bg-secondary p-2.5 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {s.category} &middot; {new Date(s.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}
