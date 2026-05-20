"use client";

import React, { useEffect, useRef, useState } from "react";

interface CounterCellProps {
  value: number;
  label: string;
  isLive?: boolean;
  endpoint?: string;
}

export default function CounterCell({ value, label, isLive = false, endpoint }: CounterCellProps) {
  const [targetValue, setTargetValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(0);
  const displayValueRef = useRef(0);

  useEffect(() => {
    if (!endpoint) return;

    const controller = new AbortController();

    fetch(endpoint, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const count = Number(data?.count);
        if (Number.isFinite(count) && count >= 0) {
          setTargetValue(count);
        }
      })
      .catch(() => {
        // Keep the server-rendered fallback count if the PHP endpoint is unavailable locally.
      });

    return () => controller.abort();
  }, [endpoint]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrame = 0;
    const duration = 2000; // 2 seconds animation
    const startValue = displayValueRef.current;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const nextValue = Math.floor(easeProgress * (targetValue - startValue) + startValue);
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        displayValueRef.current = targetValue;
        setDisplayValue(targetValue);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [targetValue]);

  const formattedValue = new Intl.NumberFormat('en-US').format(displayValue);

  return (
    <div className="flex flex-col gap-[6px] pr-[18px] border-r border-[rgba(26,17,8,0.12)] last:border-r-0">
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="w-2.5 h-2.5 rounded-full bg-blood animate-livepulse flex-shrink-0"></span>
        )}
        <strong className="font-display text-[28px] sm:text-[36px] font-normal text-ink leading-none">
          {formattedValue}{isLive ? '' : '+'}
        </strong>
      </div>
      <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-3">
        {label}
      </span>
    </div>
  );
}
