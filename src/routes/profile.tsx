import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, User as UserIcon, ClipboardList, Info } from "lucide-react";
import logo from "../assets/edii-logo.png";
import { BottomNav } from "../components/BottomNav";
import { currentUser, clearSession } from "../lib/auth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const menuItems = [
  { icon: UserIcon, label: "Personal Information" },
  { icon: ClipboardList, label: "Survey History" },
  { icon: Info, label: "About EDII RAMP" },
];

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; username: string } | null>(null);

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);
  }, [navigate]);

  function handleLogout() {
    clearSession();
    navigate({ to: "/login" });
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header
        className="px-5 pt-12 pb-20 text-white text-center"
        style={{ background: "var(--grad-primary)" }}
      >
        <img
          src={logo}
          alt="EDII-TN"
          className="mx-auto h-24 w-24 rounded-full bg-white/95 p-1 object-contain shadow-lg"
        />
        <h1 className="mt-4 text-xl font-bold">{user.name}</h1>
        <p className="text-sm text-white/80">@{user.username}</p>
      </header>

      <div className="px-5 -mt-12">
        <div
          className="rounded-2xl bg-card p-2 shadow-md"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {menuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-secondary transition-colors text-left"
            >
              <div className="rounded-lg bg-secondary p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-sm font-medium">{label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-destructive/5 text-destructive text-left"
          >
            <div className="rounded-lg bg-destructive/10 p-2">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="flex-1 text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
