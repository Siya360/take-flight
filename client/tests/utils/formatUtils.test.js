// formatUtils.test.js
import { formatPrice, formatDateTime } from '../../src/utils/formatUtils';

describe('formatUtils', () => {
  describe('formatPrice', () => {
    it('formats price correctly in ZAR currency', () => {
      const price = 1000;
      const formattedPrice = formatPrice(price);
      // Expectation might need adjustment based on locale specifics
      expect(formattedPrice).toBe('R 1,000.00');
    });
  });

  describe('formatDateTime', () => {
    it('formats ISO dateTimeString correctly for en-ZA locale', () => {
      const dateTimeString = '2023-01-01T12:00:00Z';
      const formattedDateTime = formatDateTime(dateTimeString);
      // Expected result might vary based on environment's timeZone settings
      expect(formattedDateTime).toMatchInlineSnapshot(`"01 Jan 2023, 02:00:00 PM"`);
    });
  });
});

  