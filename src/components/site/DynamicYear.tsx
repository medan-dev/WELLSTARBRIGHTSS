"use client";

import { useEffect, useState } from "react";

export function DynamicYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (year === null) {
    return <span className="opacity-0">2024</span>; // Placeholder with same width
  }

  return <>{year}</>;
}
