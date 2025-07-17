"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import { SeasonProvider } from "@/components/SeasonProvider";

export function ClientRootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current path is a match stats page
  const isMatchStatsPage = pathname?.startsWith('/matches/');

  return (
    <SeasonProvider>
      {!isMatchStatsPage && <Header />}
      <main>{children}</main>
    </SeasonProvider>
  );
} 