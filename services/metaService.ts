// Meta API wrapper (calls our own /api/meta route to avoid CORS)
const callMetaAPI = async (
  action: string,
  params: Record<string, string> = {},
) => {
  const queryParams = new URLSearchParams({ action, ...params });
  const url = `/api/meta?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = `Meta API error: ${action} returned ${response.status}`;
      console.error(`${errorMsg} - ${errorBody}`);
      throw new Error(`${errorMsg}. Please try again.`);
    }

    return response.json();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Unknown error calling ${action}`;
    console.error(`[Meta API] ${action} failed:`, message);
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
    return await callMetaAPI("getExchangeRates", {
      base_currency: base,
    });
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : `Failed to fetch exchange rates for ${base}`;
    console.error(`[Exchange Rates] ${msg}`);
    throw new Error(`Unable to fetch exchange rates: ${msg}`);
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
