'use client';

import { useEffect, useState } from 'react';

export function useIsDesktop(breakpointPx = 768) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [breakpointPx]);

  return isDesktop;
}
