import { searchMockDestinations, searchMockFlights } from "@/data/flights";

const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const API_HOST = "booking-com15.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}/api/v1/flights`;

const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Toggle between mock and real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// API Response Types (matching Rapid API structure)
interface APIAirport {
  type?: string;
  code: string;
  name: string;
  city?: string;
  cityName?: string;
  country?: string;
  countryName?: string;
}

interface APICarrierData {
  name: string;
  code: string;
  logo?: string;
}

interface APIFlightInfo {
  facilities?: string[];
  flightNumber?: number | string;
  planeType?: string;
}

interface APILeg {
  departureTime: string;
  arrivalTime: string;
  departureAirport: APIAirport;
  arrivalAirport: APIAirport;
  cabinClass?: string;
  flightInfo?: APIFlightInfo;
  carriers?: string[];
  carriersData?: APICarrierData[];
  totalTime?: number;
}

interface APILuggageAllowance {
  luggageType?: string;
  ruleType?: string;
  maxTotalWeight?: number;
  massUnit?: string;
  maxPiece?: number;
  maxWeightPerPiece?: number;
  sizeRestrictions?: {
    maxLength?: number;
    maxWidth?: number;
    maxHeight?: number;
    sizeUnit?: string;
  };
}

interface APITravellerLuggage {
  travellerReference?: string;
  luggageAllowance?: APILuggageAllowance;
  personalItem?: boolean;
}

interface APISegment {
  departureAirport: APIAirport;
  arrivalAirport: APIAirport;
  departureTime: string;
  arrivalTime: string;
  legs: APILeg[];
  totalTime?: number;
  travellerCheckedLuggage?: APITravellerLuggage[];
  travellerCabinLuggage?: APITravellerLuggage[];
}

interface APIPriceBreakdown {
  total?: {
    currencyCode?: string;
    units?: number;
    nanos?: number;
  };
  baseFare?: {
    units?: number;
    nanos?: number;
  };
}

interface APIFlightOffer {
  token: string;
  segments: APISegment[];
  priceBreakdown?: APIPriceBreakdown;
}

interface APIFlightSearchResponse {
  status: boolean;
  message: string | string[] | Record<string, unknown>[];
  timestamp: number;
  data?: {
    flightOffers?: APIFlightOffer[];
    aggregation?: Record<string, unknown>;
  };
}

/**
 * Transform API flight offer to our Flight interface
 * This function works for both mock and real API data
 */
const transformFlightOffer = (offer: APIFlightOffer, currency: string) => {
  if (!offer.segments || offer.segments.length === 0) {
    throw new Error("Invalid flight offer: missing segments");
  }

  const firstSegment = offer.segments[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const lastSegment = offer.segments[offer.segments.length - 1];

  // Calculate total duration from segments
  const totalDurationSeconds = offer.segments.reduce(
    (total: number, seg: APISegment) => {
      return total + (seg.totalTime || 0);
    },
    0,
  );

  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const totalDuration = `${hours}h ${minutes}m`;

  // Count stops (total legs across all segments - number of segments)
  const totalLegs = offer.segments.reduce(
    (total, seg) => total + seg.legs.length,
    0,
  );
  const stops = totalLegs - 1;

  // Get price from priceBreakdown with multiple fallbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNumericFrom = (obj: any) => {
    if (!obj) return null;
    const units = typeof obj.units === "number" ? obj.units : undefined;
    const nanos = typeof obj.nanos === "number" ? obj.nanos : 0;
    if (units !== undefined) return units + nanos / 1000000000;
    return null;
  };

  let totalPrice =
    getNumericFrom(offer.priceBreakdown?.total) ??
    getNumericFrom(offer.priceBreakdown?.baseFare) ??
    0;

  const priceCurrency = offer.priceBreakdown?.total?.currencyCode || currency;

  // If we still have no usable price (0), set a safe fallback so UI can display something
  if (!totalPrice || totalPrice <= 0) {
    totalPrice = 1; // minimal safe fallback (app can display 'from $1')
  }

  // Extract facilities from first leg of first segment
  const facilities: string[] = [];
  if (firstSegment.legs && firstSegment.legs[0]?.flightInfo?.facilities) {
    facilities.push(...firstSegment.legs[0].flightInfo.facilities);
  }

  // Extract baggage information
  let cabinBaggage = "Personal item";
  let checkedBaggage = "Not included";

  if (
    firstSegment.travellerCabinLuggage &&
    firstSegment.travellerCabinLuggage.length > 0
  ) {
    const cabinInfo = firstSegment.travellerCabinLuggage[0];
    if (
      cabinInfo.luggageAllowance?.maxPiece &&
      cabinInfo.luggageAllowance.maxPiece > 0
    ) {
      const weight = cabinInfo.luggageAllowance.maxWeightPerPiece;
      const unit = cabinInfo.luggageAllowance.massUnit;
      if (weight && unit) {
        cabinBaggage = `${cabinInfo.luggageAllowance.maxPiece} piece(s) - ${weight}${unit}`;
      } else {
        cabinBaggage = `${cabinInfo.luggageAllowance.maxPiece} piece(s)`;
      }
    } else if (cabinInfo.personalItem) {
      cabinBaggage = "Personal item only";
    }
  }

  if (
    firstSegment.travellerCheckedLuggage &&
    firstSegment.travellerCheckedLuggage.length > 0
  ) {
    const checkedInfo = firstSegment.travellerCheckedLuggage[0];
    if (checkedInfo.luggageAllowance) {
      const luggage = checkedInfo.luggageAllowance;
      if (luggage.maxTotalWeight) {
        checkedBaggage = `${luggage.maxTotalWeight} ${luggage.massUnit || "KG"}`;
      } else if (luggage.maxPiece && luggage.maxWeightPerPiece) {
        checkedBaggage = `${luggage.maxPiece} piece(s) - ${luggage.maxWeightPerPiece}${luggage.massUnit || "KG"} each`;
      } else if (luggage.maxPiece) {
        checkedBaggage = `${luggage.maxPiece} piece(s)`;
      }
    }
  }

  // Transform segments to match our interface
  const transformedSegments = offer.segments.map((segment: APISegment) => {
    const firstLeg = segment.legs[0];
    const segmentDuration = segment.totalTime || 0;
    const segHours = Math.floor(segmentDuration / 3600);
    const segMinutes = Math.floor((segmentDuration % 3600) / 60);

    return {
      departureAirport: {
        code: segment.departureAirport.code,
        name: segment.departureAirport.name,
        city:
          segment.departureAirport.cityName ||
          segment.departureAirport.city ||
          "",
        country:
          segment.departureAirport.countryName ||
          segment.departureAirport.country ||
          "",
      },
      arrivalAirport: {
        code: segment.arrivalAirport.code,
        name: segment.arrivalAirport.name,
        city:
          segment.arrivalAirport.cityName || segment.arrivalAirport.city || "",
        country:
          segment.arrivalAirport.countryName ||
          segment.arrivalAirport.country ||
          "",
      },
      departureTime: segment.departureTime,
      arrivalTime: segment.arrivalTime,
      duration: `${segHours}h ${segMinutes}m`,
      airlineCode: firstLeg.carriersData?.[0]?.code || "XX",
      airlineName: firstLeg.carriersData?.[0]?.name || "Unknown Airline",
      flightNumber: firstLeg.flightInfo?.flightNumber?.toString() || "N/A",
    };
  });

  return {
    id: offer.token || `flight-${Date.now()}-${Math.random()}`,
    token: offer.token || "",
    segments: transformedSegments,
    totalDuration,
    stops,
    price: {
      amount: Math.round(totalPrice),
      currency: priceCurrency,
    },
    cabinClass: firstSegment.legs[0]?.cabinClass || "ECONOMY",
    facilities,
    baggage: {
      cabin: cabinBaggage,
      checked: checkedBaggage,
    },
  };
};

/**
 * Search for flight destinations (airports/cities) by query
 */
export const searchDestination = async (query: string) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = searchMockDestinations(query);
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
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Flight Destination Search] Failed:", msg);
    throw new Error(`Could not search destinations: ${msg}`);
  }
};

/**
 * Search for flights (one-way or round-trip)
 */
export const searchFlights = async (params: {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  stops?: "none" | "0" | "1" | "2";
  pageNo?: number;
  adults?: number;
  children?: string;
  sort?: "BEST" | "CHEAPEST" | "FASTEST";
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  currency_code?: string;
}) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const flightOffers = searchMockFlights({
          fromId: params.fromId,
          toId: params.toId,
          sort: params.sort,
          stops: params.stops,
        });

        // Transform mock offers to our format
        const transformedFlights = flightOffers.map((offer) =>
          transformFlightOffer(offer, params.currency_code || "USD"),
        );

        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            flights: transformedFlights,
            totalResults: transformedFlights.length,
          },
        });
      }, 500);
    });
  }

  // Real API call
  try {
    const {
      fromId,
      toId,
      departDate,
      returnDate,
      stops = "0",
      pageNo = 1,
      adults = 1,
      children,
      sort = "BEST",
      cabinClass = "ECONOMY",
      currency_code = "USD",
    } = params;

    const queryParams = new URLSearchParams({
      fromId,
      toId,
      departDate,
      stops,
      pageNo: pageNo.toString(),
      adults: adults.toString(),
      sort,
      cabinClass,
      currency_code,
    });

    if (children) {
      queryParams.append("children", children);
    }

    if (returnDate) {
      queryParams.append("returnDate", returnDate);
    }

    const url = `${BASE_URL}/searchFlights?${queryParams.toString()}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const apiResponse: APIFlightSearchResponse = await response.json();

    // Check if API returned error status
    if (apiResponse.status === false) {
      let errorMessage = "Failed to search flights";

      if (typeof apiResponse.message === "string") {
        errorMessage = apiResponse.message;
      } else if (Array.isArray(apiResponse.message)) {
        errorMessage = (
          apiResponse.message as Array<string | Record<string, unknown>>
        )
          .map((msg: string | Record<string, unknown>) => {
            if (typeof msg === "string") return msg;
            if (typeof msg === "object" && msg !== null) {
              return Object.entries(msg)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
            }
            return String(msg);
          })
          .join("; ");
      } else if (typeof apiResponse.message === "object") {
        errorMessage = JSON.stringify(apiResponse.message);
      }

      throw new Error(errorMessage);
    }

    // Check if API returned data field
    if (!apiResponse.data) {
      throw new Error("API returned no data field");
    }

    // IMPORTANT: The API returns flightOffers, not flights
    const flightOffers = apiResponse.data.flightOffers || [];

    if (flightOffers.length === 0) {
      return {
        status: true,
        message: "No flights found for this route and date",
        timestamp: Date.now(),
        data: {
          flights: [],
          totalResults: 0,
        },
      };
    }

    // Transform flight offers to our format
    console.log("🔄 Transforming flight offers...");
    const transformedFlights = flightOffers.map((offer: APIFlightOffer) =>
      transformFlightOffer(offer, currency_code),
    );

    console.log(
      "✅ Successfully transformed flights:",
      transformedFlights.length,
    );

    return {
      status: true,
      message: "Success",
      timestamp: Date.now(),
      data: {
        flights: transformedFlights,
        totalResults: transformedFlights.length,
        aggregation: apiResponse.data.aggregation,
      },
    };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Flight Search] Failed:", msg);
    throw new Error(`Could not search flights: ${msg}`);
  }
};

/**
 * Get detailed flight information
 */
export const getFlightDetails = async (params: {
  token: string;
  currency_code?: string;
}) => {
  try {
    const { token, currency_code = "USD" } = params;

    const queryParams = new URLSearchParams({
      token,
      currency_code,
    });

    const response = await fetch(
      `${BASE_URL}/getFlightDetails?${queryParams}`,
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
    console.error("[Flight Details] Failed:", msg);
    throw new Error(`Could not retrieve flight details: ${msg}`);
  }
};

/**
 * Get minimum price for a route
 */
export const getMinPrice = async (params: {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  currency_code?: string;
}) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const flightOffers = searchMockFlights({
          fromId: params.fromId,
          toId: params.toId,
        });

        if (flightOffers.length === 0) {
          resolve({
            status: true,
            message: "Success",
            timestamp: Date.now(),
            data: null,
          });
          return;
        }

        // Find minimum price
        const minPrice = Math.min(
          ...flightOffers.map((offer) => {
            const units = offer.priceBreakdown?.total?.units || 0;
            const nanos = offer.priceBreakdown?.total?.nanos || 0;
            return units + nanos / 1000000000;
          }),
        );

        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            price: Math.round(minPrice),
            currency: params.currency_code || "USD",
          },
        });
      }, 300);
    });
  }

  // Real API call
  try {
    const {
      fromId,
      toId,
      departDate,
      returnDate,
      cabinClass = "ECONOMY",
      currency_code = "USD",
    } = params;

    const queryParams = new URLSearchParams({
      fromId,
      toId,
      departDate,
      cabinClass,
      currency_code,
    });

    if (returnDate) {
      queryParams.append("returnDate", returnDate);
    }

    const response = await fetch(`${BASE_URL}/getMinPrice?${queryParams}`, {
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
    console.error("[Min Price] Failed:", msg);
    throw new Error(`Could not retrieve minimum price: ${msg}`);
  }
};
