import api from './axios';

export const summarizeEmailApi = async ({ emailId, subject, bodyText }) => {
  const response = await api.post('/ai/summarize', { emailId, subject, bodyText });
  return response.data;
};

export const generateReplyApi = async ({ emailId, subject, bodyText, tone, senderName }) => {
  const response = await api.post('/ai/generate-reply', {
    emailId,
    subject,
    bodyText,
    tone,
    senderName,
  });
  return response.data;
};

export const classifyEmailApi = async ({ emailId, subject, bodyText }) => {
  const response = await api.post('/ai/classify', { emailId, subject, bodyText });
  return response.data;
};

export const extractActionsApi = async ({ emailId, subject, bodyText }) => {
  const response = await api.post('/ai/extract-actions', { emailId, subject, bodyText });
  return response.data;
};

export const extractDatesApi = async ({ emailId, subject, bodyText }) => {
  const response = await api.post('/ai/extract-dates', { emailId, subject, bodyText });
  return response.data;
};

export const smartSearchApi = async (prompt) => {
  const response = await api.post('/ai/smart-search', { prompt });
  return response.data;
};
