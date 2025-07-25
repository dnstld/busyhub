export const formatTime = (dateTimeStr: string, locale = 'en-US'): string => {
  return new Date(dateTimeStr).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
