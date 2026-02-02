export interface DestinationSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: Array<{
    id: string;
    name: string;
    code?: string;
    type: string;
    iataCode?: string;
    cityName?: string;
    countryName?: string;
  }>;
}

export interface FlightSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    flights: Array<{
      token: string;
      segments: Array<{
        departureTime: string;
        arrivalTime: string;
        departureAirport: {
          code: string;
          name: string;
          city: string;
          countryCode: string;
        };
        arrivalAirport: {
          code: string;
          name: string;
          city: string;
          countryCode: string;
        };
        airlineName: string;
        airlineCode: string;
        airlineLogo?: string;
        flightNumber: string;
        duration: string;
        durationMinutes: number;
        aircraft?: string;
        operatingAirline?: string;
      }>;
      totalDuration: string;
      totalDurationMinutes: number;
      stops: number;
      priceBreakdown: {
        total: {
          units: number;
          nanos: number;
        };
        baseFare: {
          units: number;
          nanos: number;
        };
        fees: Array<{
          type: string;
          amount: {
            units: number;
            nanos: number;
          };
        }>;
      };
      amenities?: string[];
      baggage?: {
        cabin: string;
        checked: string;
      };
      cancellation?: {
        allowed: boolean;
        type?: string;
      };
      isSelfTransfer?: boolean;
      visaInformation?: string;
    }>;
    totalResults: number;
    filterStats?: {
      maxPrice: number;
      minPrice: number;
      stops: {
        none: number;
        one: number;
        twoOrMore: number;
      };
      airlines: Array<{
        name: string;
        count: number;
      }>;
    };
  };
}

export interface FlightDetailsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    token: string;
    segments: Array<{
      departureTime: string;
      arrivalTime: string;
      departureAirport: {
        code: string;
        name: string;
        city: string;
        terminal?: string;
      };
      arrivalAirport: {
        code: string;
        name: string;
        city: string;
        terminal?: string;
      };
      airlineName: string;
      airlineCode: string;
      flightNumber: string;
      duration: string;
      aircraft: string;
      cabinClass: string;
      bookingClass: string;
      fareBasis?: string;
      mileage?: number;
    }>;
    priceBreakdown: {
      total: {
        units: number;
        nanos: number;
      };
      baseFare: {
        units: number;
        nanos: number;
      };
      taxes: {
        units: number;
        nanos: number;
      };
      fees: Array<{
        type: string;
        amount: {
          units: number;
          nanos: number;
        };
      }>;
    };
    passengerPricing: Array<{
      type: string;
      count: number;
      baseFare: {
        units: number;
        nanos: number;
      };
      taxes: {
        units: number;
        nanos: number;
      };
    }>;
    baggage: {
      cabin: {
        weight: string;
        pieces: number;
      };
      checked: {
        weight: string;
        pieces: number;
      };
    };
    amenities: string[];
    cancellationPolicy: {
      allowed: boolean;
      penaltyAmount?: {
        units: number;
        nanos: number;
      };
      deadline?: string;
    };
    changePolicy: {
      allowed: boolean;
      penaltyAmount?: {
        units: number;
        nanos: number;
      };
    };
  };
}

export interface MinPriceResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    price: number;
    currency: string;
    date: string;
    priceByClass: {
      economy: number;
      premiumEconomy?: number;
      business?: number;
      first?: number;
    };
  };
}

export interface SeatMapResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    segments: Array<{
      segmentId: string;
      departureAirport: string;
      arrivalAirport: string;
      cabin: {
        type: string;
        layout: string; // e.g., "3-3-3"
        rows: Array<{
          number: number;
          seats: Array<{
            column: string; // A, B, C, etc.
            available: boolean;
            type: string; // window, aisle, middle
            price?: {
              units: number;
              nanos: number;
            };
            characteristics?: string[]; // extra legroom, exit row, etc.
          }>;
        }>;
      };
    }>;
  };
}

// Flight Search Parameters
export interface FlightSearchParams {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
  children?: string; // Format: "0,17" (number of children, max age)
  infants?: number;
  stops?: "none" | "any";
  pageNo?: number;
  sort?: "BEST" | "CHEAPEST" | "FASTEST";
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  currency_code?: string;
}

export interface MultiStopLeg {
  fromId: string;
  toId: string;
  date: string; // Format: YYYY-MM-DD
}

export interface MultiStopSearchParams {
  legs: MultiStopLeg[];
  pageNo?: number;
  adults?: number;
  children?: string;
  sort?: "BEST" | "CHEAPEST" | "FASTEST";
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  currency_code?: string;
}

// Utility Types
export type CabinClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
export type SortOption = "BEST" | "CHEAPEST" | "FASTEST";
export type StopsOption = "none" | "any";

// Helper function to convert price from API format
export const convertPrice = (priceObj: {
  units: number;
  nanos: number;
}): number => {
  return priceObj.units + priceObj.nanos / 1000000000;
};

// Helper function to format duration
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper function to format date for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};
