import { create } from "zustand";

// 5-minute cache duration for flight data
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export cache instances
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flightDestinationCache = new SimpleCache<any>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flightSearchCache = new SimpleCache<any>();

// Cache key builder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildFlightCacheKey = (params: any): string => {
  return JSON.stringify({
    fromId: params.fromId,
    toId: params.toId,
    departDate: params.departDate,
    returnDate: params.returnDate,
    adults: params.adults,
    children: params.children,
    stops: params.stops,
    cabinClass: params.cabinClass,
    sort: params.sort,
  });
};

export interface FlightDestination {
  id: string;
  name: string;
  code?: string;
  type?: string;
}

export interface FlightSearchParams {
  fromId: string;
  toId: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  stops: "none" | "0" | "1" | "2";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  sort: "BEST" | "CHEAPEST" | "FASTEST";
  currency: string;
}

export interface FlightSegment {
  departureTime: string;
  arrivalTime: string;
  departureAirport: {
    code: string;
    name: string;
    city: string;
  };
  arrivalAirport: {
    code: string;
    name: string;
    city: string;
  };
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  duration: string;
  aircraft?: string;
}

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
  baggage?: {
    cabin: string;
    checked: string;
  };
}

interface FlightStore {
  // Search state
  searchParams: FlightSearchParams;
  setSearchParams: (params: Partial<FlightSearchParams>) => void;

  // Destinations
  destinations: FlightDestination[];
  setDestinations: (destinations: FlightDestination[]) => void;

  // Search results
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;

  // Selected flight
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;

  // Loading states
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;

  isLoadingDestinations: boolean;
  setIsLoadingDestinations: (isLoading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Min price data
  minPrice: { amount: number; currency: string } | null;
  setMinPrice: (minPrice: { amount: number; currency: string } | null) => void;

  // Reset state
  reset: () => void;
}

const initialSearchParams: FlightSearchParams = {
  fromId: "",
  toId: "",
  departDate: "",
  returnDate: "",
  adults: 1,
  children: 0,
  stops: "0",
  cabinClass: "ECONOMY",
  sort: "BEST",
  currency: "USD",
};

export const useFlightStore = create<FlightStore>((set) => ({
  // Initial state
  searchParams: initialSearchParams,
  destinations: [],
  flights: [],
  selectedFlight: null,
  isSearching: false,
  isLoadingDestinations: false,
  error: null,
  minPrice: null,

  // Setter actions
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  setDestinations: (destinations) => set({ destinations }),

  setFlights: (flights) => set({ flights }),

  setSelectedFlight: (flight) => set({ selectedFlight: flight }),

  setIsSearching: (isSearching) => set({ isSearching }),

  setIsLoadingDestinations: (isLoading) =>
    set({ isLoadingDestinations: isLoading }),

  setError: (error) => set({ error }),

  setMinPrice: (minPrice) => set({ minPrice }),

  reset: () =>
    set({
      searchParams: initialSearchParams,
      destinations: [],
      flights: [],
      selectedFlight: null,
      isSearching: false,
      isLoadingDestinations: false,
      error: null,
      minPrice: null,
    }),
}));
