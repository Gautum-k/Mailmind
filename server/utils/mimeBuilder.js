/**
 * Encodes string into base64url format required by Gmail API raw message payload.
 */
const base64UrlEncode = (str) => {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Builds RFC 2822 compliant MIME message string for new email composition.
 */
const buildMimeMessage = ({ to, cc, bcc, subject, body, from }) => {
  const lines = [];

  if (from) lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  if (cc) lines.push(`Cc: ${cc}`);
  if (bcc) lines.push(`Bcc: ${bcc}`);
  lines.push(`Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`);
  lines.push('MIME-Version: 1.0');
  lines.push('Content-Type: text/html; charset=utf-8');
  lines.push('Content-Transfer-Encoding: 8bit');
  lines.push('');
  lines.push(body);

  return base64UrlEncode(lines.join('\r\n'));
};

/**
 * Builds RFC 2822 compliant MIME message string for replying within a thread.
 */
const buildReplyMimeMessage = ({
  to,
  subject,
  body,
  messageId,
  references,
  from,
}) => {
  const lines = [];

  if (from) lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  lines.push(
    `Subject: ${
      subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`
    }`
  );

  if (messageId) {
    lines.push(`In-Reply-To: ${messageId}`);
    const refs = references ? `${references} ${messageId}` : messageId;
    lines.push(`References: ${refs}`);
  }

  lines.push('MIME-Version: 1.0');
  lines.push('Content-Type: text/html; charset=utf-8');
  lines.push('Content-Transfer-Encoding: 8bit');
  lines.push('');
  lines.push(body);

  return base64UrlEncode(lines.join('\r\n'));
};

module.exports = {
  buildMimeMessage,
  buildReplyMimeMessage,
  base64UrlEncode,
};
