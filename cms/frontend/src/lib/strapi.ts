import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const strapiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export const getArticles = async () => {
  const response = await strapiClient.get('/articles?populate=*');
  return response.data.data;
};

export const getArticle = async (slug: string, status: 'published' | 'draft' = 'published') => {
  const response = await strapiClient.get('/articles', {
    params: {
      'filters[slug][$eq]': slug,
      populate: '*',
      status: status,
    },
  });
  return response.data.data[0];
};