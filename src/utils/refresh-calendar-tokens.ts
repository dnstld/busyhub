'use client';

export async function refreshCalendarTokens() {
  try {
    const response = await fetch('/api/calendar/refresh-tokens', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Reload the page to get fresh data with new tokens
      window.location.reload();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing calendar tokens:', error);
    return false;
  }
}
