import { describe, expect, it } from 'vitest';
import { createKey } from './index';

describe('createKey', () => {
  it('should create user and refresh keys for a simple email', () => {
    const email = 'user@example.com';
    const result = createKey(email);
    
    expect(result).toHaveProperty('userKey');
    expect(result).toHaveProperty('refreshKey');
    expect(result.userKey).toBe('busyhub_calendar_token_user_example_com');
    expect(result.refreshKey).toBe('busyhub_calendar_token_user_example_com_refresh');
  });

  it('should replace special characters with underscores', () => {
    const email = 'user+test@example-domain.co.uk';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token_user_test_example_domain_co_uk');
    expect(result.refreshKey).toBe('busyhub_calendar_token_user_test_example_domain_co_uk_refresh');
  });

  it('should handle emails with numbers', () => {
    const email = 'user123@example.com';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token_user123_example_com');
    expect(result.refreshKey).toBe('busyhub_calendar_token_user123_example_com_refresh');
  });

  it('should handle emails with various special characters', () => {
    const email = 'user.name+tag@example-domain.com';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token_user_name_tag_example_domain_com');
    expect(result.refreshKey).toBe('busyhub_calendar_token_user_name_tag_example_domain_com_refresh');
  });

  it('should handle empty string email', () => {
    const email = '';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token_');
    expect(result.refreshKey).toBe('busyhub_calendar_token__refresh');
  });

  it('should handle email with only special characters', () => {
    const email = '@.+-_';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token______');
    expect(result.refreshKey).toBe('busyhub_calendar_token_______refresh');
  });

  it('should maintain alphanumeric characters', () => {
    const email = 'Test123@Example456.com';
    const result = createKey(email);
    
    expect(result.userKey).toBe('busyhub_calendar_token_Test123_Example456_com');
    expect(result.refreshKey).toBe('busyhub_calendar_token_Test123_Example456_com_refresh');
  });
});
