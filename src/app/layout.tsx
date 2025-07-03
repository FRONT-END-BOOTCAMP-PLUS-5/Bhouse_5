'use client'

import { AppProviders } from "@/components/layouts/AppProviders";
import "./globals.css";
import "./utils/fontawesome";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;

