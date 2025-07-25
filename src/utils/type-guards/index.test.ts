import { describe, expect, it } from 'vitest';
import {
    createSafeDate,
    getMapValue,
    hasProperty,
    isDefined,
    isNonEmptyArray,
    isNonEmptyString,
    toSafeNumber
} from './index';

describe('typeGuards', () => {
  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString(' text ')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('\t\n')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(['a'])).toBe(true);
      expect(isNonEmptyArray([null])).toBe(true);
    });

    it('should return false for empty arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray(undefined)).toBe(false);
    });
  });

  describe('getMapValue', () => {
    it('should return value for existing key', () => {
      const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
      expect(getMapValue(map, 'key1')).toBe('value1');
      expect(getMapValue(map, 'key2')).toBe('value2');
    });

    it('should return undefined for non-existing key', () => {
      const map = new Map([['key1', 'value1']]);
      expect(getMapValue(map, 'nonexistent')).toBeUndefined();
    });

    it('should handle empty map', () => {
      const map = new Map();
      expect(getMapValue(map, 'any')).toBeUndefined();
    });
  });

  describe('toSafeNumber', () => {
    it('should return valid numbers as-is', () => {
      expect(toSafeNumber(42)).toBe(42);
      expect(toSafeNumber(3.14)).toBe(3.14);
      expect(toSafeNumber(-10)).toBe(-10);
      expect(toSafeNumber(0)).toBe(0);
    });

    it('should return default value for invalid inputs', () => {
      expect(toSafeNumber(NaN)).toBe(0);
      expect(toSafeNumber(Infinity)).toBe(0);
      expect(toSafeNumber(-Infinity)).toBe(0);
      expect(toSafeNumber('not a number')).toBe(0);
      expect(toSafeNumber(null)).toBe(0);
      expect(toSafeNumber(undefined)).toBe(0);
    });

    it('should use custom default value', () => {
      expect(toSafeNumber(NaN, 100)).toBe(100);
      expect(toSafeNumber('invalid', -1)).toBe(-1);
    });
  });

  describe('hasProperty', () => {
    it('should return true for existing properties', () => {
      const obj = { name: 'test', age: 25 };
      expect(hasProperty(obj, 'name')).toBe(true);
      expect(hasProperty(obj, 'age')).toBe(true);
    });

    it('should return false for non-existing properties', () => {
      const obj = { name: 'test' };
      expect(hasProperty(obj, 'age')).toBe(false);
      expect(hasProperty(obj, 'nonExistent')).toBe(false);
    });

    it('should return false for null/undefined objects', () => {
      expect(hasProperty(null as never, 'any')).toBe(false);
      expect(hasProperty(undefined as never, 'any')).toBe(false);
    });
  });

  describe('createSafeDate', () => {
    it('should create valid dates from valid inputs', () => {
      const date1 = createSafeDate('2024-01-15');
      const date2 = createSafeDate(new Date());
      const date3 = createSafeDate(Date.now());

      expect(date1).toBeInstanceOf(Date);
      expect(date2).toBeInstanceOf(Date);
      expect(date3).toBeInstanceOf(Date);
    });

    it('should return null for invalid inputs', () => {
      expect(createSafeDate('invalid-date')).toBeNull();
      expect(createSafeDate(null)).toBeNull();
      expect(createSafeDate(undefined)).toBeNull();
    });
  });
});
