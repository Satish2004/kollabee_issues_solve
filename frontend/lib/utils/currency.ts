import axios from 'axios';

// Type for currency conversion response
interface CurrencyConversionResponse {
  amount: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

// Cache for currency rates to avoid too many API calls
let currencyRatesCache: {
  rates: { [key: string]: number };
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    // Add more currency symbols as needed
  };
  return symbols[currency] || currency;
};

export const getUserCurrency = async (): Promise<string> => {
  try {
    const response = await axios.get('https://ipapi.co/currency/');
    console.log('User currency detected:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detecting user currency:', error);
    return 'USD'; // Default fallback
  }
};

export const convertCurrency = async (
  amount: number | null | undefined,
  from: string = 'USD',
  to: string = 'INR'
): Promise<number> => {
 
  try {

    // Handle invalid input
    if (amount === null || amount === undefined || isNaN(amount)) {
      console.log('Invalid amount for currency conversion:', amount);
      return 0;
    }
    console.log("Converting currency:", amount, from, to);
    // Check cache first
   
    // If no cache or expired, fetch new rates
    console.log(`Fetching currency conversion for ${amount} ${from} to ${to}`);
    const response = await axios.get<CurrencyConversionResponse>(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    );
   
    // Update cache
    currencyRatesCache = {
      rates: response.data.rates,
      timestamp: Date.now(),
    };

    console.log('Currency conversion response:', response.data);
    const convertedAmount = response.data.rates[to];
    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error('Error converting currency:', error);
    // Since we've already checked for null/undefined at the start,
    // and returned 0 in those cases, amount here is definitely a number
    return Number((amount || 0).toFixed(2));
  }
};

export const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'USD'
): string => {
  // Handle invalid input
  if (amount === null || amount === undefined || amount === '') {
    console.log('Invalid amount for currency formatting:', amount);
    return `${getCurrencySymbol(currency)}0.00`;
  }

  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle NaN
  if (isNaN(numAmount)) {
    console.log('NaN amount for currency formatting:', amount);
    return `${getCurrencySymbol(currency)}0.00`;
  }

  const symbol = getCurrencySymbol(currency);
  return `${symbol}${numAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}; 