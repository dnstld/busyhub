export const formatDate = (dateStr: string, locale = 'en-US'): string => {
  return new Date(dateStr).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
};