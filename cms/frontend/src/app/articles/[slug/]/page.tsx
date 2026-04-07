import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/strapi';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    if (!article) return { title: 'Article not found' };
    return {
      title: article.title,
      description: `Read ${article.title} on Strapi Blog`,
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticle(slug);
  } catch (err) {
    return (
      <main style={{ padding: '4rem 1.5rem', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <Link href="/articles" style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', marginBottom: '2rem', display: 'inline-block' }}>
          ← Back to Articles
        </Link>
        <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#f87171' }}>
          ⚠ Could not load article. Make sure the Strapi server is running.
        </div>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* Background glow for depth */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '0',
          right: '0',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <article
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '6rem 1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <header style={{ marginBottom: '4rem' }}>
          <Link
            href="/articles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '2.5rem',
              transition: 'color 0.2s ease',
            }}
            className="back-link"
          >
            ← Back to all articles
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
             <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-purple)',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              Technology
            </span>
            <time
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Draft Mode'}
            </time>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            {article.title}
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
            Exploring the intersection of headless CMS architecture and modern frontend delivery.
          </p>
        </header>

        {/* Content Section */}
        <div
          style={{
            color: 'var(--text-primary)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            maxWidth: '720px',
          }}
          className="article-content"
        >
          {Array.isArray(article.content) ? (
            (article.content as any[]).map((block, i) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={i} style={{ marginBottom: '1.5rem' }}>
                    {block.children?.map((child: any, j: number) => (
                      <span key={j} style={{ fontWeight: child.bold ? '700' : '400', fontStyle: child.italic ? 'italic' : 'normal' }}>
                         {child.text}
                      </span>
                    ))}
                  </p>
                );
              }
              if (block.type === 'heading') {
                const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                return (
                  <Tag key={i} style={{ marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {block.children?.map((child: any) => child.text).join('')}
                  </Tag>
                );
              }
              return null;
            })
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No content provided for this article.</p>
          )}
        </div>

        {/* Footer info */}
        <footer style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>Strapi Author</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Technical Content Creator</div>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
