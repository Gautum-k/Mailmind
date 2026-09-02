import api from './axios';

export const fetchActivityApi = async () => {
  const response = await api.get('/activity');
  return response.data;
};
