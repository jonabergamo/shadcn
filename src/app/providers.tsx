"use client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={["orange", "purple", "green", "dark"]}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
