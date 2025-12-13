"use client";

import { useEffect, useRef } from "react";

/**
 * Animated Counter Hook
 * Animates a number from 0 to target value
 */

interface UseCounterProps {
  end: number;
  duration?: number;
  start?: number;
  delay?: number;
}

export function useCounter({
  end,
  duration = 2000,
  start = 0,
  delay = 0,
}: UseCounterProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const startTime = Date.now() + delay;
    const endTime = startTime + duration;
    
    const updateCounter = () => {
      const now = Date.now();
      
      if (now < startTime) {
        requestAnimationFrame(updateCounter);
        return;
      }

      if (now >= endTime) {
        element.textContent = end.toLocaleString("tr-TR");
        return;
      }

      const progress = (now - startTime) / duration;
      const currentValue = Math.floor(start + (end - start) * progress);
      element.textContent = currentValue.toLocaleString("tr-TR");

      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  }, [end, duration, start, delay]);

  return ref;
}
