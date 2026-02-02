import type { Flight } from "./flight-api-types";
import type { Hotel } from "./hotel-types";
import type { Attraction } from "./attraction-types";

// Extended itinerary item types with tracking metadata
export interface ItineraryFlight extends Flight {
  addedAt: number;
  departureDate: string;
  returnDate?: string;
  notes?: string;
  bookingReference?: string;
  confirmationNumber?: string;
}

export interface ItineraryHotel extends Hotel {
  addedAt: number;
  checkinDate: string;
  checkoutDate: string;
  nights: number;
  roomType?: string;
  numberOfRooms?: number;
  numberOfGuests?: number;
  notes?: string;
  bookingReference?: string;
  confirmationNumber?: string;
}

export interface ItineraryAttraction extends Attraction {
  addedAt: number;
  selectedDate?: string;
  selectedTime?: string;
  ticketQuantity?: number;
  notes?: string;
  bookingReference?: string;
  confirmationNumber?: string;
  bookedDates?: string[]; // Array of dates the attraction is booked for
}

// Main trip itinerary interface
export interface TripItinerary {
  id: string;
  name: string;
  destination: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate: string;
  bannerImage?: string | null;
  soloTrip?: boolean;
  tripType?:
    | "vacation"
    | "business"
    | "adventure"
    | "family"
    | "romantic"
    | "solo"
    | "other";
  description?: string;
  budget?: {
    total: number;
    currency: string;
    spent: number;
  };
  travelers?: {
    adults: number;
    children: number;
    infants: number;
  };
  flights: ItineraryFlight[];
  hotels: ItineraryHotel[];
  activities: ItineraryAttraction[];
  notes?: string[];
  tags?: string[];
  isPublic?: boolean;
  sharedWith?: string[];
  createdAt: number;
  updatedAt: number;
}

// Item type discriminator
export type ItineraryItemType = "flight" | "hotel" | "activity";

// Union type for all itinerary items
export type ItineraryItem =
  | ItineraryFlight
  | ItineraryHotel
  | ItineraryAttraction;

// Helper type for item with type discriminator
export interface TypedItineraryItem {
  type: ItineraryItemType;
  item: ItineraryItem;
}

// Trip statistics interface
export interface TripStatistics {
  totalFlights: number;
  totalHotels: number;
  totalActivities: number;
  totalCost: {
    flights: number;
    hotels: number;
    activities: number;
    total: number;
    currency: string;
  };
  duration: {
    days: number;
    nights: number;
  };
  destinations: string[];
}

// Trip creation parameters
export interface CreateTripParams {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  bannerImage?: string | null;
  tripType?: TripItinerary["tripType"];
  description?: string;
  travelers?: TripItinerary["travelers"];
}

// Trip update parameters
export interface UpdateTripParams {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  bannerImage?: string | null;
  tripType?: TripItinerary["tripType"];
  description?: string;
  budget?: TripItinerary["budget"];
  travelers?: TripItinerary["travelers"];
  notes?: string[];
  tags?: string[];
  isPublic?: boolean;
}

// Booking status types
export type BookingStatus =
  | "planned"
  | "booked"
  | "confirmed"
  | "cancelled"
  | "completed";

// Enhanced itinerary item with booking status
export interface BookableItineraryItem {
  status: BookingStatus;
  bookedAt?: number;
  cancelledAt?: number;
  cancellationReason?: string;
}

// Type guards
export function isItineraryFlight(
  item: ItineraryItem,
): item is ItineraryFlight {
  return "segments" in item && "token" in item;
}

export function isItineraryHotel(item: ItineraryItem): item is ItineraryHotel {
  return "hotel_id" in item && "property" in item;
}

export function isItineraryAttraction(
  item: ItineraryItem,
): item is ItineraryAttraction {
  return (
    "slug" in item && "representativePrice" in item && "ufiDetails" in item
  );
}

// Helper functions
export function calculateTripDuration(
  startDate: string,
  endDate: string,
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateTripNights(
  startDate: string,
  endDate: string,
): number {
  return Math.max(0, calculateTripDuration(startDate, endDate) - 1);
}

export function getTripStatistics(trip: TripItinerary): TripStatistics {
  const flightsCost = trip.flights.reduce(
    (sum, flight) => sum + flight.price.amount,
    0,
  );
  const hotelsCost = trip.hotels.reduce(
    (sum, hotel) => sum + (hotel.priceBreakdown?.grossPrice?.value || 0),
    0,
  );
  const activitiesCost = trip.activities.reduce(
    (sum, activity) => sum + activity.representativePrice.chargeAmount,
    0,
  );

  return {
    totalFlights: trip.flights.length,
    totalHotels: trip.hotels.length,
    totalActivities: trip.activities.length,
    totalCost: {
      flights: flightsCost,
      hotels: hotelsCost,
      activities: activitiesCost,
      total: flightsCost + hotelsCost + activitiesCost,
      currency:
        trip.flights[0]?.price.currency ||
        trip.hotels[0]?.priceBreakdown?.grossPrice?.currency ||
        "USD",
    },
    duration: {
      days: calculateTripDuration(trip.startDate, trip.endDate),
      nights: calculateTripNights(trip.startDate, trip.endDate),
    },
    destinations: [
      trip.destination,
      ...new Set(trip.activities.map((a) => a.ufiDetails.bCityName)),
    ],
  };
}

// Sort helpers
export type SortOrder = "asc" | "desc";

export interface SortOptions {
  by: "date" | "price" | "name" | "addedAt";
  order: SortOrder;
}

export function sortFlights(
  flights: ItineraryFlight[],
  options: SortOptions,
): ItineraryFlight[] {
  const sorted = [...flights];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (options.by) {
      case "date":
        comparison =
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime();
        break;
      case "price":
        comparison = a.price.amount - b.price.amount;
        break;
      case "name":
        comparison = a.segments[0].airlineName.localeCompare(
          b.segments[0].airlineName,
        );
        break;
      case "addedAt":
        comparison = a.addedAt - b.addedAt;
        break;
    }

    return options.order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

export function sortHotels(
  hotels: ItineraryHotel[],
  options: SortOptions,
): ItineraryHotel[] {
  const sorted = [...hotels];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (options.by) {
      case "date":
        comparison =
          new Date(a.checkinDate).getTime() - new Date(b.checkinDate).getTime();
        break;
      case "price":
        comparison =
          (a.priceBreakdown?.grossPrice?.value || 0) -
          (b.priceBreakdown?.grossPrice?.value || 0);
        break;
      case "name":
        comparison = a.property.name.localeCompare(b.property.name);
        break;
      case "addedAt":
        comparison = a.addedAt - b.addedAt;
        break;
    }

    return options.order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

export function sortActivities(
  activities: ItineraryAttraction[],
  options: SortOptions,
): ItineraryAttraction[] {
  const sorted = [...activities];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (options.by) {
      case "date":
        if (a.selectedDate && b.selectedDate) {
          comparison =
            new Date(a.selectedDate).getTime() -
            new Date(b.selectedDate).getTime();
        }
        break;
      case "price":
        comparison =
          a.representativePrice.chargeAmount -
          b.representativePrice.chargeAmount;
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "addedAt":
        comparison = a.addedAt - b.addedAt;
        break;
    }

    return options.order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

// Export default functions
const itineraryHelpers = {
  isItineraryFlight,
  isItineraryHotel,
  isItineraryAttraction,
  calculateTripDuration,
  calculateTripNights,
  getTripStatistics,
  sortFlights,
  sortHotels,
  sortActivities,
};

export default itineraryHelpers;
