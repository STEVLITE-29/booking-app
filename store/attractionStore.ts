import { create } from "zustand";
import { TTLCache } from "@/utils/apiUtils";
import type {
  Attraction,
  AttractionDetails,
  AttractionLocation,
  CalendarItem,
  TimeSlot,
  Review,
} from "@/services/attractionService";

// Module-level caches with 30-minute TTL
export const attractionListCache = new TTLCache<Attraction[]>(30 * 60 * 1000);
export const attractionDetailsCache = new TTLCache<AttractionDetails>(
  30 * 60 * 1000,
);
export const attractionReviewsCache = new TTLCache<Review[]>(15 * 60 * 1000);
export const locationSearchCache = new TTLCache<AttractionLocation[]>(
  10 * 60 * 1000,
);

interface AttractionState {
  // Search state
  searchQuery: string;
  searchLocations: AttractionLocation[];
  selectedLocation: AttractionLocation | null;

  // Attractions list
  attractions: Attraction[];
  filteredAttractions: Attraction[];
  currentPage: number;
  totalPages: number;
  sortBy: "trending" | "attr_book_score" | "lowest_price";

  // Selected attraction
  selectedAttraction: Attraction | null;
  attractionDetails: AttractionDetails | null;

  // Availability
  availabilityCalendar: CalendarItem[];
  selectedDate: string | null;
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;

  // Reviews
  reviews: Review[];
  reviewsPage: number;
  totalReviews: number;

  // Loading states
  isSearchingLocations: boolean;
  isLoadingAttractions: boolean;
  isLoadingDetails: boolean;
  isLoadingAvailability: boolean;
  isLoadingReviews: boolean;

  // Error states
  error: string | null;

  // Currency
  currencyCode: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setSearchLocations: (locations: AttractionLocation[]) => void;
  setSelectedLocation: (location: AttractionLocation | null) => void;

  setAttractions: (attractions: Attraction[]) => void;
  setFilteredAttractions: (attractions: Attraction[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setSortBy: (sortBy: "trending" | "attr_book_score" | "lowest_price") => void;

  setSelectedAttraction: (attraction: Attraction | null) => void;
  setAttractionDetails: (details: AttractionDetails | null) => void;

  setAvailabilityCalendar: (calendar: CalendarItem[]) => void;
  setSelectedDate: (date: string | null) => void;
  setTimeSlots: (slots: TimeSlot[]) => void;
  setSelectedTimeSlot: (slot: TimeSlot | null) => void;

  setReviews: (reviews: Review[]) => void;
  setReviewsPage: (page: number) => void;
  setTotalReviews: (total: number) => void;

  setIsSearchingLocations: (loading: boolean) => void;
  setIsLoadingAttractions: (loading: boolean) => void;
  setIsLoadingDetails: (loading: boolean) => void;
  setIsLoadingAvailability: (loading: boolean) => void;
  setIsLoadingReviews: (loading: boolean) => void;

  setError: (error: string | null) => void;
  setCurrencyCode: (code: string) => void;

  // Filter attractions
  filterByPrice: (minPrice: number, maxPrice: number) => void;
  filterByRating: (minRating: number) => void;
  filterByFreeCancellation: () => void;
  clearFilters: () => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  searchQuery: "",
  searchLocations: [],
  selectedLocation: null,

  attractions: [],
  filteredAttractions: [],
  currentPage: 1,
  totalPages: 1,
  sortBy: "trending" as const,

  selectedAttraction: null,
  attractionDetails: null,

  availabilityCalendar: [],
  selectedDate: null,
  timeSlots: [],
  selectedTimeSlot: null,

  reviews: [],
  reviewsPage: 1,
  totalReviews: 0,

  isSearchingLocations: false,
  isLoadingAttractions: false,
  isLoadingDetails: false,
  isLoadingAvailability: false,
  isLoadingReviews: false,

  error: null,
  currencyCode: "USD",
};

export const useAttractionStore = create<AttractionState>((set) => ({
  ...initialState,

  // Simple setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchLocations: (locations) => set({ searchLocations: locations }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setAttractions: (attractions) =>
    set({ attractions, filteredAttractions: attractions }),
  setFilteredAttractions: (attractions) =>
    set({ filteredAttractions: attractions }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setSortBy: (sortBy) => set({ sortBy }),

  setSelectedAttraction: (attraction) =>
    set({ selectedAttraction: attraction }),
  setAttractionDetails: (details) => set({ attractionDetails: details }),

  setAvailabilityCalendar: (calendar) =>
    set({ availabilityCalendar: calendar }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTimeSlots: (slots) => set({ timeSlots: slots }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

  setReviews: (reviews) => set({ reviews }),
  setReviewsPage: (page) => set({ reviewsPage: page }),
  setTotalReviews: (total) => set({ totalReviews: total }),

  setIsSearchingLocations: (loading) => set({ isSearchingLocations: loading }),
  setIsLoadingAttractions: (loading) => set({ isLoadingAttractions: loading }),
  setIsLoadingDetails: (loading) => set({ isLoadingDetails: loading }),
  setIsLoadingAvailability: (loading) =>
    set({ isLoadingAvailability: loading }),
  setIsLoadingReviews: (loading) => set({ isLoadingReviews: loading }),

  setError: (error) => set({ error }),
  setCurrencyCode: (code) => set({ currencyCode: code }),

  // Filter attractions
  filterByPrice: (minPrice, maxPrice) =>
    set((state) => ({
      filteredAttractions: state.attractions.filter(
        (a) =>
          a.representativePrice.chargeAmount >= minPrice &&
          a.representativePrice.chargeAmount <= maxPrice,
      ),
    })),

  filterByRating: (minRating) =>
    set((state) => ({
      filteredAttractions: state.attractions.filter(
        (a) =>
          a.reviewsStats &&
          a.reviewsStats.combinedNumericStats.average >= minRating,
      ),
    })),

  filterByFreeCancellation: () =>
    set((state) => ({
      filteredAttractions: state.attractions.filter(
        (a) => !!a.cancellationPolicy?.hasFreeCancellation,
      ),
    })),

  clearFilters: () =>
    set((state) => ({
      filteredAttractions: state.attractions,
    })),

  reset: () => set(initialState),
}));
