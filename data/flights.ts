// Mock flight destinations
const mockFlightDestinations = [
  {
    id: "BOM.AIRPORT",
    name: "Mumbai Chhatrapati Shivaji International Airport",
    code: "BOM",
    type: "AIRPORT",
  },
  {
    id: "DEL.AIRPORT",
    name: "Delhi Indira Gandhi International Airport",
    code: "DEL",
    type: "AIRPORT",
  },
  {
    id: "JFK.AIRPORT",
    name: "New York John F. Kennedy International Airport",
    code: "JFK",
    type: "AIRPORT",
  },
  {
    id: "LAX.AIRPORT",
    name: "Los Angeles International Airport",
    code: "LAX",
    type: "AIRPORT",
  },
  {
    id: "LHR.AIRPORT",
    name: "London Heathrow Airport",
    code: "LHR",
    type: "AIRPORT",
  },
];

// Mock flight offers matching Rapid API structure
const mockFlightOffers = [
  {
    token: "mock_token_1",
    segments: [
      {
        departureAirport: {
          type: "AIRPORT",
          code: "BOM",
          city: "BOM",
          cityName: "Mumbai",
          country: "IN",
          countryName: "India",
          name: "Mumbai",
        },
        arrivalAirport: {
          type: "AIRPORT",
          code: "DEL",
          city: "DEL",
          cityName: "Delhi",
          country: "IN",
          countryName: "India",
          name: "Delhi",
        },
        departureTime: "2024-03-20T10:00:00",
        arrivalTime: "2024-03-20T12:30:00",
        legs: [
          {
            departureTime: "2024-03-20T10:00:00",
            arrivalTime: "2024-03-20T12:30:00",
            departureAirport: {
              type: "AIRPORT",
              code: "BOM",
              city: "BOM",
              cityName: "Mumbai",
              country: "IN",
              countryName: "India",
              name: "Mumbai",
            },
            arrivalAirport: {
              type: "AIRPORT",
              code: "DEL",
              city: "DEL",
              cityName: "Delhi",
              country: "IN",
              countryName: "India",
              name: "Delhi",
            },
            cabinClass: "ECONOMY",
            flightInfo: {
              facilities: ["WiFi", "In-flight entertainment", "Meals"],
              flightNumber: 101,
              planeType: "A320",
              carrierInfo: {
                operatingCarrier: "AI",
                marketingCarrier: "AI",
                operatingCarrierDisclosureText: "",
              },
            },
            carriers: ["AI", "AI"],
            carriersData: [
              {
                name: "Air India",
                code: "AI",
                logo: "https://r-xx.bstatic.com/data/airlines_logo/AI.png",
              },
            ],
            totalTime: 9000, // 2h 30m in seconds
            flightStops: [],
          },
        ],
        totalTime: 9000,
        travellerCheckedLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "CHECKED_IN",
              ruleType: "WEIGHT_BASED",
              maxTotalWeight: 44.1,
              massUnit: "LB",
              maxPiece: 1,
            },
          },
        ],
        travellerCabinLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "HAND",
              maxPiece: 1,
              maxWeightPerPiece: 17.6,
              massUnit: "LB",
              sizeRestrictions: {
                maxLength: 21.7,
                maxWidth: 13.8,
                maxHeight: 9.8,
                sizeUnit: "INCH",
              },
            },
            personalItem: true,
          },
        ],
        isAtolProtected: false,
        showWarningDestinationAirport: false,
        showWarningOriginAirport: false,
      },
    ],
    priceBreakdown: {
      total: {
        currencyCode: "USD",
        units: 500,
        nanos: 0,
      },
      baseFare: {
        currencyCode: "USD",
        units: 420,
        nanos: 0,
      },
      fee: {
        currencyCode: "USD",
        units: 0,
        nanos: 0,
      },
      tax: {
        currencyCode: "USD",
        units: 80,
        nanos: 0,
      },
      totalRounded: {
        currencyCode: "USD",
        nanos: 0,
        units: 500,
      },
    },
    travellerPrices: [
      {
        travellerPriceBreakdown: {
          total: {
            currencyCode: "USD",
            units: 500,
            nanos: 0,
          },
        },
        travellerReference: "1",
        travellerType: "ADULT",
      },
    ],
  },
  {
    token: "mock_token_2",
    segments: [
      {
        departureAirport: {
          type: "AIRPORT",
          code: "BOM",
          city: "BOM",
          cityName: "Mumbai",
          country: "IN",
          countryName: "India",
          name: "Mumbai",
        },
        arrivalAirport: {
          type: "AIRPORT",
          code: "DEL",
          city: "DEL",
          cityName: "Delhi",
          country: "IN",
          countryName: "India",
          name: "Delhi",
        },
        departureTime: "2024-03-20T14:00:00",
        arrivalTime: "2024-03-20T16:45:00",
        legs: [
          {
            departureTime: "2024-03-20T14:00:00",
            arrivalTime: "2024-03-20T16:45:00",
            departureAirport: {
              type: "AIRPORT",
              code: "BOM",
              city: "BOM",
              cityName: "Mumbai",
              country: "IN",
              countryName: "India",
              name: "Mumbai",
            },
            arrivalAirport: {
              type: "AIRPORT",
              code: "DEL",
              city: "DEL",
              cityName: "Delhi",
              country: "IN",
              countryName: "India",
              name: "Delhi",
            },
            cabinClass: "ECONOMY",
            flightInfo: {
              facilities: ["WiFi", "USB charging ports"],
              flightNumber: 2775,
              planeType: "A321",
              carrierInfo: {
                operatingCarrier: "6E",
                marketingCarrier: "6E",
                operatingCarrierDisclosureText: "",
              },
            },
            carriers: ["6E", "6E"],
            carriersData: [
              {
                name: "IndiGo",
                code: "6E",
                logo: "https://r-xx.bstatic.com/data/airlines_logo/6E.png",
              },
            ],
            totalTime: 9900, // 2h 45m in seconds
            flightStops: [],
          },
        ],
        totalTime: 9900,
        travellerCheckedLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "CHECKED_IN",
              ruleType: "PIECE_BASED",
              maxPiece: 1,
              maxWeightPerPiece: 33.1,
              massUnit: "LB",
            },
          },
        ],
        travellerCabinLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "HAND",
              maxPiece: 1,
              maxWeightPerPiece: 15.4,
              massUnit: "LB",
              sizeRestrictions: {
                maxLength: 21.7,
                maxWidth: 13.8,
                maxHeight: 9.8,
                sizeUnit: "INCH",
              },
            },
          },
        ],
        isAtolProtected: false,
        showWarningDestinationAirport: false,
        showWarningOriginAirport: false,
      },
    ],
    priceBreakdown: {
      total: {
        currencyCode: "USD",
        units: 450,
        nanos: 0,
      },
      baseFare: {
        currencyCode: "USD",
        units: 380,
        nanos: 0,
      },
      fee: {
        currencyCode: "USD",
        units: 0,
        nanos: 0,
      },
      tax: {
        currencyCode: "USD",
        units: 70,
        nanos: 0,
      },
      totalRounded: {
        currencyCode: "USD",
        nanos: 0,
        units: 450,
      },
    },
    travellerPrices: [
      {
        travellerPriceBreakdown: {
          total: {
            currencyCode: "USD",
            units: 450,
            nanos: 0,
          },
        },
        travellerReference: "1",
        travellerType: "ADULT",
      },
    ],
  },
  {
    token: "mock_token_3",
    segments: [
      {
        departureAirport: {
          type: "AIRPORT",
          code: "BOM",
          city: "BOM",
          cityName: "Mumbai",
          country: "IN",
          countryName: "India",
          name: "Mumbai",
        },
        arrivalAirport: {
          type: "AIRPORT",
          code: "DEL",
          city: "DEL",
          cityName: "Delhi",
          country: "IN",
          countryName: "India",
          name: "Delhi",
        },
        departureTime: "2024-03-20T18:00:00",
        arrivalTime: "2024-03-20T20:15:00",
        legs: [
          {
            departureTime: "2024-03-20T18:00:00",
            arrivalTime: "2024-03-20T20:15:00",
            departureAirport: {
              type: "AIRPORT",
              code: "BOM",
              city: "BOM",
              cityName: "Mumbai",
              country: "IN",
              countryName: "India",
              name: "Mumbai",
            },
            arrivalAirport: {
              type: "AIRPORT",
              code: "DEL",
              city: "DEL",
              cityName: "Delhi",
              country: "IN",
              countryName: "India",
              name: "Delhi",
            },
            cabinClass: "ECONOMY",
            flightInfo: {
              facilities: ["WiFi", "Meals", "Entertainment"],
              flightNumber: 505,
              planeType: "B737",
              carrierInfo: {
                operatingCarrier: "SG",
                marketingCarrier: "SG",
                operatingCarrierDisclosureText: "",
              },
            },
            carriers: ["SG", "SG"],
            carriersData: [
              {
                name: "SpiceJet",
                code: "SG",
                logo: "https://r-xx.bstatic.com/data/airlines_logo/SG.png",
              },
            ],
            totalTime: 8100, // 2h 15m in seconds
            flightStops: [],
          },
        ],
        totalTime: 8100,
        travellerCheckedLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "CHECKED_IN",
              ruleType: "WEIGHT_BASED",
              maxTotalWeight: 33.1,
              massUnit: "LB",
              maxPiece: 1,
            },
          },
        ],
        travellerCabinLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "HAND",
              maxPiece: 1,
              maxWeightPerPiece: 15.4,
              massUnit: "LB",
              sizeRestrictions: {
                maxLength: 21.7,
                maxWidth: 13.8,
                maxHeight: 9.8,
                sizeUnit: "INCH",
              },
            },
          },
        ],
        isAtolProtected: false,
        showWarningDestinationAirport: false,
        showWarningOriginAirport: false,
      },
    ],
    priceBreakdown: {
      total: {
        currencyCode: "USD",
        units: 420,
        nanos: 0,
      },
      baseFare: {
        currencyCode: "USD",
        units: 350,
        nanos: 0,
      },
      fee: {
        currencyCode: "USD",
        units: 0,
        nanos: 0,
      },
      tax: {
        currencyCode: "USD",
        units: 70,
        nanos: 0,
      },
      totalRounded: {
        currencyCode: "USD",
        nanos: 0,
        units: 420,
      },
    },
    travellerPrices: [
      {
        travellerPriceBreakdown: {
          total: {
            currencyCode: "USD",
            units: 420,
            nanos: 0,
          },
        },
        travellerReference: "1",
        travellerType: "ADULT",
      },
    ],
  },
];

/**
 * Search mock flight destinations
 */
export const searchMockDestinations = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return mockFlightDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.code?.toLowerCase().includes(lowerQuery),
  );
};

/**
 * Search mock flights - returns data in Rapid API format
 */
export const searchMockFlights = (params: {
  fromId: string;
  toId: string;
  sort?: "BEST" | "CHEAPEST" | "FASTEST";
  stops?: "none" | "0" | "1" | "2";
}) => {
  // Filter by route if needed (for now return all)
  let filteredOffers = [...mockFlightOffers];

  // Apply stops filter
  if (params.stops === "none") {
    filteredOffers = filteredOffers.filter((offer) =>
      offer.segments.every((seg) => seg.legs.length === 1),
    );
  } else if (params.stops === "0") {
    // Any stops - keep all
  } else if (params.stops === "1") {
    // Max 1 stop
    filteredOffers = filteredOffers.filter((offer) =>
      offer.segments.every((seg) => seg.legs.length <= 2),
    );
  } else if (params.stops === "2") {
    // Max 2 stops
    filteredOffers = filteredOffers.filter((offer) =>
      offer.segments.every((seg) => seg.legs.length <= 3),
    );
  }

  // Apply sorting
  if (params.sort === "CHEAPEST") {
    filteredOffers.sort((a, b) => {
      const priceA =
        (a.priceBreakdown?.total?.units || 0) +
        (a.priceBreakdown?.total?.nanos || 0) / 1000000000;
      const priceB =
        (b.priceBreakdown?.total?.units || 0) +
        (b.priceBreakdown?.total?.nanos || 0) / 1000000000;
      return priceA - priceB;
    });
  } else if (params.sort === "FASTEST") {
    filteredOffers.sort((a, b) => {
      const durationA = a.segments.reduce(
        (total, seg) => total + (seg.totalTime || 0),
        0,
      );
      const durationB = b.segments.reduce(
        (total, seg) => total + (seg.totalTime || 0),
        0,
      );
      return durationA - durationB;
    });
  }

  return filteredOffers;
};
