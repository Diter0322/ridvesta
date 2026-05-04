import apiClient from './client';

/** GET /api/faqs */
export const getFaqs = async () => {
  const { data } = await apiClient.get('/faqs');
  const categories = data?.data?.faqs ?? [];
  return Array.isArray(categories)
    ? categories.flatMap((cat) => (Array.isArray(cat.faqs) ? cat.faqs : []))
    : [];
};
