export interface AttractionLocation {
  id: string;
  __typename: string;
  ufi?: number;
  country?: string;
  cityName?: string;
  productCount?: number;
  cc1?: string;
  title?: string;
  productId?: string;
  productSlug?: string;
  taxonomySlug?: string;
  cityUfi?: number;
}

export interface SearchLocationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    products: AttractionLocation[];
    destinations: AttractionLocation[];
  };
}

// Attraction Types
export interface Attraction {
  __typename: string;
  cancellationPolicy: {
    __typename: string;
    hasFreeCancellation: boolean;
  };
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  representativePrice: {
    __typename: string;
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  };
  primaryPhoto: {
    __typename: string;
    small: string;
  };
  reviewsStats: {
    __typename: string;
    allReviewsCount: number;
    percentage: string;
    combinedNumericStats: {
      __typename: string;
      average: number;
      total: number;
    };
  } | null;
  ufiDetails: {
    __typename: string;
    bCityName: string;
    ufi: number;
    url: {
      __typename: string;
      country: string;
    };
  };
  offers: Array<{
    __typename: string;
    items: Array<{
      __typename: string;
      id: string;
    }>;
  }>;
  supportedFeatures: {
    __typename: string;
    nativeApp: boolean;
  };
  flags: Array<{
    __typename: string;
    flag: string;
    value: boolean;
    rank: number;
  }> | null;
}

export interface SearchAttractionsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    __typename: string;
    products: Attraction[];
    filterStats: {
      __typename: string;
      unfilteredProductCount: number;
      filteredProductCount: number;
    };
    sorters: Array<{
      __typename: string;
      name: string;
      value: string;
    }>;
    defaultSorter: {
      __typename: string;
      name: string;
      value: string;
    };
    filterOptions: {
      typeFilters?: unknown[];
      labelFilters?: unknown[];
      ufiFilters?: unknown[];
      priceFilters?: unknown[];
    };
  };
}

// Attraction Details Types
export interface Address {
  __typename: string;
  address?: string;
  city?: string;
  country?: string;
  googlePlaceId?: string | null;
  id?: string;
  instructions?: string | null;
  latitude?: string;
  longitude?: string;
  locationType?: string;
  publicTransport?: string | null;
  zip?: string | null;
}

export interface Photo {
  __typename: string;
  small: string;
  medium: string;
  isPrimary: boolean;
}

export interface Label {
  __typename: string;
  text: string;
  type: string;
}

export interface AttractionDetails {
  __typename: string;
  accessibility: unknown[];
  additionalBookingInfo: string | null;
  additionalInfo: string;
  addresses: {
    __typename: string;
    arrival: Address[];
    attraction: Address | null;
    departure: Address[];
    entrance: Address | null;
    guestPickup: Address | null;
    meeting: Address | null;
    pickup: Address | null;
  };
  applicableTerms: Array<{
    __typename: string;
    policyProvider: string;
    privacyPolicyUrl: string;
    termsUrl: string;
  }>;
  audioSupportedLanguages: string[] | null;
  cancellationPolicy: {
    __typename: string;
    hasFreeCancellation: boolean;
  };
  covid: unknown[];
  description: string;
  dietOptions: unknown[];
  flags: unknown[];
  guideSupportedLanguages: string[];
  healthSafety: string[];
  id: string;
  isBookable: boolean;
  labels: Label[];
  name: string;
  notIncluded: string[];
  offers: Array<{
    __typename: string;
    availabilityType: string;
    id: string;
  }>;
  onSiteRequirements: {
    __typename: string;
    voucherPrintingRequired: boolean | null;
  } | null;
  operatedBy: string;
  photos: Photo[];
  primaryPhoto: {
    __typename: string;
    small: string;
  };
  representativePrice: {
    __typename: string;
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  };
  restrictions: unknown[];
  reviews: {
    __typename: string;
    total: number;
    reviews: Review[];
  };
  reviewsStats: {
    __typename: string;
    allReviewsCount: number;
    percentage: string;
    combinedNumericStats: {
      __typename: string;
      average: number;
      total: number;
    };
  };
  shortDescription: string;
  slug: string;
  supportedFeatures: {
    __typename: string;
    nativeApp: boolean;
    nativeAppBookProcess?: boolean;
    liveAvailabilityCheckSupported?: boolean;
  };
  uniqueSellingPoints: string[] | null;
  ufiDetails: {
    __typename: string;
    ufi: number;
    bCityName: string;
    url: {
      __typename: string;
      country: string;
    };
  };
  whatsIncluded: string[];
}

export interface AttractionDetailsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: AttractionDetails;
}

// Calendar and Availability Types
export interface CalendarItem {
  __typename: string;
  available: boolean;
  date: string;
}

export interface AvailabilityCalendarResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: CalendarItem[];
}

export interface TimeSlotOfferItem {
  __typename: string;
  cancellationPolicy: {
    __typename: string;
    comparedTo: string;
    hasFreeCancellation: boolean;
    isStillRefundable: boolean;
    percentage: number;
    period: string;
  };
  constraint: {
    __typename: string;
    label: string;
    maxGroupSize: number | null;
    minGroupSize: number | null;
  };
  id: string;
  offerItemId: string;
  type: string;
  tieredPricing: boolean;
  price: {
    __typename: string;
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  };
  convertedPrice: {
    __typename: string;
    chargeAmount: number;
    currency: string;
    publicAmount: number;
  } | null;
  languageOption: {
    __typename: string;
    language: string;
    type: string;
  } | null;
  travelerCountRequired: number | null;
  ticketsAvailable: number;
  maxPerReservation: number;
  minPerReservation: number;
  duration: string | null;
  label: string;
}

export interface TimeSlotOffer {
  __typename: string;
  languageOptions: Array<{
    __typename: string;
    label: string;
    language: string;
    type: string;
  }>;
  id: string;
  items: TimeSlotOfferItem[];
  label: string;
  reservationRestrictions: {
    __typename: string;
    adultRequiredForReservation: boolean;
    maxOfferItemsPerReservation: number;
    minOfferItemsPerReservation: number;
  };
}

export interface TimeSlot {
  __typename: string;
  fullDay: boolean;
  start: string;
  timeSlotId: string;
  timeSlotOffers: TimeSlotOffer[];
}

export interface AvailabilityResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: TimeSlot[];
}

// Review Types
export interface Review {
  __typename: string;
  id: string;
  rating: boolean | null;
  content: string | null;
  epochMs: number;
  language: string | null;
  numericRating: number;
  providerName: string | null;
  user: {
    __typename: string;
    name: string;
    cc1: string;
    avatar: string | null;
  } | null;
}

export interface ReviewsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    __typename: string;
    total: number;
    reviews: Review[];
  };
}
