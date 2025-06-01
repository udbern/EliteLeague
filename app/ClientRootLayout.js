"use client";

import React from "react";
import Header from "@/components/Header/Header";
import { SeasonProvider } from "@/components/SeasonProvider";

export function ClientRootLayout({ children }) {
  return (
    <SeasonProvider>
      <Header />
      <main>{children}</main>
    
    </SeasonProvider>
  );
} 