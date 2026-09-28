'use client';

import React, { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate static snowflake configuration on client side to avoid hydration mismatch
    const flakes: Snowflake[] = Array.from({ length: 38 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0% to 100%
      size: Math.random() * 8 + 8, // 8px to 16px
      duration: Math.random() * 8 + 7, // 7s to 15s
      delay: Math.random() * 10, // 0s to 10s
      opacity: Math.random() * 0.5 + 0.35, // 0.35 to 0.85
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake text-white/70"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
