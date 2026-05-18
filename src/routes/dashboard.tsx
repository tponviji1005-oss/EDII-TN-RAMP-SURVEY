import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, ClipboardList, ChevronRight } from "lucide-react";
import logo from "../assets/edii-logo.png";
import { Button } from "@/components/ui/button";
import { BottomNav } from "../components/BottomNav";
import { currentUser, fetchAllSurveys, type SurveyRecord } from "../lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [records, setRecords] = useState<SurveyRecord[]>([]);

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);
    setRecords(fetchAllSurveys());
  }, [navigate]);

  if (!user) return null;

  const recent = records.slice(0, 5);

  return (
    <main className="min-h-screen bg-background pb-24 mx-auto w-full max-w-md overflow-hidden">
      <header
        className="px-5 pt-12 pb-20 text-white relative"
        style={{ background: "var(--grad-primary)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="EDII-TN"
            className="h-11 w-11 rounded-full bg-white/95 p-0.5 object-contain"
          />
          <div className="flex-1">
            <p className="text-xs text-white/75">Welcome to EDII RAMP Survey</p>
            <h1 className="text-lg font-semibold">Hello, {user.name}</h1>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-5 -mt-14 space-y-5">
        <div
          className="rounded-2xl bg-card p-5 shadow-md"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-sm text-muted-foreground">Total Surveys</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-4xl font-bold text-foreground">{records.length}</span>
            <div
              className="rounded-xl p-3 text-white"
              style={{ background: "var(--grad-accent)" }}
            >
              <ClipboardList className="h-6 w-6" />
            </div>
          </div>
        </div>

        <Button
          asChild
          className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg"
          style={{
            background: "var(--grad-accent)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <Link to="/survey">
            <Plus className="h-5 w-5 mr-2" /> Start New Survey
          </Link>
        </Button>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Recent Surveys</h2>
            <Link to="/surveys" className="text-xs font-medium text-primary">
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {records.length === 0 && (
              <div className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
                No surveys yet. Tap &quot;Start New Survey&quot; to begin.
              </div>
            )}

            {recent.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-card p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="rounded-xl bg-secondary p-2.5 text-primary">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
