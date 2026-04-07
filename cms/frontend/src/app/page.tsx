import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strapi Blog — Home",
  description: "A modern blog powered by Strapi CMS and Next.js",
};

export default function Home() {
  return (
    <>
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "calc(100vh - var(--nav-height))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "100px",
            background: "rgba(139,92,246,0.08)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--accent-purple)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          <span>✦</span>
          <span>Powered by Strapi CMS</span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            maxWidth: "720px",
            marginBottom: "1.5rem",
          }}
        >
          Stories Worth{" "}
          <span
            style={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reading
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            maxWidth: "480px",
            lineHeight: 1.75,
            marginBottom: "3rem",
          }}
        >
          A curated blog driven by a headless CMS — fast, flexible, and
          beautifully designed.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/articles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2rem",
              borderRadius: "12px",
              background: "var(--accent-gradient)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              boxShadow: "0 0 30px rgba(139,92,246,0.3)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            id="hero-browse-btn"
          >
            Browse Articles →
          </Link>
          <a
            href="http://38.247.189.143:1337/admin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2rem",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.95rem",
              background: "var(--bg-card)",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            id="hero-admin-btn"
          >
            Admin Panel ↗
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "5rem",
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            background: "var(--bg-card)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { label: "CMS", value: "Strapi v5" },
            { label: "Frontend", value: "Next.js 16" },
            { label: "Database", value: "SQLite / Postgres" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
