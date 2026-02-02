export interface HotelDestination {
  dest_id: string;
  dest_type: string;
  label: string;
  name: string;
  city_name?: string;
  country?: string;
  region?: string;
  nr_hotels?: number;
  latitude?: number;
  longitude?: number;
  image_url?: string;
}

export interface HotelDestinationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelDestination[];
}

// Hotel Facility Types
export interface HotelFacility {
  name: string;
  facilityType?: string;
}

// Photo Types
export interface HotelPhoto {
  url_original: string;
  url_max300: string;
  url_square60: string;
}

// Review Score Types
export interface HotelReviewScore {
  score: number;
  totalReviews: number;
  reviewScoreWord: string;
}

// Hotel Types
export interface Hotel {
  hotel_id: number;
  accessibilityLabel: string;
  property: {
    name: string;
    reviewScore?: number;
    reviewScoreWord?: string;
    reviewCount?: number;
    latitude: number;
    longitude: number;
    checkinDate?: string;
    checkoutDate?: string;
    priceBreakdown?: {
      grossPrice: {
        value: number;
        currency: string;
      };
      taxExceptions?: unknown[];
    };
    photoUrls?: string[];
    mainPhotoUrl?: string;
  };
  position?: number;
  rankingPosition?: number;
  priceBreakdown: {
    benefitBadges?: unknown[];
    grossPrice: {
      value: number;
      currency: string;
    };
    excludedAmount?: {
      value: number;
      currency: string;
    };
    strikethroughPrice?: {
      value: number;
      currency: string;
    };
    hasIncludedTaxesAndCharges?: boolean;
  };
}

export interface HotelSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    hotels: Hotel[];
    count?: number;
    total?: number;
  };
}

// Hotel Details Types
export interface HotelDetails {
  hotel_id: number;
  hotel_name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  is_free_cancellable?: boolean;
  countrycode: string;
  latitude: number;
  longitude: number;
  checkin: {
    from: string;
    until: string;
  };
  checkout: {
    from: string;
    until: string;
  };
  hotel_description: string;
  hotel_facilities: HotelFacility[];
  property_highlight_strip?: unknown[];
  review_score?: number;
  review_score_word?: string;
  review_nr?: number;
  main_photo_url: string;
  photos?: HotelPhoto[];
}

export interface HotelDetailsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelDetails;
}

// Room Types
export interface RoomFacility {
  name: string;
  facilitytype_name?: string;
}

export interface Room {
  room_id: number;
  room_name: string;
  room_surface_in_feet2?: number;
  facilities: RoomFacility[];
  photos?: HotelPhoto[];
  description?: string;
  max_occupancy?: number;
  bed_configurations?: Array<{
    bed_types: Array<{
      name: string;
      count: number;
    }>;
  }>;
  price?: {
    value: number;
    currency: string;
  };
}

export interface RoomListResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    rooms: Room[];
  };
}

// Filter Types
export interface FilterOption {
  name: string;
  value: string;
  count?: number;
}

export interface HotelFilter {
  id: string;
  name: string;
  filterType: string;
  options: FilterOption[];
}

export interface FilterResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    filters: HotelFilter[];
  };
}

// Sort Options
export interface SortOption {
  id: string;
  name: string;
}

export interface SortResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    sortOptions: SortOption[];
  };
}

// Search Parameters
export interface HotelSearchParams {
  dest_id: string;
  search_type: "CITY" | "REGION" | "DISTRICT" | "HOTEL" | "LANDMARK";
  arrival_date: string;
  departure_date: string;
  adults: number;
  children_age?: string;
  room_qty: number;
  page_number?: number;
  units?: "metric" | "imperial";
  temperature_unit?: "c" | "f";
  languagecode?: string;
  currency_code?: string;
  location?: string;
}
