"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"


// Create a client

export function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <>
      {children}
    </>
  )
}