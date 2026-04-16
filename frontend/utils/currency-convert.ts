export interface ExchangeRates {
  PHP: number;
  DKK: number;
}

export interface ConvertedPrices {
  USD: string;
  PHP: string;
  DKK: string;
}

export async function fetchExchangeRates(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed with status ${res.status}`);

    const data = (await res.json()) as { rates?: Record<string, number> };
    
    return {
      PHP: data.rates?.PHP ?? 0,
      DKK: data.rates?.DKK ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return null;
  }
}

export function formatCurrency(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function convertPrice(usdAmountInCents: number, exchangeRates: ExchangeRates): ConvertedPrices {
  const usdValue = usdAmountInCents / 100; // Convert cents to dollars
  
  return {
    USD: formatCurrency(usdValue, 'USD', 'en-US'),
    PHP: formatCurrency(usdValue * exchangeRates.PHP, 'PHP', 'en-PH'),
    DKK: formatCurrency(usdValue * exchangeRates.DKK, 'DKK', 'da-DK'),
  };
}
