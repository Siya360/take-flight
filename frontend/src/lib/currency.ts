// Currency conversion utility
interface CurrencyRates {
  [key: string]: number;
}

// Mock exchange rates - in production, this would fetch from a real API
const EXCHANGE_RATES: CurrencyRates = {
  USD: 1.0,
  ZAR: 18.50, // 1 USD = 18.50 ZAR (approximate)
  EUR: 0.85,
  GBP: 0.75,
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = usdAmount * EXCHANGE_RATES[toCurrency];
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

export const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    ZAR: 'R',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getUserCurrency = (): string => {
  // In a real app, you might detect user location or use their preferences
  // For South African users, default to ZAR
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  if (timezone.includes('Africa/Johannesburg') || timezone.includes('Africa/Cape_Town')) {
    return 'ZAR';
  }
  
  // Default to USD for other regions
  return 'USD';
};

// Real-time currency conversion (mock implementation)
export const fetchExchangeRates = async (): Promise<CurrencyRates> => {
  // In production, you would call a real exchange rate API like:
  // - Fixer.io
  // - ExchangeRate-API
  // - Open Exchange Rates
  
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(EXCHANGE_RATES);
    }, 500);
  });
};

export const convertFlightPrice = (flight: any, targetCurrency: string = 'ZAR') => {
  const convertedPrice = convertCurrency(flight.price, flight.currency, targetCurrency);
  return {
    ...flight,
    price: convertedPrice,
    currency: targetCurrency,
    originalPrice: flight.price,
    originalCurrency: flight.currency,
  };
};
