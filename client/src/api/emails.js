import api from './axios';

export const fetchEmails = async ({ label = 'INBOX', q = '', pageToken = '' }) => {
  const response = await api.get('/emails', {
    params: { label, q, pageToken },
  });
  return response.data;
};

export const fetchEmailDetail = async (id) => {
  const response = await api.get(`/emails/${id}`);
  return response.data;
};

export const fetchThread = async (threadId) => {
  const response = await api.get(`/emails/thread/${threadId}`);
  return response.data;
};

export const toggleReadStatus = async (id, read) => {
  const response = await api.patch(`/emails/${id}/read`, { read });
  return response.data;
};

export const toggleStarStatus = async (id, star) => {
  const response = await api.patch(`/emails/${id}/star`, { star });
  return response.data;
};

export const archiveEmailApi = async (id) => {
  const response = await api.patch(`/emails/${id}/archive`);
  return response.data;
};

export const deleteEmailApi = async (id) => {
  const response = await api.delete(`/emails/${id}`);
  return response.data;
};

export const sendEmailApi = async ({ to, cc, bcc, subject, body }) => {
  const response = await api.post('/emails/send', { to, cc, bcc, subject, body });
  return response.data;
};

export const replyEmailApi = async (id, body) => {
  const response = await api.post(`/emails/${id}/reply`, { body });
  return response.data;
};
