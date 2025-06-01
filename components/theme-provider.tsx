<<<<<<< HEAD
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
=======
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
<<<<<<< HEAD
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
=======
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
