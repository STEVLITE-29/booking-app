import { create } from "zustand";
import { TTLCache } from "@/utils/apiUtils";
import type {
  Hotel,
  HotelDetails,
  Room,
  HotelFilter,
  SortOption,
} from "@/types/hotel-types";

// Cache entries for destinations and searches
export interface HotelDestinationCacheEntry {
  dest_id: string;
  label: string;
  dest_type: string;
  nr_hotels?: number;
  [key: string]: unknown;
}

export const hotelDestinationCache = new TTLCache<HotelDestinationCacheEntry[]>(
  10 * 60 * 1000,
);
export const hotelSearchCache = new TTLCache<Hotel[]>(15 * 60 * 1000);

// Hotel search and cache key builder
export interface HotelSearchParams {
  dest_id: string;
  search_type: "CITY" | "REGION" | "DISTRICT" | "HOTEL" | "LANDMARK";
  arrival_date: string;
  departure_date: string;
  adults: number;
  children_age: string;
  room_qty: number;
  page_number: number;
  currency_code: string;
  languagecode: string;
}

/** Cache key from search params that affect results */
export function buildHotelCacheKey(params: HotelSearchParams): string {
  return [
    params.dest_id,
    params.search_type,
    params.arrival_date,
    params.departure_date,
    params.adults,
    params.children_age,
    params.room_qty,
    params.currency_code,
  ].join("|");
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface HotelStore {
  searchParams: HotelSearchParams;
  setSearchParams: (params: Partial<HotelSearchParams>) => void;

  hotels: Hotel[];
  setHotels: (hotels: Hotel[]) => void;

  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;

  hotelDetails: HotelDetails | null;
  setHotelDetails: (details: HotelDetails | null) => void;

  rooms: Room[];
  setRooms: (rooms: Room[]) => void;

  filters: HotelFilter[];
  setFilters: (filters: HotelFilter[]) => void;

  sortOptions: SortOption[];
  setSortOptions: (options: SortOption[]) => void;

  activeFilters: Record<string, string[]>;
  setActiveFilters: (filters: Record<string, string[]>) => void;

  sortBy: string;
  setSortBy: (sortBy: string) => void;

  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;

  isLoadingDetails: boolean;
  setIsLoadingDetails: (isLoading: boolean) => void;

  isLoadingRooms: boolean;
  setIsLoadingRooms: (isLoading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  totalResults: number;
  setTotalResults: (total: number) => void;

  reset: () => void;
}

const initialSearchParams: HotelSearchParams = {
  dest_id: "",
  search_type: "CITY",
  arrival_date: "",
  departure_date: "",
  adults: 2,
  children_age: "0,17",
  room_qty: 1,
  page_number: 1,
  currency_code: "USD",
  languagecode: "en-us",
};

export const useHotelStore = create<HotelStore>((set) => ({
  searchParams: initialSearchParams,
  hotels: [],
  selectedHotel: null,
  hotelDetails: null,
  rooms: [],
  filters: [],
  sortOptions: [],
  activeFilters: {},
  sortBy: "popularity",
  isSearching: false,
  isLoadingDetails: false,
  isLoadingRooms: false,
  error: null,
  currentPage: 1,
  totalResults: 0,

  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  setHotels: (hotels) => set({ hotels }),
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
  setHotelDetails: (details) => set({ hotelDetails: details }),
  setRooms: (rooms) => set({ rooms }),
  setFilters: (filters) => set({ filters }),
  setSortOptions: (options) => set({ sortOptions: options }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  setSortBy: (sortBy) => set({ sortBy }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setIsLoadingDetails: (isLoading) => set({ isLoadingDetails: isLoading }),
  setIsLoadingRooms: (isLoading) => set({ isLoadingRooms: isLoading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalResults: (total) => set({ totalResults: total }),

  reset: () =>
    set({
      searchParams: initialSearchParams,
      hotels: [],
      selectedHotel: null,
      hotelDetails: null,
      rooms: [],
      filters: [],
      sortOptions: [],
      activeFilters: {},
      sortBy: "popularity",
      isSearching: false,
      isLoadingDetails: false,
      isLoadingRooms: false,
      error: null,
      currentPage: 1,
      totalResults: 0,
    }),
}));
