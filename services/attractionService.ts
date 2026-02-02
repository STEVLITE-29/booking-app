import {
  searchMockAttractionLocations,
  searchMockAttractions,
  getMockAvailabilityCalendar,
  getMockTimeSlots,
  mockAttractionLocations,
} from "@/data/attractions";

const BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1/attraction";
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const API_HOST = "booking-com15.p.rapidapi.com";

// Toggle between mock and real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Common headers for all requests
const getHeaders = () => ({
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
});

// Helper to ensure attraction price exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ensureAttractionPrice = (a: any) => {
  if (!a.representativePrice)
    a.representativePrice = {
      chargeAmount: 1,
      currency: "USD",
      publicAmount: 1,
    };
  if (
    !a.representativePrice.chargeAmount ||
    a.representativePrice.chargeAmount <= 0
  ) {
    a.representativePrice.chargeAmount =
      a.representativePrice.publicAmount || 1;
    if (
      !a.representativePrice.chargeAmount ||
      a.representativePrice.chargeAmount <= 0
    ) {
      a.representativePrice.chargeAmount = 1;
    }
  }
  return a;
};

// Export mock locations for use in components
export { mockAttractionLocations };

// Types based on the API responses
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

export interface FilterOptions {
  typeFilters?: unknown[];
  labelFilters?: unknown[];
  ufiFilters?: unknown[];
  priceFilters?: unknown[];
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
    filterOptions: FilterOptions;
  };
}

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

export interface CancellationPolicy {
  __typename: string;
  comparedTo: string;
  hasFreeCancellation: boolean;
  isStillRefundable: boolean;
  percentage: number;
  period: string;
}

export interface Constraint {
  __typename: string;
  label: string;
  maxGroupSize: number | null;
  minGroupSize: number | null;
}

export interface Price {
  __typename: string;
  chargeAmount: number;
  currency: string;
  publicAmount: number;
}

export interface LanguageOption {
  __typename: string;
  language: string;
  type: string;
}

export interface TimeSlotOfferItem {
  __typename: string;
  cancellationPolicy: CancellationPolicy;
  constraint: Constraint;
  id: string;
  offerItemId: string;
  type: string;
  tieredPricing: boolean;
  price: Price;
  convertedPrice: Price | null;
  languageOption: LanguageOption | null;
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

export interface TermsConditions {
  __typename: string;
  policyProvider: string;
  privacyPolicyUrl: string;
  termsUrl: string;
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

export interface Offer {
  __typename: string;
  availabilityType: string;
  id: string;
}

export interface AttractionReview {
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
  applicableTerms: TermsConditions[];
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
  offers: Offer[];
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
    reviews: AttractionReview[];
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

// Mock data generators
const generateMockAttractionDetails = (slug: string): AttractionDetails => {
  return {
    __typename: "AttractionDetails",
    accessibility: [],
    additionalBookingInfo: null,
    additionalInfo:
      "Please arrive 15 minutes before the scheduled start time. Comfortable walking shoes recommended. Don't forget to bring your camera!",
    addresses: {
      __typename: "Addresses",
      arrival: [],
      attraction: {
        __typename: "Address",
        address: "123 Main Street",
        city: "New York",
        country: "United States",
        googlePlaceId: null,
        id: "addr_1",
        instructions: null,
        latitude: "40.7580",
        longitude: "-73.9855",
        locationType: "attraction",
        publicTransport: "Nearest subway: Times Square - 42nd St",
        zip: "10036",
      },
      departure: [],
      entrance: null,
      guestPickup: null,
      meeting: null,
      pickup: null,
    },
    applicableTerms: [
      {
        __typename: "TermsConditions",
        policyProvider: "Booking.com",
        privacyPolicyUrl: "https://www.booking.com/privacy.html",
        termsUrl: "https://www.booking.com/terms.html",
      },
    ],
    audioSupportedLanguages: ["English", "Spanish", "French", "German"],
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    covid: [],
    description:
      "Experience an unforgettable adventure at this amazing attraction. Discover stunning views, learn fascinating history, and create memories that will last a lifetime. Perfect for families, couples, and solo travelers alike. Our expert guides will take you through the most incredible sights while sharing interesting stories and facts. This tour combines culture, history, and entertainment in one amazing package.",
    dietOptions: [],
    flags: [],
    guideSupportedLanguages: [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
    ],
    healthSafety: [
      "Face masks required for guides in enclosed spaces",
      "Hand sanitizer available throughout the tour",
      "Social distancing enforced where possible",
      "Temperature checks for all participants",
      "Regularly sanitized high-traffic areas",
    ],
    id: slug,
    isBookable: true,
    labels: [
      { __typename: "Label", text: "Best Seller", type: "badge" },
      { __typename: "Label", text: "Free Cancellation", type: "feature" },
      { __typename: "Label", text: "Mobile Ticket", type: "feature" },
    ],
    name: "Amazing City Experience",
    notIncluded: [
      "Hotel pickup and drop-off",
      "Food and drinks (unless specified)",
      "Gratuities (optional)",
      "Personal expenses and souvenirs",
    ],
    offers: [
      {
        __typename: "Offer",
        availabilityType: "realtime",
        id: "offer_1",
      },
    ],
    onSiteRequirements: {
      __typename: "OnSiteRequirements",
      voucherPrintingRequired: false,
    },
    operatedBy: "Amazing Tours & Experiences Inc.",
    photos: [
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1546412414-e1885259563a?w=400",
        medium:
          "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800",
        isPrimary: true,
      },
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
        medium:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        isPrimary: false,
      },
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1508050919630-b135583b29ab?w=400",
        medium:
          "https://images.unsplash.com/photo-1508050919630-b135583b29ab?w=800",
        isPrimary: false,
      },
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400",
        medium:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
        isPrimary: false,
      },
    ],
    primaryPhoto: {
      __typename: "Photo",
      small: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=400",
    },
    representativePrice: {
      __typename: "Price",
      chargeAmount: 85,
      currency: "USD",
      publicAmount: 85,
    },
    restrictions: [],
    reviews: {
      __typename: "Reviews",
      total: 150,
      reviews: [
        {
          __typename: "Review",
          id: "review_1",
          rating: null,
          content:
            "Absolutely amazing experience! Our guide was knowledgeable and friendly. The views were breathtaking and we learned so much. Highly recommend!",
          epochMs: Date.now() - 86400000,
          language: "en",
          numericRating: 5,
          providerName: "Booking.com",
          user: {
            __typename: "User",
            name: "John Smith",
            cc1: "US",
            avatar: null,
          },
        },
        {
          __typename: "Review",
          id: "review_2",
          rating: null,
          content:
            "Great tour with beautiful sights. Only downside was it felt a bit rushed at times, but overall a wonderful experience.",
          epochMs: Date.now() - 172800000,
          language: "en",
          numericRating: 4,
          providerName: "Booking.com",
          user: {
            __typename: "User",
            name: "Sarah Johnson",
            cc1: "GB",
            avatar: null,
          },
        },
        {
          __typename: "Review",
          id: "review_3",
          rating: null,
          content:
            "Perfect activity for families! My kids loved it and learned a lot. The guide was patient and engaging with children.",
          epochMs: Date.now() - 259200000,
          language: "en",
          numericRating: 5,
          providerName: "Booking.com",
          user: {
            __typename: "User",
            name: "Maria Garcia",
            cc1: "ES",
            avatar: null,
          },
        },
      ],
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 150,
      percentage: "95%",
      combinedNumericStats: {
        __typename: "CombinedNumericStats",
        average: 4.7,
        total: 150,
      },
    },
    shortDescription: "An unforgettable experience you won't want to miss!",
    slug: slug,
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
      nativeAppBookProcess: true,
      liveAvailabilityCheckSupported: true,
    },
    uniqueSellingPoints: [
      "Skip-the-line access to attractions",
      "Expert local guide with insider knowledge",
      "Small group size (max 15 people)",
      "Free cancellation up to 24 hours before",
      "Mobile ticket - no printing required",
    ],
    ufiDetails: {
      __typename: "UfiDetails",
      ufi: 20088325,
      bCityName: "New York",
      url: {
        __typename: "Url",
        country: "us",
      },
    },
    whatsIncluded: [
      "Professional expert guide",
      "All entry and admission fees",
      "Guaranteed skip-the-line entrance",
      "All taxes, fees and handling charges",
      "Audio headsets where needed",
    ],
  };
};

const generateMockReviews = (): Review[] => {
  return [
    {
      __typename: "Review",
      id: "review_1",
      rating: null,
      content:
        "Absolutely amazing experience! Our guide was knowledgeable and friendly. The views were breathtaking and we learned so much. Highly recommend to anyone visiting!",
      epochMs: Date.now() - 86400000,
      language: "en",
      numericRating: 5,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "John Smith",
        cc1: "US",
        avatar: null,
      },
    },
    {
      __typename: "Review",
      id: "review_2",
      rating: null,
      content:
        "Great tour with beautiful sights. Only downside was it felt a bit rushed at times, but overall a wonderful experience. Would do it again!",
      epochMs: Date.now() - 172800000,
      language: "en",
      numericRating: 4,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "Sarah Johnson",
        cc1: "GB",
        avatar: null,
      },
    },
    {
      __typename: "Review",
      id: "review_3",
      rating: null,
      content:
        "Perfect activity for families! My kids loved it and learned a lot. The guide was patient and engaging with children. Great value for money.",
      epochMs: Date.now() - 259200000,
      language: "en",
      numericRating: 5,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "Maria Garcia",
        cc1: "ES",
        avatar: null,
      },
    },
    {
      __typename: "Review",
      id: "review_4",
      rating: null,
      content:
        "Good experience overall. The attractions were nice but could have spent more time at each location. Guide was friendly and informative.",
      epochMs: Date.now() - 345600000,
      language: "en",
      numericRating: 4,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "Thomas Mueller",
        cc1: "DE",
        avatar: null,
      },
    },
    {
      __typename: "Review",
      id: "review_5",
      rating: null,
      content:
        "Exceeded expectations! Everything was well organized and the guide made the experience truly special. Worth every penny!",
      epochMs: Date.now() - 432000000,
      language: "en",
      numericRating: 5,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "Emma Williams",
        cc1: "AU",
        avatar: null,
      },
    },
    {
      __typename: "Review",
      id: "review_6",
      rating: null,
      content:
        "Nice tour but a bit expensive for what you get. The locations were beautiful though and the guide was knowledgeable.",
      epochMs: Date.now() - 518400000,
      language: "en",
      numericRating: 3,
      providerName: "Booking.com",
      user: {
        __typename: "User",
        name: "Pierre Dubois",
        cc1: "FR",
        avatar: null,
      },
    },
  ];
};

/**
 * Search for attraction locations
 * @param query - Search query (e.g., "new", "paris")
 * @param languageCode - Language code (default: "en-us")
 */
export const searchAttractionLocation = async (
  query: string,
  languageCode: string = "en-us",
): Promise<SearchLocationResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const destinations = searchMockAttractionLocations(query);
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            destinations,
            products: [],
          },
        });
      }, 300); // Simulate network delay
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/searchLocation?query=${encodeURIComponent(query)}&languagecode=${languageCode}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
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
    console.error("[Attraction Location Search] Failed:", msg);
    throw new Error(`Could not search attraction locations: ${msg}`);
  }
};

/**
 * Search for attractions in a specific location
 * @param id - Location ID (base64 encoded ufi)
 * @param sortBy - Sort method (trending, attr_book_score, lowest_price)
 * @param page - Page number (default: 1)
 * @param currencyCode - Currency code (default: "USD")
 * @param languageCode - Language code (default: "en-us")
 */
export const searchAttractions = async (
  id: string,
  sortBy: string = "trending",
  page: number = 1,
  currencyCode: string = "USD",
  languageCode: string = "en-us",
): Promise<SearchAttractionsResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let attractions = searchMockAttractions(id);

        // Sort attractions based on sortBy parameter
        if (sortBy === "lowest_price") {
          attractions = [...attractions].sort(
            (a, b) =>
              a.representativePrice.chargeAmount -
              b.representativePrice.chargeAmount,
          );
        } else if (sortBy === "attr_book_score") {
          attractions = [...attractions].sort((a, b) => {
            const avgA = a.reviewsStats?.combinedNumericStats.average || 0;
            const avgB = b.reviewsStats?.combinedNumericStats.average || 0;
            return avgB - avgA;
          });
        }

        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            __typename: "SearchAttractionsData",
            products: attractions,
            filterStats: {
              __typename: "FilterStats",
              unfilteredProductCount: attractions.length,
              filteredProductCount: attractions.length,
            },
            sorters: [],
            defaultSorter: {
              __typename: "Sorter",
              name: "Trending",
              value: "trending",
            },
            filterOptions: {},
          },
        });
      }, 500); // Simulate network delay
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/searchAttractions?id=${encodeURIComponent(id)}&sortBy=${sortBy}&page=${page}&currency_code=${currencyCode}&languagecode=${languageCode}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${response.statusText}`;
      const body = await response.text().catch(() => "");
      throw new Error(`${msg}${body ? ` - ${body.substring(0, 100)}` : ""}`);
    }

    const data = await response.json();
    // After receiving real response ensure each product has a valid price
    if (data && data.data && Array.isArray(data.data.products)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.products = data.data.products.map((p: any) =>
        ensureAttractionPrice(p),
      );
    }
    return data;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("[Attraction Search] Failed:", msg);
    throw new Error(`Could not search attractions: ${msg}`);
  }
};

/**
 * Get availability calendar for an attraction
 * @param id - Attraction product ID
 * @param languageCode - Language code (default: "en-us")
 */
export const getAvailabilityCalendar = async (
  id: string,
  languageCode: string = "en-us",
): Promise<AvailabilityCalendarResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: getMockAvailabilityCalendar(),
        });
      }, 300);
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/getAvailabilityCalendar?id=${id}&languagecode=${languageCode}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
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
    console.error("[Attraction Availability Calendar] Failed:", msg);
    throw new Error(`Could not retrieve availability calendar: ${msg}`);
  }
};

/**
 * Get availability and time slots for an attraction
 * @param slug - Attraction slug
 * @param date - Date in YYYY-MM-DD format
 * @param currencyCode - Currency code (default: "USD")
 * @param languageCode - Language code (default: "en-us")
 */
export const getAvailability = async (
  slug: string,
  date: string,
  currencyCode: string = "USD",
  languageCode: string = "en-us",
): Promise<AvailabilityResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: getMockTimeSlots(),
        });
      }, 300);
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/getAvailability?slug=${slug}&date=${date}&currency_code=${currencyCode}&languagecode=${languageCode}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
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
    console.error("[Attraction Availability] Failed:", msg);
    throw new Error(`Could not retrieve availability: ${msg}`);
  }
};

/**
 * Get detailed information about an attraction
 * @param slug - Attraction slug
 * @param currencyCode - Currency code (default: "USD")
 */
export const getAttractionDetails = async (
  slug: string,
  currencyCode: string = "USD",
): Promise<AttractionDetailsResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: generateMockAttractionDetails(slug),
        });
      }, 500); // Simulate network delay
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/getAttractionDetails?slug=${slug}&currency_code=${currencyCode}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
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
    console.error("[Attraction Details] Failed:", msg);
    throw new Error(`Could not retrieve attraction details: ${msg}`);
  }
};

/**
 * Get reviews for an attraction
 * @param id - Attraction product ID
 * @param page - Page number (default: 1)
 */
export const getAttractionReviews = async (
  id: string,
  page: number = 1,
): Promise<ReviewsResponse> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: "Success",
          timestamp: Date.now(),
          data: {
            __typename: "Reviews",
            total: 6,
            reviews: generateMockReviews(),
          },
        });
      }, 400); // Simulate network delay
    });
  }

  // Real API call
  try {
    const response = await fetch(
      `${BASE_URL}/getAttractionReviews?id=${id}&page=${page}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
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
    console.error("[Attraction Reviews] Failed:", msg);
    throw new Error(`Could not retrieve attraction reviews: ${msg}`);
  }
};

const attractionService = {
  searchAttractionLocation,
  searchAttractions,
  getAvailabilityCalendar,
  getAvailability,
  getAttractionDetails,
  getAttractionReviews,
};

export default attractionService;
