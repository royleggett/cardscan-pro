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

export async function sendGmail(base44, { to, subject, html, fromName = "CardScan-Pro" }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

  const rawMessage = [
    `From: ${encodeHeader(fromName)} <hello@cardscan-pro.com>`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    html
  ].join('\r\n');

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