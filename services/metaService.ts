// Meta API wrapper (calls our own /api/meta route to avoid CORS)
const callMetaAPI = async (
  action: string,
  params: Record<string, string> = {},
) => {
  const queryParams = new URLSearchParams({ action, ...params });
  const url = `/api/meta?${queryParams.toString()}`;

  try {
    console.log(`[Meta API] Fetching: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `Meta API error: ${action} returned ${response.status}`;

      // Log truncated body to avoid huge HTML dumps in console
      const truncated =
        errorBody.length > 1000
          ? errorBody.substring(0, 1000) + "..."
          : errorBody;
      console.error(`${errorMsg} - ${truncated}`);
      throw new Error(`${errorMsg}. Please try again.`);
    }

    // Ensure JSON before parsing, otherwise return text for diagnostics
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();
    console.warn(
      "[Meta API] Expected JSON but received non-JSON response:",
      text.substring(0, 500),
    );
    throw new Error("Meta API returned non-JSON response");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Unknown error calling ${action}`;
    // Log as warning since errors are handled by callers (e.g., getExchangeRates has fallback)
    console.warn(`[Meta API] ${action} failed:`, message);
    throw new Error(`Failed to ${action}: ${message}`);
  }
};

export const getLanguages = async () => {
  return callMetaAPI("getLanguages");
};

export const getCurrency = async () => {
  return callMetaAPI("getCurrency");
};

export const getExchangeRates = async (base = "USD") => {
  try {
    const result = await callMetaAPI("getExchangeRates", {
      base_currency: base,
    });
    return result;
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : `Failed to fetch exchange rates for ${base}`;
    console.warn(`[Exchange Rates] ${msg}`);
    // Return fallback object with a 1:1 rate to prevent crashes
    console.info(`[Exchange Rates] Using fallback exchange rate (${base}:1)`);
    return { rates: { [base]: 1 } };
  }
};

export const locationToLatLong = async (query: string) => {
  try {
    return await callMetaAPI("locationToLatLong", {
      query,
    });
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : `Failed to geocode location: ${query}`;
    console.error(`[Geocoding] ${msg}`);
    throw new Error(`Unable to find location "${query}": ${msg}`);
  }
};

const metaService = {
  getLanguages,
  getCurrency,
  getExchangeRates,
  locationToLatLong,
};
export default metaService;
