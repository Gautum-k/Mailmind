const { google } = require('googleapis');

/**
 * Helper to decode base64url encoded text from Gmail API body payload
 */
const decodeBody = (data) => {
  if (!data) return '';
  const decoded = Buffer.from(
    data.replace(/-/g, '+').replace(/_/g, '/'),
    'base64'
  ).toString('utf-8');
  return decoded;
};

/**
 * Recursively parses email payload to extract HTML or plaintext body and attachments.
 */
const parsePayload = (payload) => {
  let bodyHtml = '';
  let bodyText = '';
  const attachments = [];

  const traverseParts = (part) => {
    if (!part) return;

    if (part.mimeType === 'text/html' && part.body && part.body.data) {
      bodyHtml += decodeBody(part.body.data);
    } else if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      bodyText += decodeBody(part.body.data);
    }

    if (part.filename && part.body && part.body.attachmentId) {
      attachments.push({
        id: part.body.attachmentId,
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size || 0,
      });
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(traverseParts);
    }
  };

  traverseParts(payload);

  return {
    bodyHtml: bodyHtml || (bodyText ? `<pre>${bodyText}</pre>` : ''),
    bodyText,
    attachments,
  };
};

/**
 * Helper to extract specific header value from message payload headers array.
 */
const getHeader = (headers, name) => {
  if (!headers) return '';
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : '';
};

/**
 * Format full raw Gmail message object into clean JSON representation.
 */
const formatMessage = (msg) => {
  const headers = msg.payload ? msg.payload.headers : [];
  const { bodyHtml, bodyText, attachments } = parsePayload(msg.payload || {});

  return {
    id: msg.id,
    threadId: msg.threadId,
    labelIds: msg.labelIds || [],
    snippet: msg.snippet || '',
    historyId: msg.historyId,
    internalDate: msg.internalDate,
    from: getHeader(headers, 'From'),
    to: getHeader(headers, 'To'),
    cc: getHeader(headers, 'Cc'),
    bcc: getHeader(headers, 'Bcc'),
    subject: getHeader(headers, 'Subject') || '(No Subject)',
    date: getHeader(headers, 'Date'),
    messageIdHeader: getHeader(headers, 'Message-ID'),
    referencesHeader: getHeader(headers, 'References'),
    bodyHtml,
    bodyText,
    attachments,
    isUnread: (msg.labelIds || []).includes('UNREAD'),
    isStarred: (msg.labelIds || []).includes('STARRED'),
    isTrash: (msg.labelIds || []).includes('TRASH'),
  };
};

// 1. List messages live from Gmail API
const listMessages = async (auth, { q = '', pageToken = '', maxResults = 20, labelIds = ['INBOX'] }) => {
  const gmail = google.gmail({ version: 'v1', auth });

  const params = {
    userId: 'me',
    maxResults: parseInt(maxResults, 10),
  };

  if (q) params.q = q;
  if (pageToken) params.pageToken = pageToken;
  if (labelIds && labelIds.length > 0 && !q) params.labelIds = labelIds;

  const res = await gmail.users.messages.list(params);
  const messagesList = res.data.messages || [];

  // Fetch detail format for returned message IDs in parallel batch
  const messages = await Promise.all(
    messagesList.map(async (item) => {
      try {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: item.id,
          format: 'full',
        });
        return formatMessage(detail.data);
      } catch (err) {
        return null;
      }
    })
  );

  return {
    messages: messages.filter(Boolean),
    nextPageToken: res.data.nextPageToken || null,
    resultSizeEstimate: res.data.resultSizeEstimate || 0,
  };
};

// 2. Get single message live from Gmail API
const getMessage = async (auth, messageId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });
  return formatMessage(res.data);
};

// 3. Get thread messages live from Gmail API
const getThread = async (auth, threadId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'full',
  });

  const messages = (res.data.messages || []).map(formatMessage);
  return {
    id: res.data.id,
    historyId: res.data.historyId,
    messages,
  };
};

// 4. Modify labels live from Gmail API
const modifyLabels = async (auth, messageId, { addLabelIds = [], removeLabelIds = [] }) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      addLabelIds,
      removeLabelIds,
    },
  });
  return formatMessage(res.data);
};

// 5. Move message to trash live from Gmail API
const trashMessage = async (auth, messageId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.trash({
    userId: 'me',
    id: messageId,
  });
  return formatMessage(res.data);
};

// 6. Send email message live from Gmail API
const sendMessage = async (auth, { raw, threadId }) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const requestBody = { raw };
  if (threadId) requestBody.threadId = threadId;

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody,
  });
  return res.data;
};

module.exports = {
  listMessages,
  getMessage,
  getThread,
  modifyLabels,
  trashMessage,
  sendMessage,
};
