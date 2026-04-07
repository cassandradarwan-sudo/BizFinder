import Link from 'next/link';
import { getArticles } from '@/lib/strapi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse all articles from the Strapi blog',
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  let articles: Article[] = [];
  let error = false;

  try {
    articles = await getArticles();
  } catch {
    error = true;
  }

  return (
    <main
      style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: '3rem' }}>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-purple)',
            marginBottom: '0.75rem',
          }}
        >
          ✦ All Posts
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          Articles
        </h1>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.06)',
            color: '#f87171',
            fontSize: '0.9rem',
          }}
        >
          ⚠ Could not load articles. Make sure the Strapi server is running and the API token is correct.
        </div>
      )}

      {/* Empty state */}
      {!error && articles.length === 0 && (
        <div
          style={{
            padding: '4rem 2rem',
            borderRadius: '16px',
            border: '1px dashed var(--border)',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
          <p style={{ fontSize: '1rem' }}>No articles published yet.</p>
          <a
            href={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--accent-purple)',
            }}
          >
            Add your first article in the Admin →
          </a>
        </div>
      )}

      {/* Article grid */}
      {!error && articles.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            display: 'grid',
            gap: '1.25rem',
          }}
        >
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.slug}`}
                id={`article-card-${article.id}`}
                style={{
                  display: 'block',
                  padding: '1.75rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                  textDecoration: 'none',
                }}
                className="article-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.3,
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.02em',
                      }}
                    >
                      /{article.slug}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                        background: article.publishedAt
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(251,191,36,0.1)',
                        color: article.publishedAt ? '#4ade80' : '#fbbf24',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        border: `1px solid ${article.publishedAt ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.2)'}`,
                      }}
                    >
                      {article.publishedAt ? 'Published' : 'Draft'}
                    </span>
                    {article.publishedAt && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    color: 'var(--accent-purple)',
                    fontWeight: 500,
                  }}
                >
                  Read article →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

interface Article {
  id: number;
  title: string;
  slug: string;
  publishedAt: string | null;
}
