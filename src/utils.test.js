import { test, expect } from 'vitest';
import { applyCategory, daysBetween, formatDate, formatKsh, isStrongPassword, passwordStrength, photoUrl } from './utils';
import { answer } from './chatbot';

test('daysBetween: at least one day, zero when incomplete or reversed', () => {
  expect(daysBetween('2026-12-01', '2026-12-05')).toBe(4);
  expect(daysBetween('2026-12-01', '2026-12-01')).toBe(1);
  expect(daysBetween('2026-12-05', '2026-12-01')).toBe(0);
  expect(daysBetween('', '2026-12-01')).toBe(0);
});

test('applyCategory adds the keyword the catalogue filters on', () => {
  expect(applyCategory('Mara', 'trip')).toBe('Mara Trip');
  expect(applyCategory('Mara Trip', 'trip')).toBe('Mara Trip');
  expect(applyCategory('Sarova', 'hotel')).toBe('Sarova Hotel');
  expect(applyCategory('Hotel Sarova', 'hotel')).toBe('Hotel Sarova Hotel');
  expect(applyCategory('Toyota Model X', 'car')).toBe('Toyota Model X');
  expect(applyCategory('Prado', 'car')).toBe('Prado Car');
  expect(applyCategory('Anything', 'other')).toBe('Anything');
});

test('photoUrl prefers the API url, falls back to the legacy static path', () => {
  expect(photoUrl({ product_photo_url: 'http://x/a.png', product_photo: 'a.png' })).toBe('http://x/a.png');
  expect(photoUrl({ product_photo: 'a.png' })).toMatch(/\/static\/images\/a\.png$/);
  expect(photoUrl({})).toBe('');
});

test('formatKsh and password rules', () => {
  expect(formatKsh(12500)).toContain('12');
  expect(isStrongPassword('abc12345!')).toBe(true);
  expect(isStrongPassword('abcdefgh')).toBe(false);
  expect(passwordStrength('').label).toBe('');
});

test('chatbot matches whole words and links to pages', () => {
  expect(answer('hello').text).toMatch(/Hi!/);
  expect(answer('this is which').text).toMatch(/I can help with/); // "hi" inside words must not match
  expect(answer('I want to rent a car').to).toBe('/bookcar');
  expect(answer('how do I pay with mpesa').text).toMatch(/M-Pesa/);
});

test('formatDate handles empty and ISO values', () => {
  expect(formatDate('')).toBe('');
  expect(formatDate('2026-12-01T10:00:00Z')).toContain('2026');
});
