import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/strapi';
import type { Metadata } from 'next';
import Link from 'next/link';
import { draftMode } from 'next/headers';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic'; // fetch fresh data on every request

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  try {
    const article = await getArticle(slug, isEnabled ? 'draft' : 'published');
    if (!article) return { title: 'Article not found' };
    return {
      title: `${article.title}${isEnabled ? ' (Preview)' : ''}`,
      description: `Read ${article.title}`,
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  let article;
  try {
    article = await getArticle(slug, isEnabled ? 'draft' : 'published');
  } catch {
    return (
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <Link href="/articles">← Back to Articles</Link>
        <p style={{ color: 'red', marginTop: '1rem' }}>
          Could not load article. Make sure the Strapi server is running.
        </p>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      {isEnabled && (
        <div style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '0.75rem',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          fontSize: '0.875rem',
          borderBottom: '1px solid #fde68a'
        }}>
          You are in <strong>Preview Mode</strong>. Viewing draft content.{' '}
          <Link href="/api/disable-preview" style={{ color: '#b45309', fontWeight: 'bold' }}>
            Exit Preview
          </Link>
        </div>
      )}
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Link
          href="/articles"
          style={{ textDecoration: 'none', color: '#6b7280', fontSize: '0.9rem' }}
        >
          ← Back to Articles
        </Link>
  
        <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          {article.title}
        </h1>
  
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {article.publishedAt
            ? `Published ${new Date(article.publishedAt).toLocaleDateString()}`
            : 'Draft'}
        </p>
  
        <div>
          {/* Render plain text preview of Strapi Blocks content */}
          {Array.isArray(article.content) ? (
            (article.content as Array<{ type: string; children?: Array<{ text?: string }> }>).map(
              (block, i) => (
                <p key={i}>
                  {block.children?.map((child) => child.text).join('') ?? ''}
                </p>
              )
            )
          ) : (
            <p style={{ color: '#9ca3af' }}>No content yet.</p>
          )}
        </div>
      </main>
    </>
  );
}
