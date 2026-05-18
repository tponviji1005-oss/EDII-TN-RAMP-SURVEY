let captured: { error: unknown; timestamp: number } | undefined;
const EXPIRY_MS = 5000;

function store(error: unknown) {
  captured = { error, timestamp: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (e) => store((e as ErrorEvent).error ?? e));
  globalThis.addEventListener("unhandledrejection", (e) =>
    store((e as PromiseRejectionEvent).reason),
  );
}

export function drainCapturedError(): unknown {
  if (!captured) return undefined;

  if (Date.now() - captured.timestamp > EXPIRY_MS) {
    captured = undefined;
    return undefined;
  }

  const err = captured.error;
  captured = undefined;
  return err;
}
