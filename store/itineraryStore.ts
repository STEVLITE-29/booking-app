import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TripItinerary,
  ItineraryFlight,
  ItineraryHotel,
  ItineraryAttraction,
} from "@/types/itinerary-types";
import type { Flight } from "@/types/flight-api-types";
import type { Hotel } from "@/types/hotel-types";
import type { Attraction } from "@/types/attraction-types";

interface ItineraryState {
  currentTrip: TripItinerary | null;
  isHydrated: boolean;

  // Actions
  createTrip: (
    name: string,
    destination: string,
    startDate: string,
    endDate: string,
    bannerImage?: string | null,
    latitude?: number,
    longitude?: number,
    soloTrip?: boolean,
  ) => void;
  updateTrip: (updates: Partial<TripItinerary>) => void;
  deleteTrip: () => void; // Delete the current trip

  // Add items to itinerary
  addFlight: (flight: Flight, departureDate: string) => void;
  addHotel: (hotel: Hotel, checkinDate: string, checkoutDate: string) => void;
  addActivity: (
    attraction: Attraction,
    selectedDate?: string,
    selectedTime?: string,
    ticketQuantity?: number,
    bookedDates?: string[],
  ) => void;

  // Remove items from itinerary
  removeFlight: (flightId: string) => void;
  removeHotel: (hotelId: number) => void;
  removeActivity: (activityId: string) => void;

  // Clear itinerary
  clearItinerary: () => void;
  setHydrated: () => void;
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set) => ({
      currentTrip: null,
      isHydrated: false,

      createTrip: (
        name,
        destination,
        startDate,
        endDate,
        bannerImage,
        latitude,
        longitude,
        soloTrip,
      ) =>
        set({
          currentTrip: {
            id: Date.now().toString(),
            name,
            destination,
            latitude,
            longitude,
            startDate,
            endDate,
            bannerImage: bannerImage || null,
            soloTrip: soloTrip || false,
            flights: [],
            hotels: [],
            activities: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        }),

      updateTrip: (updates) =>
        set((state) =>
          state.currentTrip
            ? {
                currentTrip: {
                  ...state.currentTrip,
                  ...updates,
                  updatedAt: Date.now(),
                },
              }
            : state,
        ),

      deleteTrip: () => set({ currentTrip: null }),

      addFlight: (flight, departureDate) =>
        set((state) => {
          if (!state.currentTrip) return state;

          const itineraryFlight: ItineraryFlight = {
            ...flight,
            addedAt: Date.now(),
            departureDate,
          };

          return {
            currentTrip: {
              ...state.currentTrip,
              flights: [...state.currentTrip.flights, itineraryFlight],
              updatedAt: Date.now(),
            },
          };
        }),

      addHotel: (hotel, checkinDate, checkoutDate) =>
        set((state) => {
          if (!state.currentTrip) return state;

          const nights = Math.ceil(
            (new Date(checkoutDate).getTime() -
              new Date(checkinDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const itineraryHotel: ItineraryHotel = {
            ...hotel,
            addedAt: Date.now(),
            checkinDate,
            checkoutDate,
            nights,
          };

          return {
            currentTrip: {
              ...state.currentTrip,
              hotels: [...state.currentTrip.hotels, itineraryHotel],
              updatedAt: Date.now(),
            },
          };
        }),

      addActivity: (
        attraction,
        selectedDate,
        selectedTime,
        ticketQuantity,
        bookedDates,
      ) =>
        set((state) => {
          if (!state.currentTrip) return state;

          const itineraryActivity: ItineraryAttraction = {
            ...attraction,
            addedAt: Date.now(),
            selectedDate,
            selectedTime,
            ticketQuantity,
            bookedDates: bookedDates || [],
          };

          return {
            currentTrip: {
              ...state.currentTrip,
              activities: [...state.currentTrip.activities, itineraryActivity],
              updatedAt: Date.now(),
            },
          };
        }),

      removeFlight: (flightId) =>
        set((state) => {
          if (!state.currentTrip) return state;

          return {
            currentTrip: {
              ...state.currentTrip,
              flights: state.currentTrip.flights.filter(
                (f) => f.id !== flightId,
              ),
              updatedAt: Date.now(),
            },
          };
        }),

      removeHotel: (hotelId) =>
        set((state) => {
          if (!state.currentTrip) return state;

          return {
            currentTrip: {
              ...state.currentTrip,
              hotels: state.currentTrip.hotels.filter(
                (h) => h.hotel_id !== hotelId,
              ),
              updatedAt: Date.now(),
            },
          };
        }),

      removeActivity: (activityId) =>
        set((state) => {
          if (!state.currentTrip) return state;

          return {
            currentTrip: {
              ...state.currentTrip,
              activities: state.currentTrip.activities.filter(
                (a) => a.id !== activityId,
              ),
              updatedAt: Date.now(),
            },
          };
        }),

      clearItinerary: () => set({ currentTrip: null }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "travel-itinerary",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
      partialize: (state) => ({
        currentTrip: state.currentTrip
          ? {
              ...state.currentTrip,
              flights: state.currentTrip.flights.map((f) => ({
                ...f,
                photos: [],
                photoUrls: [],
              })),
              hotels: state.currentTrip.hotels.map((h) => ({
                ...h,
                property: h.property
                  ? {
                      ...h.property,
                      photoUrls: [],
                      mainPhotoUrl: "",
                    }
                  : h.property,
              })),
              activities: state.currentTrip.activities.map((a) => ({
                ...a,
                photos: [],
                photoUrls: [],
              })),
            }
          : null,
      }),
    },
  ),
);
