/**
 * Sends an email via the connected Gmail connector (hello@cardscan-pro.com).
 * @param {object} base44 - The Base44 SDK client (from createClientFromRequest).
 * @param {object} params
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Email subject line.
 * @param {string} params.html - HTML email body.
 * @param {string} [params.fromName] - Display name for the From header (defaults to "CardScan-Pro").
 * @returns {Promise<object>} - The Gmail API response.
 */
/**
 * RFC 2047 encode a header value for non-ASCII characters (emoji, accents, etc.)
 */
function encodeHeader(str) {
  // If the string is pure ASCII, return as-is
  if (/^[\x00-\x7F]*$/.test(str)) return str;
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `=?utf-8?B?${btoa(binary)}?=`;
}

/**
 * Strips HTML tags to produce a plain-text fallback.
 * Removes script/style blocks, converts <br>/<p>/<div> to newlines, strips remaining tags,
 * collapses whitespace, and unescapes HTML entities.
 */
function htmlToPlainText(html) {
  let text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export async function sendGmail(base44, { to, subject, html, text, fromName = "CardScan-Pro" }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

  const fromHeader = `From: ${encodeHeader(fromName)} <hello@cardscan-pro.com>`;
  const toHeader = `To: ${to}`;
  const subjectHeader = `Subject: ${encodeHeader(subject)}`;
  const mimeHeader = `MIME-Version: 1.0`;

  let rawMessage;

  if (text && !html) {
    // Plain-text-only email (best deliverability with strict filters like Sky/Yahoo)
    rawMessage = [
      fromHeader,
      toHeader,
      subjectHeader,
      mimeHeader,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      text
    ].join('\r\n');
  } else {
    const textFallback = html ? htmlToPlainText(html) : text;
    const boundary = 'cardscan_boundary_' + Math.random().toString(36).slice(2);
    rawMessage = [
      fromHeader,
      toHeader,
      subjectHeader,
      mimeHeader,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      textFallback,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      html,
      ``,
      `--${boundary}--`
    ].join('\r\n');
  }

  // Encode UTF-8 to base64url (Gmail API requirement)
  const bytes = new TextEncoder().encode(rawMessage);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const encodedMessage = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedMessage })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}