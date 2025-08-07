import slugify from 'slugify';
import { removeStopwords } from 'stopword'

export function sanitizedSlug(text: string, maxLength: number = 75, stripStopWords: boolean) {
  const words = stripStopWords ? removeStopwords(text.split(' ')) : text.split(' ');
  const rawSlug = slugify(words.join(' '), { lower: true, strict: true, trim: true });

  // make sure any word is not blindly truncated
  // return slug if already within limit
  if (rawSlug.length <= maxLength) {
    return rawSlug;
  }
  const truncated = rawSlug.slice(0, maxLength);
  const lastHyphenIndex = truncated.lastIndexOf('-');
  
  if (lastHyphenIndex === -1) {
    return truncated;
  }
  
  // return up to the last complete word
  return rawSlug.slice(0, lastHyphenIndex);
}