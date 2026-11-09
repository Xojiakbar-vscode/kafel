// ============================================================
// useLiveClock Hook
// ============================================================

import { useState, useEffect } from 'react';
import { formatLiveClock } from '@/utils/date';

export function useLiveClock(): string {
  const [time, setTime] = useState(() => formatLiveClock(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatLiveClock(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
