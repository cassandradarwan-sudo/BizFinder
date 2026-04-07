import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Strapi Blog",
    template: "%s | Strapi Blog",
  },
  description: "A modern blog powered by Strapi CMS and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            height: "var(--nav-height)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(16px)",
            background: "rgba(10, 10, 15, 0.85)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "var(--max-width)",
              margin: "0 auto",
              padding: "0 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              ✦ Strapi Blog
            </Link>
            <Link
              href="/articles"
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                padding: "0.4rem 1rem",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                transition: "all 0.2s ease",
              }}
              className="nav-link"
            >
              Articles
            </Link>
          </div>
        </nav>
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "2rem 1.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            marginTop: "6rem",
          }}
        >
          Powered by{" "}
          <span style={{ color: "var(--accent-purple)" }}>Strapi</span> &{" "}
          <span style={{ color: "var(--accent-blue)" }}>Next.js</span>
        </footer>
      </body>
    </html>
  );
}
