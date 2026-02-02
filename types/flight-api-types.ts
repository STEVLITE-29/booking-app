export interface Destination {
  id: string;
  name: string;
  code?: string;
  type: string;
  iataCode?: string;
  cityName?: string;
  countryName?: string;
}

export interface DestinationSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: Destination[];
}

// Flight Segment Types
export interface Airport {
  code: string;
  name: string;
  city: string;
  countryCode?: string;
  terminal?: string;
}

export interface FlightSegment {
  departureTime: string;
  arrivalTime: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  airlineName: string;
  airlineCode: string;
  airlineLogo?: string;
  flightNumber: string;
  duration: string;
  durationMinutes?: number;
  aircraft?: string;
  operatingAirline?: string;
  cabinClass?: string;
  bookingClass?: string;
}

// Price Types
export interface PriceAmount {
  units: number;
  nanos: number;
}

export interface Fee {
  type: string;
  amount: PriceAmount;
}

export interface PriceBreakdown {
  total: PriceAmount;
  baseFare: PriceAmount;
  taxes?: PriceAmount;
  fees?: Fee[];
}

// Baggage Types
export interface Baggage {
  cabin: string;
  checked: string;
}

// Flight API Types
export interface FlightData {
  token: string;
  id?: string;
  segments: FlightSegment[];
  totalDuration: string;
  totalDurationMinutes?: number;
  duration?: string;
  stops: number;
  priceBreakdown: PriceBreakdown;
  price?: number;
  amenities?: string[];
  baggage?: Baggage;
  cancellation?: {
    allowed: boolean;
    type?: string;
  };
  isSelfTransfer?: boolean;
  visaInformation?: string;
}

export interface FlightSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    flights: FlightData[];
    totalResults?: number;
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

// Response from searchFlights service (contains transformed flights)
export interface FlightSearchServiceResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    flights: Flight[];
    totalResults?: number;
    aggregation?: Record<string, unknown>;
  };
}

// Min Price Types
export interface MinPriceData {
  price: number;
  currency: string;
  date?: string;
  priceByClass?: {
    economy: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
}

export interface MinPriceResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: MinPriceData;
}

// Store Types (matching flight-store.ts)
export interface Flight {
  id: string;
  token: string;
  segments: FlightSegment[];
  totalDuration: string;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  cabinClass: string;
  facilities: string[];
  baggage?: Baggage;
}

export interface FlightSearchParams {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  stops: "none" | "any";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  sort: "BEST" | "CHEAPEST" | "FASTEST";
  currency: string;
}

// Helper type for transformed flights
export type TransformedFlight = Flight;
