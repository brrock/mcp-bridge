<<<<<<< HEAD
import { ReactNode } from "react";
import "./globas.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
=======
import { ReactNode } from 'react';
import './globas.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
interface LayoutProps {
  children: ReactNode;
}
export const metadata = {
  title: 'MCP Bridge',
  description: 'A proxy server for STDIO MCP servers to SSE or streamble http',
  icons: {
    icon: '/favico.svg',
  },
};
export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
<<<<<<< HEAD
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          
=======
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
