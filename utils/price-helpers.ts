/**
 * Read preferred currency from localStorage (client only). Falls back to USD.
 */
export const getPreferredCurrency = (): string => {
  try {
    if (typeof window === "undefined") return "USD";
    const v = window.localStorage.getItem("preferred_currency");
    return v || "USD";
  } catch (e) {
    return "USD";
  }
};

/**
 * Set preferred currency in localStorage (client only).
 */
export const setPreferredCurrency = (currency: string) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("preferred_currency", currency);
  } catch (e) {
    // ignore
  }
};
/**
 * Exchange rates cache and helpers
 */
let exchangeRatesCache: {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number;
} | null = null;

/**
 * Load exchange rates from a meta service response.
 * Expects an object with `rates` mapping currency -> rate.
 * Falls back gracefully on error without throwing.
 */
export const loadExchangeRates = async (
  fetchRatesFn: (base?: string) => Promise<any>,
  base = "USD",
) => {
  const maxAttempts = 2;
  let attempt = 0;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      const res = await fetchRatesFn(base);
      const rates = res?.data?.rates || res?.rates || null;
      if (rates && typeof rates === "object") {
        exchangeRatesCache = { base, rates, fetchedAt: Date.now() };
        return exchangeRatesCache;
      }

      // If we got a response but no rates, no need to retry further
      console.warn(`[Exchange Rates] Response received but no rates found`);
      return null;
    } catch (e) {
      console.warn(`Failed to load exchange rates (attempt ${attempt}):`, e);
      if (attempt >= maxAttempts) {
        console.info(
          `[Exchange Rates] All attempts failed; app will use fallback 1:1 rates`,
        );
        return null;
      }
      await sleep(600);
    }
  }
  return null;
};

/**
 * Convert amount from one currency to another using cached rates.
 * If rates not loaded or currencies missing, returns original amount.
 */
export const convertAmount = (
  amount: number,
  fromCurrency = "USD",
  toCurrency = "USD",
) => {
  if (!exchangeRatesCache) return amount;
  const { base, rates } = exchangeRatesCache;
  if (fromCurrency === toCurrency) return amount;

  // Convert amount -> base -> target
  const rateFrom = fromCurrency === base ? 1 : rates[fromCurrency];
  const rateTo = toCurrency === base ? 1 : rates[toCurrency];
  if (!rateFrom || !rateTo) return amount;

  const amountInBase = amount / rateFrom;
  const converted = amountInBase * rateTo;
  return converted;
};

/**
 * Safely formats flight price amount
 * Handles null, undefined, invalid price values and optional target currency conversion
 */
export const formatFlightPrice = (
  price: { amount?: number | null; currency?: string } | null | undefined,
  options?: { targetCurrency?: string },
) => {
  const defaultCurrency = "USD";
  const defaultAmount = 0;

  if (!price) return `${defaultCurrency} ${defaultAmount.toLocaleString()}`;

  const currency = price.currency || defaultCurrency;
  const amount = price.amount ?? defaultAmount;
  const validAmount =
    typeof amount === "number" && !isNaN(amount) ? amount : defaultAmount;

  const target = options?.targetCurrency;
  let displayAmount = validAmount;
  let displayCurrency = currency;

  if (target) {
    try {
      displayAmount = convertAmount(validAmount, currency, target);
      displayCurrency = target;
    } catch (e) {
      // fallback to original
      console.warn("Currency conversion failed, showing original currency", e);
    }
  }

  return `${displayCurrency} ${Math.round(displayAmount).toLocaleString()}`;
};

/**
 * Safely gets price amount as number
 */
export const getFlightPriceAmount = (
  price: { amount?: number | null } | null | undefined,
): number => {
  if (!price || price.amount == null) return 0;
  return typeof price.amount === "number" && !isNaN(price.amount)
    ? price.amount
    : 0;
};

/**
 * Safely gets price currency
 */
export const getFlightPriceCurrency = (
  price: { currency?: string } | null | undefined,
): string => {
  return price?.currency || "USD";
};
