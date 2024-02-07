// formatUtils.js

// FormatPrice function
export function formatPrice(price) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(price);
}

// New formatDateTime function
export function formatDateTime(dateTimeString) {
  // Assuming dateTimeString is in ISO format, you can format it as desired
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-ZA', {
    day: '2-digit', // Use "numeric" for single digit days
    month: 'short', // "long" for full month name, "numeric" for month number
    year: 'numeric',
    hour: '2-digit', // 24 hour format; remove for no hour
    minute: '2-digit', // Remove for no minutes
    second: '2-digit', // Remove for no seconds
    hour12: true, // Use false for 24-hour format
  });
}

  