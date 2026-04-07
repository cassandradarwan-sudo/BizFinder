import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: ['http://localhost:3000'],
      async handler(uid, { documentId, locale, status }) {
        if (uid === 'api::article.article') {
          // @ts-ignore
          const entry = await strapi.documents(uid).findOne({
            documentId,
            fields: ['slug'],
          });

          if (!entry) return null;

          return `http://localhost:3000/api/preview?slug=${entry.slug}&token=${process.env.PREVIEW_SECRET}`;
        }
        return null;
      },
    },
  },
});

export default config;
