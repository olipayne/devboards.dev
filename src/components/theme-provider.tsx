"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.PropsWithChildren<Parameters<typeof NextThemesProvider>[0]>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
