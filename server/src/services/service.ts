import type { Core } from '@strapi/strapi';
import slugify from 'slugify';
import { getService } from '../utils';
import { removeStopwords } from 'stopword';
import type { UID } from '@strapi/types';


const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async sanitizedSlug(
    text: string,
    maxLength: number = 75,
    stripStopWords: boolean,
    contentTypeUID: UID.ContentType,
    field: string,
    locale: string,
    docId: string
  ) {
    if (text.length === 0) {
      text = 'Lorem ipsum dolor sit amet';
    }
    const words = stripStopWords ? removeStopwords(text.split(' ')) : text.split(' ');
    const rawSlug = slugify(words.join(' '), { lower: true, strict: true, trim: true });

    var uidSlug = rawSlug;

    // make sure any word is not blindly truncated
    // return slug if already within limit
    if (rawSlug.length <= maxLength) {
      uidSlug =  rawSlug;
    }else{
      const truncated = uidSlug.slice(0, maxLength);
      const lastHyphenIndex = truncated.lastIndexOf('-');
      // return up to the last complete word
      uidSlug = rawSlug.slice(0, lastHyphenIndex);

      if (lastHyphenIndex === -1) {
        uidSlug = truncated;
      }
    }
    
    const service = getService("uid", strapi);
    const slugAvailable = await this.checkUIDAvailabilityWithDocID({
      contentTypeUID,
      field,
      value: uidSlug,
      locale,
      docId
    });
    if (!slugAvailable) {
      uidSlug = await service.findUniqueUID({
        contentTypeUID,
        field,
        value: uidSlug,
        locale,
      });
    }
    
    
    return {
      slug: uidSlug
    };
  }, 
  // checkUIDAvailability service function from @strapi/content-manager/uid
  // modified so that the current document is not counted when checking for existing slug values
  async checkUIDAvailabilityWithDocID({
        contentTypeUID,
        field,
        value,
        locale,
        docId
    }: {
        contentTypeUID: UID.ContentType;
        field: string;
        value: string;
        locale?: string;
        docId: string
    }) {
        const documentCount = await strapi.documents(contentTypeUID).count({
            filters: {
                [field]: value,
                documentId: { $not: docId },
            },
            locale,
            // TODO: Check UX. When modifying an entry, it only makes sense to check for collisions with other drafts
            // However, when publishing this "available" UID might collide with another published entry
            status: 'draft',
        });

        if (documentCount && documentCount > 0) {
            // If there are documents sharing the proposed UID, we can return false
            return false;
        }

        return true;
    },
});

export default service;
