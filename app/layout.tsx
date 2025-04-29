
'use client'

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "react-query";
import { NextSeo } from "next-seo";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../app/globals.css";
import { initSentry } from "../lib/sentry";
import { useEffect } from "react";

initSentry();

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en" suppressHydrationWarning>
          <head>
            <NextSeo
              title="Automated News Site"
              description="AI-powered news aggregation with custom summaries and voice narration"
              openGraph={{
                url: process.env.NEXT_PUBLIC_BASE_URL,
                title: "Automated News Site",
                description: "Stay updated with AI-generated news summaries",
                images: [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` }],
              }}
            />
            <link rel="manifest" href="/manifest.json" />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Automated News Site",
                url: process.env.NEXT_PUBLIC_BASE_URL,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${process.env.NEXT_PUBLIC_BASE_URL}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              })}
            </script>
          </head>
          <body className="flex min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 transition-colors">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-6" role="main">
                {children}
              </main>
              <ThemeToggle />
            </div>
            <ClientSideSetup />
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function ClientSideSetup() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);
  return null;
}