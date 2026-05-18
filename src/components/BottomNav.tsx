import { Link, useLocation } from "@tanstack/react-router";
import { Home, ClipboardList, User } from "lucide-react";
import { cn } from "../lib/utils";

const navTabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  function isActive(path: string) {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto max-w-md grid grid-cols-3 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {navTabs.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "scale-110")} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
