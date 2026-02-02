import type {
  AttractionLocation,
  Attraction,
  AttractionDetails,
  CalendarItem,
  TimeSlot,
} from "@/types/attraction-types";

export const mockAttractionLocations: AttractionLocation[] = [
  {
    id: "ChIJOwg_06VPwokRYv534QaPC8g",
    __typename: "AttractionLocation",
    ufi: 20088325,
    country: "United States",
    cityName: "New York City",
    productCount: 450,
    cc1: "us",
    title: "New York City",
  },
  {
    id: "ChIJE9on3F3HwoAR9AhGJW_fL-I",
    __typename: "AttractionLocation",
    ufi: 20033173,
    country: "United States",
    cityName: "Los Angeles",
    productCount: 320,
    cc1: "us",
    title: "Los Angeles",
  },
  {
    id: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
    __typename: "AttractionLocation",
    ufi: -2601889,
    country: "United Kingdom",
    cityName: "London",
    productCount: 680,
    cc1: "gb",
    title: "London",
  },
  {
    id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
    __typename: "AttractionLocation",
    ufi: 20015732,
    country: "United States",
    cityName: "San Francisco",
    productCount: 280,
    cc1: "us",
    title: "San Francisco",
  },
  {
    id: "ChIJyWEHuEmuEmsRm9hTkapTCrk",
    __typename: "AttractionLocation",
    ufi: -1603135,
    country: "Australia",
    cityName: "Sydney",
    productCount: 380,
    cc1: "au",
    title: "Sydney",
  },
];

export const mockAttractions: Attraction[] = [
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    id: "prod_001",
    name: "Statue of Liberty & Ellis Island Tour",
    slug: "statue-of-liberty-ellis-island-tour",
    shortDescription:
      "Visit two of New York's most iconic landmarks with priority boarding and audio guide included.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 29.0,
      currency: "USD",
      publicAmount: 29.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small:
        "https://images.unsplash.com/photo-1569928995870-5d80f9e9f0bc?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 15234,
      percentage: "92%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.6,
        total: 15234,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "New York",
      ufi: 20088325,
      url: {
        __typename: "Url",
        country: "us",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_001",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: [
      {
        __typename: "Flag",
        flag: "bestseller",
        value: true,
        rank: 1,
      },
    ],
  },
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    id: "prod_002",
    name: "Empire State Building Observatory",
    slug: "empire-state-building-observatory",
    shortDescription:
      "Skip-the-line access to the iconic Empire State Building with breathtaking 360-degree views of NYC.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 44.0,
      currency: "USD",
      publicAmount: 44.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small: "https://images.unsplash.com/photo-1546436833-cc5b88c6e0f7?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 28567,
      percentage: "95%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.8,
        total: 28567,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "New York",
      ufi: 20088325,
      url: {
        __typename: "Url",
        country: "us",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_002",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: [
      {
        __typename: "Flag",
        flag: "bestseller",
        value: true,
        rank: 2,
      },
    ],
  },
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: false,
    },
    id: "prod_003",
    name: "Warner Bros. Studio Tour Hollywood",
    slug: "warner-bros-studio-tour-hollywood",
    shortDescription:
      "Go behind the scenes of your favorite movies and TV shows on this comprehensive studio tour.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 69.0,
      currency: "USD",
      publicAmount: 69.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 8932,
      percentage: "90%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.5,
        total: 8932,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "Los Angeles",
      ufi: 20033173,
      url: {
        __typename: "Url",
        country: "us",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_003",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: null,
  },
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    id: "prod_004",
    name: "Tower of London Tickets",
    slug: "tower-of-london-tickets",
    shortDescription:
      "Explore 1000 years of history at the Tower of London and see the Crown Jewels up close.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 35.0,
      currency: "USD",
      publicAmount: 35.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 19843,
      percentage: "93%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.7,
        total: 19843,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "London",
      ufi: -2601889,
      url: {
        __typename: "Url",
        country: "gb",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_004",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: [
      {
        __typename: "Flag",
        flag: "bestseller",
        value: true,
        rank: 1,
      },
    ],
  },
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    id: "prod_005",
    name: "Golden Gate Bridge Walking Tour",
    slug: "golden-gate-bridge-walking-tour",
    shortDescription:
      "Walk across the iconic Golden Gate Bridge with a knowledgeable guide sharing fascinating stories.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 25.0,
      currency: "USD",
      publicAmount: 25.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 6432,
      percentage: "88%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.4,
        total: 6432,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "San Francisco",
      ufi: 20015732,
      url: {
        __typename: "Url",
        country: "us",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_005",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: null,
  },
  {
    __typename: "Attraction",
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    id: "prod_006",
    name: "Sydney Opera House Guided Tour",
    slug: "sydney-opera-house-guided-tour",
    shortDescription:
      "Discover the architectural marvel of the Sydney Opera House on this comprehensive guided tour.",
    representativePrice: {
      __typename: "Price",
      chargeAmount: 42.0,
      currency: "USD",
      publicAmount: 42.0,
    },
    primaryPhoto: {
      __typename: "Photo",
      small:
        "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=400",
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 12765,
      percentage: "94%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.7,
        total: 12765,
      },
    },
    ufiDetails: {
      __typename: "UfiDetails",
      bCityName: "Sydney",
      ufi: -1603135,
      url: {
        __typename: "Url",
        country: "au",
      },
    },
    offers: [
      {
        __typename: "Offer",
        items: [
          {
            __typename: "OfferItem",
            id: "offer_006",
          },
        ],
      },
    ],
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
    },
    flags: [
      {
        __typename: "Flag",
        flag: "bestseller",
        value: true,
        rank: 3,
      },
    ],
  },
];

export const mockAttractionDetails: Record<string, AttractionDetails> = {
  "statue-of-liberty-ellis-island-tour": {
    __typename: "AttractionDetails",
    accessibility: [],
    additionalBookingInfo: null,
    additionalInfo:
      "Please arrive 30 minutes before departure time. Security screening required.",
    addresses: {
      __typename: "Addresses",
      arrival: [
        {
          __typename: "Address",
          address: "Battery Park, New York, NY 10004",
          city: "New York",
          country: "United States",
          latitude: "40.7033",
          longitude: "-74.0170",
          locationType: "meeting_point",
        },
      ],
      attraction: null,
      departure: [],
      entrance: null,
      guestPickup: null,
      meeting: null,
      pickup: null,
    },
    applicableTerms: [
      {
        __typename: "Terms",
        policyProvider: "Statue Cruises",
        privacyPolicyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
      },
    ],
    audioSupportedLanguages: [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
    ],
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    covid: [],
    description:
      "Experience the majesty of Lady Liberty up close on this comprehensive tour. Your journey begins with priority boarding onto the ferry, allowing you to skip the long lines. As you cruise across New York Harbor, enjoy stunning views of the Manhattan skyline and Brooklyn Bridge. On Liberty Island, explore the grounds and museum at your own pace with an informative audio guide. Continue to Ellis Island, where millions of immigrants first arrived in America, and discover their stories in the acclaimed Immigration Museum. This tour includes round-trip ferry transportation, audio guides, and plenty of time to explore both islands.",
    dietOptions: [],
    flags: [],
    guideSupportedLanguages: ["English"],
    healthSafety: [
      "Enhanced cleaning procedures",
      "Social distancing measures",
      "Hand sanitizer available",
    ],
    id: "prod_001",
    isBookable: true,
    labels: [
      {
        __typename: "Label",
        text: "Skip the line",
        type: "feature",
      },
      {
        __typename: "Label",
        text: "Audio guide included",
        type: "feature",
      },
    ],
    name: "Statue of Liberty & Ellis Island Tour",
    notIncluded: [
      "Food and beverages",
      "Crown access (requires separate reservation)",
    ],
    offers: [
      {
        __typename: "Offer",
        availabilityType: "fixed_time",
        id: "offer_001",
      },
    ],
    onSiteRequirements: {
      __typename: "OnSiteRequirements",
      voucherPrintingRequired: false,
    },
    operatedBy: "Statue Cruises",
    photos: [
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1569928995870-5d80f9e9f0bc?w=400",
        medium:
          "https://images.unsplash.com/photo-1569928995870-5d80f9e9f0bc?w=800",
        isPrimary: true,
      },
    ],
    primaryPhoto: {
      __typename: "Photo",
      small:
        "https://images.unsplash.com/photo-1569928995870-5d80f9e9f0bc?w=400",
    },
    representativePrice: {
      __typename: "Price",
      chargeAmount: 29.0,
      currency: "USD",
      publicAmount: 29.0,
    },
    restrictions: [],
    reviews: {
      __typename: "Reviews",
      total: 15234,
      reviews: [
        {
          __typename: "Review",
          id: "rev_001",
          rating: true,
          content:
            "Absolutely amazing experience! The audio guide was very informative.",
          epochMs: 1704067200000,
          language: "en",
          numericRating: 5,
          providerName: "TripAdvisor",
          user: {
            __typename: "User",
            name: "Sarah M.",
            cc1: "us",
            avatar: null,
          },
        },
      ],
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 15234,
      percentage: "92%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.6,
        total: 15234,
      },
    },
    shortDescription:
      "Visit two of New York's most iconic landmarks with priority boarding and audio guide included.",
    slug: "statue-of-liberty-ellis-island-tour",
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
      nativeAppBookProcess: true,
      liveAvailabilityCheckSupported: true,
    },
    uniqueSellingPoints: [
      "Skip-the-line priority boarding",
      "Audio guide in multiple languages",
      "Visit both Liberty Island and Ellis Island",
      "Flexible timing",
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
      "Round-trip ferry tickets",
      "Audio guide",
      "Access to Liberty Island",
      "Access to Ellis Island Immigration Museum",
    ],
  },
  "empire-state-building-observatory": {
    __typename: "AttractionDetails",
    accessibility: ["Wheelchair accessible", "Elevator access"],
    additionalBookingInfo: null,
    additionalInfo: "Valid photo ID required for all visitors.",
    addresses: {
      __typename: "Addresses",
      arrival: [
        {
          __typename: "Address",
          address: "20 West 34th Street, New York, NY 10001",
          city: "New York",
          country: "United States",
          latitude: "40.7484",
          longitude: "-73.9857",
          locationType: "entrance",
        },
      ],
      attraction: null,
      departure: [],
      entrance: null,
      guestPickup: null,
      meeting: null,
      pickup: null,
    },
    applicableTerms: [
      {
        __typename: "Terms",
        policyProvider: "Empire State Building",
        privacyPolicyUrl: "https://example.com/privacy",
        termsUrl: "https://example.com/terms",
      },
    ],
    audioSupportedLanguages: null,
    cancellationPolicy: {
      __typename: "CancellationPolicy",
      hasFreeCancellation: true,
    },
    covid: [],
    description:
      "Soar 1,050 feet above the city to the 86th-floor observation deck of the Empire State Building. This Art Deco masterpiece offers breathtaking 360-degree views of New York City and beyond. On a clear day, you can see up to six states! Skip the ticket lines with this convenient advance booking and head straight to security. Explore the interactive exhibits showcasing the building's rich history and construction. Your ticket includes access to both the 86th-floor outdoor observation deck and the climate-controlled 80th floor. Upgrade to the 102nd-floor observatory for an even more spectacular view from the highest point in Midtown Manhattan.",
    dietOptions: [],
    flags: [],
    guideSupportedLanguages: [],
    healthSafety: ["Enhanced cleaning", "Limited capacity", "Touchless entry"],
    id: "prod_002",
    isBookable: true,
    labels: [
      {
        __typename: "Label",
        text: "Skip the ticket line",
        type: "feature",
      },
    ],
    name: "Empire State Building Observatory",
    notIncluded: ["102nd-floor access (available as upgrade)"],
    offers: [
      {
        __typename: "Offer",
        availabilityType: "open_dated",
        id: "offer_002",
      },
    ],
    onSiteRequirements: {
      __typename: "OnSiteRequirements",
      voucherPrintingRequired: false,
    },
    operatedBy: "Empire State Realty Trust",
    photos: [
      {
        __typename: "Photo",
        small:
          "https://images.unsplash.com/photo-1546436833-cc5b88c6e0f7?w=400",
        medium:
          "https://images.unsplash.com/photo-1546436833-cc5b88c6e0f7?w=800",
        isPrimary: true,
      },
    ],
    primaryPhoto: {
      __typename: "Photo",
      small: "https://images.unsplash.com/photo-1546436833-cc5b88c6e0f7?w=400",
    },
    representativePrice: {
      __typename: "Price",
      chargeAmount: 44.0,
      currency: "USD",
      publicAmount: 44.0,
    },
    restrictions: [],
    reviews: {
      __typename: "Reviews",
      total: 28567,
      reviews: [
        {
          __typename: "Review",
          id: "rev_002",
          rating: true,
          content: "The views are absolutely spectacular! A must-do in NYC.",
          epochMs: 1704153600000,
          language: "en",
          numericRating: 5,
          providerName: "Google",
          user: {
            __typename: "User",
            name: "Michael R.",
            cc1: "us",
            avatar: null,
          },
        },
      ],
    },
    reviewsStats: {
      __typename: "ReviewsStats",
      allReviewsCount: 28567,
      percentage: "95%",
      combinedNumericStats: {
        __typename: "NumericStats",
        average: 4.8,
        total: 28567,
      },
    },
    shortDescription:
      "Skip-the-line access to the iconic Empire State Building with breathtaking 360-degree views of NYC.",
    slug: "empire-state-building-observatory",
    supportedFeatures: {
      __typename: "SupportedFeatures",
      nativeApp: true,
      nativeAppBookProcess: true,
      liveAvailabilityCheckSupported: false,
    },
    uniqueSellingPoints: [
      "360-degree views from 86th floor",
      "Skip the ticket line",
      "Valid for any day within one year",
      "Interactive exhibits included",
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
      "Skip-the-line ticket access",
      "86th-floor observation deck access",
      "80th-floor exhibits",
      "One-year validity",
    ],
  },
};

export const mockAvailabilityCalendar: CalendarItem[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      __typename: "CalendarItem",
      available: i % 7 !== 0, // Not available on every 7th day
      date: date.toISOString().split("T")[0],
    };
  },
);

export const mockTimeSlots: TimeSlot[] = [
  {
    __typename: "TimeSlot",
    fullDay: false,
    start: "09:00",
    timeSlotId: "slot_001",
    timeSlotOffers: [
      {
        __typename: "TimeSlotOffer",
        languageOptions: [
          {
            __typename: "LanguageOption",
            label: "English",
            language: "en",
            type: "AUDIO",
          },
        ],
        id: "offer_slot_001",
        items: [
          {
            __typename: "TimeSlotOfferItem",
            cancellationPolicy: {
              __typename: "CancellationPolicy",
              comparedTo: "start_time",
              hasFreeCancellation: true,
              isStillRefundable: true,
              percentage: 100,
              period: "24_hours",
            },
            constraint: {
              __typename: "Constraint",
              label: "Adult",
              maxGroupSize: null,
              minGroupSize: null,
            },
            id: "item_001",
            offerItemId: "offer_item_001",
            type: "TICKET",
            tieredPricing: false,
            price: {
              __typename: "Price",
              chargeAmount: 29.0,
              currency: "USD",
              publicAmount: 29.0,
            },
            convertedPrice: null,
            languageOption: null,
            travelerCountRequired: null,
            ticketsAvailable: 150,
            maxPerReservation: 10,
            minPerReservation: 1,
            duration: "3h",
            label: "Adult (18+)",
          },
        ],
        label: "Standard Admission",
        reservationRestrictions: {
          __typename: "ReservationRestrictions",
          adultRequiredForReservation: false,
          maxOfferItemsPerReservation: 10,
          minOfferItemsPerReservation: 1,
        },
      },
    ],
  },
  {
    __typename: "TimeSlot",
    fullDay: false,
    start: "13:00",
    timeSlotId: "slot_002",
    timeSlotOffers: [
      {
        __typename: "TimeSlotOffer",
        languageOptions: [
          {
            __typename: "LanguageOption",
            label: "English",
            language: "en",
            type: "AUDIO",
          },
        ],
        id: "offer_slot_002",
        items: [
          {
            __typename: "TimeSlotOfferItem",
            cancellationPolicy: {
              __typename: "CancellationPolicy",
              comparedTo: "start_time",
              hasFreeCancellation: true,
              isStillRefundable: true,
              percentage: 100,
              period: "24_hours",
            },
            constraint: {
              __typename: "Constraint",
              label: "Adult",
              maxGroupSize: null,
              minGroupSize: null,
            },
            id: "item_002",
            offerItemId: "offer_item_002",
            type: "TICKET",
            tieredPricing: false,
            price: {
              __typename: "Price",
              chargeAmount: 29.0,
              currency: "USD",
              publicAmount: 29.0,
            },
            convertedPrice: null,
            languageOption: null,
            travelerCountRequired: null,
            ticketsAvailable: 120,
            maxPerReservation: 10,
            minPerReservation: 1,
            duration: "3h",
            label: "Adult (18+)",
          },
        ],
        label: "Standard Admission",
        reservationRestrictions: {
          __typename: "ReservationRestrictions",
          adultRequiredForReservation: false,
          maxOfferItemsPerReservation: 10,
          minOfferItemsPerReservation: 1,
        },
      },
    ],
  },
];

// Helper function to search mock attraction locations
export function searchMockAttractionLocations(
  query: string,
): AttractionLocation[] {
  const lowerQuery = query.toLowerCase();
  return mockAttractionLocations.filter(
    (loc) =>
      loc.cityName?.toLowerCase().includes(lowerQuery) ||
      loc.title?.toLowerCase().includes(lowerQuery) ||
      loc.country?.toLowerCase().includes(lowerQuery),
  );
}

// Helper function to search mock attractions by location
export function searchMockAttractions(locationId: string): Attraction[] {
  const location = mockAttractionLocations.find((loc) => loc.id === locationId);
  if (!location) return mockAttractions;

  return mockAttractions.filter(
    (attraction) => attraction.ufiDetails.ufi === location.ufi,
  );
}

// Helper function to get attraction details
export function getMockAttractionDetails(
  slug: string,
): AttractionDetails | null {
  return mockAttractionDetails[slug] || null;
}

// Helper function to get availability calendar
export function getMockAvailabilityCalendar(): CalendarItem[] {
  return mockAvailabilityCalendar;
}

// Helper function to get time slots
export function getMockTimeSlots(): TimeSlot[] {
  return mockTimeSlots;
}
