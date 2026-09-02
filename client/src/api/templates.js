import api from './axios';

export const fetchTemplatesApi = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const createTemplateApi = async ({ name, subject, body }) => {
  const response = await api.post('/templates', { name, subject, body });
  return response.data;
};

export const deleteTemplateApi = async (id) => {
  const response = await api.delete(`/templates/${id}`);
  return response.data;
};
