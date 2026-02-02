import type { 
  Hotel, 
  HotelDetails, 
  Room, 
  HotelDestination 
} from '@/types/hotel-types';

export const mockHotelDestinations: HotelDestination[] = [
  {
    dest_id: '20088325',
    dest_type: 'city',
    label: 'New York City, New York, United States',
    name: 'New York City',
    city_name: 'New York City',
    country: 'United States',
    region: 'New York',
    nr_hotels: 1250,
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    dest_id: '20033173',
    dest_type: 'city',
    label: 'Los Angeles, California, United States',
    name: 'Los Angeles',
    city_name: 'Los Angeles',
    country: 'United States',
    region: 'California',
    nr_hotels: 890,
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    dest_id: '-2601889',
    dest_type: 'city',
    label: 'London, United Kingdom',
    name: 'London',
    city_name: 'London',
    country: 'United Kingdom',
    nr_hotels: 2100,
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    dest_id: '-782831',
    dest_type: 'city',
    label: 'Dubai, United Arab Emirates',
    name: 'Dubai',
    city_name: 'Dubai',
    country: 'United Arab Emirates',
    nr_hotels: 650,
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

export const mockHotels: Hotel[] = [
  {
    hotel_id: 123456,
    accessibilityLabel: 'The Plaza Hotel - Luxury 5-star hotel in Manhattan',
    property: {
      name: 'The Plaza Hotel',
      reviewScore: 9.2,
      reviewScoreWord: 'Superb',
      reviewCount: 3456,
      latitude: 40.7644,
      longitude: -73.9742,
      checkinDate: '2026-02-15',
      checkoutDate: '2026-02-17',
      photoUrls: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      ],
      mainPhotoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    },
    position: 1,
    rankingPosition: 1,
    priceBreakdown: {
      grossPrice: {
        value: 450.0,
        currency: 'USD',
      },
      hasIncludedTaxesAndCharges: true,
    },
  },
  {
    hotel_id: 234567,
    accessibilityLabel: 'Comfort Inn Midtown - Affordable 3-star hotel near Times Square',
    property: {
      name: 'Comfort Inn Midtown',
      reviewScore: 8.1,
      reviewScoreWord: 'Very Good',
      reviewCount: 1892,
      latitude: 40.7589,
      longitude: -73.9851,
      checkinDate: '2026-02-15',
      checkoutDate: '2026-02-17',
      photoUrls: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      ],
      mainPhotoUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    },
    position: 2,
    rankingPosition: 15,
    priceBreakdown: {
      grossPrice: {
        value: 189.99,
        currency: 'USD',
      },
      strikethroughPrice: {
        value: 229.99,
        currency: 'USD',
      },
      hasIncludedTaxesAndCharges: true,
    },
  },
  {
    hotel_id: 345678,
    accessibilityLabel: 'Beverly Hills Hotel - Iconic luxury hotel in Los Angeles',
    property: {
      name: 'Beverly Hills Hotel',
      reviewScore: 9.5,
      reviewScoreWord: 'Exceptional',
      reviewCount: 2341,
      latitude: 34.0836,
      longitude: -118.4135,
      checkinDate: '2026-03-01',
      checkoutDate: '2026-03-03',
      photoUrls: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      ],
      mainPhotoUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    },
    position: 1,
    rankingPosition: 1,
    priceBreakdown: {
      grossPrice: {
        value: 595.0,
        currency: 'USD',
      },
      hasIncludedTaxesAndCharges: true,
    },
  },
  {
    hotel_id: 456789,
    accessibilityLabel: 'The Savoy London - Historic 5-star luxury hotel',
    property: {
      name: 'The Savoy',
      reviewScore: 9.3,
      reviewScoreWord: 'Superb',
      reviewCount: 4123,
      latitude: 51.5101,
      longitude: -0.1206,
      checkinDate: '2026-02-20',
      checkoutDate: '2026-02-23',
      photoUrls: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      ],
      mainPhotoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    },
    position: 1,
    rankingPosition: 2,
    priceBreakdown: {
      grossPrice: {
        value: 520.0,
        currency: 'USD',
      },
      hasIncludedTaxesAndCharges: true,
    },
  },
];

export const mockHotelDetails: Record<number, HotelDetails> = {
  123456: {
    hotel_id: 123456,
    hotel_name: 'The Plaza Hotel',
    address: '768 5th Ave',
    city: 'New York',
    zip: '10019',
    country: 'United States',
    is_free_cancellable: true,
    countrycode: 'US',
    latitude: 40.7644,
    longitude: -73.9742,
    checkin: {
      from: '15:00',
      until: '23:00',
    },
    checkout: {
      from: '06:00',
      until: '12:00',
    },
    hotel_description:
      'The iconic Plaza Hotel, a New York City landmark since 1907, offers unparalleled luxury in the heart of Manhattan. Located at Fifth Avenue and Central Park South, this legendary hotel combines timeless elegance with modern amenities. Featuring beautifully appointed rooms and suites, world-class dining, and exceptional service.',
    hotel_facilities: [
      { name: 'Free WiFi' },
      { name: 'Restaurant' },
      { name: 'Room service' },
      { name: 'Fitness center' },
      { name: 'Spa' },
      { name: 'Concierge service' },
      { name: 'Business center' },
      { name: 'Parking (surcharge)' },
    ],
    review_score: 9.2,
    review_score_word: 'Superb',
    review_nr: 3456,
    main_photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    photos: [
      {
        url_original: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
        url_max300: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300',
        url_square60: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=60',
      },
    ],
  },
  234567: {
    hotel_id: 234567,
    hotel_name: 'Comfort Inn Midtown',
    address: '129 West 46th Street',
    city: 'New York',
    zip: '10036',
    country: 'United States',
    is_free_cancellable: true,
    countrycode: 'US',
    latitude: 40.7589,
    longitude: -73.9851,
    checkin: {
      from: '15:00',
      until: '00:00',
    },
    checkout: {
      from: '07:00',
      until: '11:00',
    },
    hotel_description:
      'Located in the heart of Midtown Manhattan, Comfort Inn offers comfortable accommodations just steps from Times Square, Broadway theaters, and countless dining options. Perfect for both business and leisure travelers seeking value and convenience in New York City.',
    hotel_facilities: [
      { name: 'Free WiFi' },
      { name: 'Breakfast included' },
      { name: '24-hour front desk' },
      { name: 'Air conditioning' },
      { name: 'Non-smoking rooms' },
    ],
    review_score: 8.1,
    review_score_word: 'Very Good',
    review_nr: 1892,
    main_photo_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    photos: [
      {
        url_original: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
        url_max300: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300',
        url_square60: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=60',
      },
    ],
  },
};

export const mockRooms: Record<number, Room[]> = {
  123456: [
    {
      room_id: 1001,
      room_name: 'Deluxe King Room',
      room_surface_in_feet2: 400,
      facilities: [
        { name: 'King bed' },
        { name: 'City view' },
        { name: 'Marble bathroom' },
        { name: 'Minibar' },
        { name: 'Safe' },
        { name: 'Flatscreen TV' },
      ],
      description: 'Elegantly appointed room with king bed and stunning city views',
      max_occupancy: 2,
      price: {
        value: 450.0,
        currency: 'USD',
      },
    },
    {
      room_id: 1002,
      room_name: 'Plaza Suite',
      room_surface_in_feet2: 750,
      facilities: [
        { name: 'King bed' },
        { name: 'Separate living room' },
        { name: 'Central Park view' },
        { name: 'Marble bathroom with soaking tub' },
        { name: 'Minibar' },
        { name: 'Safe' },
        { name: 'Multiple TVs' },
      ],
      description: 'Luxurious suite with separate living area and Central Park views',
      max_occupancy: 3,
      price: {
        value: 850.0,
        currency: 'USD',
      },
    },
  ],
  234567: [
    {
      room_id: 2001,
      room_name: 'Standard Queen Room',
      room_surface_in_feet2: 250,
      facilities: [
        { name: 'Queen bed' },
        { name: 'Flatscreen TV' },
        { name: 'Coffee maker' },
        { name: 'Free WiFi' },
      ],
      description: 'Comfortable room with modern amenities',
      max_occupancy: 2,
      price: {
        value: 189.99,
        currency: 'USD',
      },
    },
  ],
};

// Helper function to search mock hotel destinations
export function searchMockHotelDestinations(query: string): HotelDestination[] {
  const lowerQuery = query.toLowerCase();
  return mockHotelDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.city_name?.toLowerCase().includes(lowerQuery) ||
      dest.country?.toLowerCase().includes(lowerQuery)
  );
}

// Helper function to search mock hotels by destination
export function searchMockHotels(dest_id: string): Hotel[] {
  // Simple mapping - in reality you'd filter by actual dest_id
  const destName = mockHotelDestinations.find((d) => d.dest_id === dest_id)?.name;
  
  if (destName === 'New York City') {
    return mockHotels.filter((h) => h.hotel_id === 123456 || h.hotel_id === 234567);
  }
  if (destName === 'Los Angeles') {
    return mockHotels.filter((h) => h.hotel_id === 345678);
  }
  if (destName === 'London') {
    return mockHotels.filter((h) => h.hotel_id === 456789);
  }
  
  return mockHotels;
}

// Helper function to get hotel details
export function getMockHotelDetails(hotel_id: number): HotelDetails | null {
  return mockHotelDetails[hotel_id] || null;
}

// Helper function to get hotel rooms
export function getMockHotelRooms(hotel_id: number): Room[] {
  return mockRooms[hotel_id] || [];
}
