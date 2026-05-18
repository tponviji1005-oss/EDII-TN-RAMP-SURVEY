import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/edii-logo.png";
import { tryLogin } from "../lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setBusy(true);

      setTimeout(() => {
        const ok = tryLogin(form.username.trim(), form.password);
        if (ok) {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard" });
        } else {
          toast.error("Invalid username or password");
          setBusy(false);
        }
      }, 400);
    },
    [form, navigate],
  );

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{ background: "var(--grad-primary)" }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-card p-7 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="EDII-TN"
            className="h-24 w-24 rounded-full object-contain shadow-md"
          />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Welcome Back!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Login to continue</p>
        </div>

        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="pl-10 h-12 rounded-xl"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="pl-10 pr-10 h-12 rounded-xl"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl text-base font-semibold shadow-lg"
            style={{
              background: "var(--grad-accent)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {busy ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
