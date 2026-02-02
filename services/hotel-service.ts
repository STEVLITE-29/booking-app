import {
  searchMockHotelDestinations,
  searchMockHotels,
  getMockHotelDetails,
} from "@/data/hotels";

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const API_HOST = "booking-com15.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}/api/v1/hotels`;

const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Toggle between mock and real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false";

/**
 * Search for hotel destinations (cities, regions, etc.)
 */
export const searchHotelDestination = async (query: string) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = searchMockHotelDestinations(query);
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: results,
        });
      }, 300);
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/searchDestination?query=${encodeURIComponent(query)}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // Normalize returned hotels to guarantee price field
    if (data && data.data && Array.isArray(data.data.hotels)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.hotels = data.data.hotels.map((h: any) => {
        const propPb = h.property?.priceBreakdown;
        const gross =
          propPb?.grossPrice?.value ?? propPb?.strikethroughPrice?.value ?? 0;

        // Ensure top-level priceBreakdown exists for UI compatibility
        h.priceBreakdown = h.priceBreakdown || propPb || {};
        h.priceBreakdown.grossPrice = h.priceBreakdown.grossPrice || {};
        h.priceBreakdown.grossPrice.value = gross;
        h.priceBreakdown.grossPrice.currency =
          h.priceBreakdown.grossPrice.currency ||
          propPb?.grossPrice?.currency ||
          propPb?.strikethroughPrice?.currency ||
          h.property?.currency ||
          "USD";

        if (!gross || gross <= 0) {
          console.warn(
            `[Hotel Search by Coordinates] No valid price found for hotel ${h.property?.id}`,
          );
        }

        return h;
      });
    }
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(
      `[Hotel Destination Search] Failed for query "${query}":`,
      msg,
    );
    throw new Error(`Could not search hotel destinations: ${msg}`);
  }
};

/**
 * Get available filters for hotel search
 */
export const getHotelFilters = async (params: {
  dest_id: string;
  search_type: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
}) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            filters: [
              {
                filterId: "price",
                name: "Price",
                type: "range",
                min: 50,
                max: 500,
              },
              {
                filterId: "rating",
                name: "Star Rating",
                type: "multi_select",
                options: [
                  { id: "5", label: "5 stars" },
                  { id: "4", label: "4 stars" },
                  { id: "3", label: "3 stars" },
                  { id: "2", label: "2 stars" },
                  { id: "1", label: "1 star" },
                ],
              },
              {
                filterId: "amenities",
                name: "Amenities",
                type: "multi_select",
                options: [
                  { id: "wifi", label: "Free WiFi" },
                  { id: "pool", label: "Swimming Pool" },
                  { id: "parking", label: "Free Parking" },
                  { id: "gym", label: "Fitness Center" },
                  { id: "restaurant", label: "Restaurant" },
                ],
              },
            ],
          },
        });
      }, 200);
    });
  }

  try {
    const {
      dest_id,
      search_type,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
    } = params;

    const queryParams = new URLSearchParams({
      dest_id,
      search_type,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
    });

    const url = `${BASE_URL}/getFilter?${queryParams}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Filters] Failed to fetch:", msg);
    throw new Error(`Could not retrieve hotel filters: ${msg}`);
  }
};

/**
 * Get sort options for hotel search
 */
export const getHotelSortOptions = async (params: {
  dest_id: string;
  search_type: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
}) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            sortOptions: [
              { id: "relevance", label: "Relevance" },
              { id: "price_asc", label: "Price: Low to High" },
              { id: "price_desc", label: "Price: High to Low" },
              { id: "rating", label: "Top Rated" },
              { id: "distance", label: "Distance" },
              { id: "review_score", label: "Guest Review" },
            ],
          },
        });
      }, 200);
    });
  }

  try {
    const {
      dest_id,
      search_type,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
    } = params;

    const queryParams = new URLSearchParams({
      dest_id,
      search_type,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
    });

    const url = `${BASE_URL}/getSortBy?${queryParams}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Sort Options] Failed to fetch:", msg);
    throw new Error(`Could not retrieve sort options: ${msg}`);
  }
};

/**
 * Search for hotels by destination
 */
export const searchHotels = async (params: {
  dest_id: string;
  search_type: string;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  page_number?: number;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hotels = searchMockHotels(params.dest_id);
        // Ensure hotel prices are available for mock data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = hotels.map((h: any) => {
          const gross =
            h.priceBreakdown?.grossPrice?.value ?? h.property?.minPrice ?? 0;
          if (!gross || gross <= 0) {
            // Try alternate fields
            const alt =
              h.priceBreakdown?.publicPrice ?? h.property?.minPrice ?? 1;
            h.priceBreakdown = h.priceBreakdown || {};
            h.priceBreakdown.grossPrice = h.priceBreakdown.grossPrice || {};
            h.priceBreakdown.grossPrice.value = alt || 1;
          }
          return h;
        });

        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            hotels: normalized,
            totalResults: normalized.length,
          },
        });
      }, 500);
    });
  }

  try {
    const {
      dest_id,
      search_type,
      arrival_date,
      departure_date,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
      page_number = 1,
      units = "metric",
      temperature_unit = "c",
      languagecode = "en-us",
      currency_code = "USD",
      location = "US",
    } = params;

    const queryParams = new URLSearchParams({
      dest_id,
      search_type,
      arrival_date,
      departure_date,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
      page_number: page_number.toString(),
      units,
      temperature_unit,
      languagecode,
      currency_code,
      location,
    });

    const response = await fetch(`${BASE_URL}/searchHotels?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    // Normalize returned hotels to guarantee price field
    if (data && data.data && Array.isArray(data.data.hotels)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.hotels = data.data.hotels.map((h: any) => {
        const propPb = h.property?.priceBreakdown;
        const gross =
          propPb?.grossPrice?.value ?? propPb?.strikethroughPrice?.value ?? 0;

        // Ensure top-level priceBreakdown exists for UI compatibility
        h.priceBreakdown = h.priceBreakdown || propPb || {};
        h.priceBreakdown.grossPrice = h.priceBreakdown.grossPrice || {};
        h.priceBreakdown.grossPrice.value = gross;
        h.priceBreakdown.grossPrice.currency =
          h.priceBreakdown.grossPrice.currency ||
          propPb?.grossPrice?.currency ||
          propPb?.strikethroughPrice?.currency ||
          h.property?.currency ||
          "USD";

        if (!gross || gross <= 0) {
          console.warn(
            `[Hotel Search] No valid price found for hotel ${h.property?.id}`,
          );
        }

        return h;
      });
    }

    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Search] Failed:", msg);
    throw new Error(`Could not search hotels: ${msg}`);
  }
};

/**
 * Search hotels by coordinates (latitude/longitude)
 */
export const searchHotelsByCoordinates = async (params: {
  latitude: number;
  longitude: number;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  page_number?: number;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}) => {
  try {
    const {
      latitude,
      longitude,
      arrival_date,
      departure_date,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
      page_number = 1,
      units = "metric",
      temperature_unit = "c",
      languagecode = "en-us",
      currency_code = "USD",
      location = "US",
    } = params;

    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      arrival_date,
      departure_date,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
      page_number: page_number.toString(),
      units,
      temperature_unit,
      languagecode,
      currency_code,
      location,
    });

    const response = await fetch(
      `${BASE_URL}/searchHotelsByCoordinates?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    // Normalize returned hotels to guarantee price field
    if (data && data.data && Array.isArray(data.data.hotels)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.hotels = data.data.hotels.map((h: any) => {
        const propPb = h.property?.priceBreakdown;
        const gross =
          propPb?.grossPrice?.value ?? propPb?.strikethroughPrice?.value ?? 0;

        h.priceBreakdown = h.priceBreakdown || propPb || {};
        h.priceBreakdown.grossPrice = h.priceBreakdown.grossPrice || {};
        h.priceBreakdown.grossPrice.value = gross;
        h.priceBreakdown.grossPrice.currency =
          h.priceBreakdown.grossPrice.currency ||
          propPb?.grossPrice?.currency ||
          propPb?.strikethroughPrice?.currency ||
          h.property?.currency ||
          "USD";

        if (!gross || gross <= 0) {
          console.warn(
            `[Hotel Search by Coordinates] No valid price found for hotel ${h.property?.id}`,
          );
        }

        return h;
      });
    }

    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Search by Coordinates] Failed:", msg);
    throw new Error(`Could not search hotels by coordinates: ${msg}`);
  }
};

/**
 * Get detailed hotel information
 */
export const getHotelDetails = async (params: {
  hotel_id: number;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
}) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const details = getMockHotelDetails(params.hotel_id);
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: details,
        });
      }, 300);
    });
  }

  try {
    const {
      hotel_id,
      arrival_date,
      departure_date,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
      units = "metric",
      temperature_unit = "c",
      languagecode = "en-us",
      currency_code = "USD",
    } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      arrival_date,
      departure_date,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
      units,
      temperature_unit,
      languagecode,
      currency_code,
    });

    const response = await fetch(`${BASE_URL}/getHotelDetails?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Details] Failed:", msg);
    throw new Error(`Could not retrieve hotel details: ${msg}`);
  }
};

/**
 * Get hotel availability
 */
export const getHotelAvailability = async (params: {
  hotel_id: number;
  arrival_date: string;
  departure_date: string;
  currency_code?: string;
  location?: string;
}) => {
  try {
    const {
      hotel_id,
      arrival_date,
      departure_date,
      currency_code = "USD",
      location = "US",
    } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      arrival_date,
      departure_date,
      currency_code,
      location,
    });

    const response = await fetch(`${BASE_URL}/getAvailability?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Availability] Failed:", msg);
    throw new Error(`Could not retrieve availability: ${msg}`);
  }
};

/**
 * Get hotel description and information
 */
export const getHotelDescription = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getDescriptionAndInfo?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Description] Failed:", msg);
    throw new Error(`Could not retrieve hotel description: ${msg}`);
  }
};

/**
 * Get room list for a hotel
 */
export const getHotelRoomList = async (params: {
  hotel_id: number;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}) => {
  try {
    const {
      hotel_id,
      arrival_date,
      departure_date,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
      units = "metric",
      temperature_unit = "c",
      languagecode = "en-us",
      currency_code = "USD",
      location = "US",
    } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      arrival_date,
      departure_date,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
      units,
      temperature_unit,
      languagecode,
      currency_code,
      location,
    });

    const response = await fetch(`${BASE_URL}/getRoomList?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Room List] Failed:", msg);
    throw new Error(`Could not retrieve room list: ${msg}`);
  }
};

/**
 * Get payment features for a hotel
 */
export const getPaymentFeatures = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getPaymentFeatures?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Payment Features] Failed:", msg);
    throw new Error(`Could not retrieve payment features: ${msg}`);
  }
};

/**
 * Get hotel policies
 */
export const getHotelPolicies = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getHotelPolicies?${queryParams}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Policies] Failed:", msg);
    throw new Error(`Could not retrieve policies: ${msg}`);
  }
};

/**
 * Get children policies
 */
export const getChildrenPolicies = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/propertyChildrenPolicies?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Children Policies] Failed:", msg);
    throw new Error(`Could not retrieve children policies: ${msg}`);
  }
};

/**
 * Get hotel review scores
 */
export const getHotelReviewScores = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getHotelReviewScores?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Review Scores] Failed:", msg);
    throw new Error(`Could not retrieve review scores: ${msg}`);
  }
};

/**
 * Get review filter metadata
 */
export const getReviewFilterMetadata = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getHotelReviewsFilterMetadata?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Review Filters] Failed:", msg);
    throw new Error(`Could not retrieve review filters: ${msg}`);
  }
};

/**
 * Get nearby cities
 */
export const getNearbyCities = async (params: {
  latitude: number;
  longitude: number;
  languagecode?: string;
}) => {
  try {
    const { latitude, longitude, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      languagecode,
    });

    const response = await fetch(`${BASE_URL}/getNearbyCities?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Nearby Cities] Failed:", msg);
    throw new Error(`Could not retrieve nearby cities: ${msg}`);
  }
};

/**
 * Get popular attractions nearby
 */
export const getPopularAttractions = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getPopularAttractionNearBy?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Popular Attractions] Failed:", msg);
    throw new Error(`Could not retrieve popular attractions: ${msg}`);
  }
};

/**
 * Get room list with availability
 */
export const getRoomListWithAvailability = async (params: {
  hotel_id: number;
  arrival_date: string;
  departure_date: string;
  adults?: number;
  children_age?: string;
  room_qty?: number;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}) => {
  try {
    const {
      hotel_id,
      arrival_date,
      departure_date,
      adults = 1,
      children_age = "0,17",
      room_qty = 1,
      units = "metric",
      temperature_unit = "c",
      languagecode = "en-us",
      currency_code = "USD",
      location = "US",
    } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      arrival_date,
      departure_date,
      adults: adults.toString(),
      children_age,
      room_qty: room_qty.toString(),
      units,
      temperature_unit,
      languagecode,
      currency_code,
      location,
    });

    const response = await fetch(
      `${BASE_URL}/getRoomListWithAvailability?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Room Availability] Failed:", msg);
    throw new Error(`Could not retrieve room availability: ${msg}`);
  }
};

/**
 * Get hotel photos
 */
export const getHotelPhotos = async (params: { hotel_id: number }) => {
  try {
    const { hotel_id } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
    });

    const response = await fetch(`${BASE_URL}/getHotelPhotos?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Photos] Failed:", msg);
    throw new Error(`Could not retrieve hotel photos: ${msg}`);
  }
};

/**
 * Get hotel facilities
 */
export const getHotelFacilities = async (params: {
  hotel_id: number;
  languagecode?: string;
}) => {
  try {
    const { hotel_id, languagecode = "en-us" } = params;

    const queryParams = new URLSearchParams({
      hotel_id: hotel_id.toString(),
      languagecode,
    });

    const response = await fetch(
      `${BASE_URL}/getHotelFacilities?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Hotel Facilities] Failed:", msg);
    throw new Error(`Could not retrieve hotel facilities: ${msg}`);
  }
};
