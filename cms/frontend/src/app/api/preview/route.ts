import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getArticle } from '@/lib/strapi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('token');
  const slug = searchParams.get('slug');

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (secret !== process.env.PREVIEW_SECRET || !slug) {
    return new Response('Invalid token or slug', { status: 401 });
  }

  // Fetch the article to ensure the slug exists
  const article = await getArticle(slug, 'draft');

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!article) {
    return new Response('Invalid slug', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  (await draftMode()).enable();

  // Redirect to the path from the fetched article
  // We don't redirect to searchParams.slug as that could lead to open redirect vulnerabilities
  redirect(`/articles/${article.slug}`);
}
