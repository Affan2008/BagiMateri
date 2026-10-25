import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes HTML on the server to prevent XSS.
 * Allows safe HTML tags used by Tiptap and the reader.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li',
      'a',
      'img',
      'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'loading', 'class',
      'width', 'height',
      'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
    // Force links to be relative or http(s)
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?:)|(?:\/(?!\/)))/,
  })
}
