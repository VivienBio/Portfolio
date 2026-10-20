export interface MessagePart {
  readonly text: string;
  /** Present when the part is a link: an https URL, a mailto: address or a tel: number. */
  readonly href?: string;
  /** True for web links, which open in a new tab so the conversation stays open. */
  readonly external?: boolean;
}

const LINK_PATTERN =
  /(https:\/\/[^\s<>"]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|((?:\+33 ?|0)[1-9](?:[ .]?\d{2}){4})/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]»]+$/u;

/** Splits an assistant reply into plain text and clickable links, without any HTML parsing. */
export function toMessageParts(content: string): readonly MessagePart[] {
  const parts: MessagePart[] = [];
  let cursor = 0;

  for (const match of content.matchAll(LINK_PATTERN)) {
    const [raw, url, email, phone] = match;
    const start = match.index;
    const text = url ? raw.replace(TRAILING_PUNCTUATION, '') : raw;

    if (start > cursor) {
      parts.push({ text: content.slice(cursor, start) });
    }

    if (url) {
      parts.push({ text, href: text, external: true });
    } else if (email) {
      parts.push({ text, href: `mailto:${text}` });
    } else if (phone) {
      parts.push({ text, href: `tel:${toInternationalNumber(text)}` });
    }

    cursor = start + text.length;
  }

  if (cursor < content.length) {
    parts.push({ text: content.slice(cursor) });
  }

  return parts;
}

function toInternationalNumber(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.startsWith('0') ? `+33${digits.slice(1)}` : digits;
}
