import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "../assets/edii-logo.png";
import { currentUser } from "../lib/auth";

export const Route = createFileRoute("/")({
  component: SplashPage,
});

function SplashPage() {
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = currentUser() ? "/dashboard" : "/login";
      nav({ to: target });
    }, 1800);

    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--grad-primary)" }}
    >
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="rounded-full bg-white/95 p-3 shadow-2xl">
          <img
            src={logo}
            alt="EDII-TN"
            className="h-40 w-40 rounded-full object-contain"
          />
        </div>
        <h1 className="mt-8 text-3xl font-bold text-white tracking-tight">
          EDII RAMP Survey
        </h1>
        <p className="mt-2 text-white/80 text-sm">Digital Survey Management System</p>
        <div className="mt-10 h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-white" />
        </div>
      </div>
    </main>
  );
}
