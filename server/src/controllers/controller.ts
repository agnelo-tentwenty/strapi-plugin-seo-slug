import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateSlugUID(ctx) {
    try {
      // ctx.body = 
      const { value, maxLength, removeStopWords, contentTypeUID, field, locale, docId } = ctx.request?.body;
      const slug = await strapi.plugin("strapi-plugin-seo-slug").
        service("service").
        sanitizedSlug(value, maxLength, removeStopWords, contentTypeUID, field, locale, docId);

     return ctx.send(slug);
    } catch (error) {
      ctx.badRequest(error);
    }
  }
});

export default controller;
