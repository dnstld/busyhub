/**
 * Generate specific keys for a user's calendar tokens
 */
export const createKey = (email: string) => {
  const userKey = `busyhub_calendar_token_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const refreshKey = `${userKey}_refresh`;
  
  return { userKey, refreshKey };
};