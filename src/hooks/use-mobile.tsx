import * as React from "react";

const BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);

    const handler = () => setIsMobile(window.innerWidth < BREAKPOINT);

    mq.addEventListener("change", handler);
    setIsMobile(window.innerWidth < BREAKPOINT);

    return () => mq.removeEventListener("change", handler);
  }, []);

  return !!isMobile;
}
