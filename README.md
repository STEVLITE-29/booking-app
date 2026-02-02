# Travel Go - Booking App

A modern travel itinerary platform that enables users to search for and book flights, hotels, and activities/attractions in one seamless experience.

## 📋 Project Overview

Travel Go is a full-stack web application designed to help travelers plan their trips by searching for flights, accommodations, and local attractions through the Booking.com API. Users can create trip itineraries, search across multiple travel services, and manage their bookings in a centralized dashboard.

### Key Features

- **Flight Search**: Browse and filter available flights with detailed information including duration, stops, pricing, and baggage allowance
- **Hotel Search**: Discover accommodations with filters for price range, ratings, amenities, and free cancellation options
- **Activity Booking**: Explore local attractions with availability calendars, time slots, and pricing
- **Trip Management**: Create and manage multiple trip itineraries with automatic persistence
- **Responsive Design**: Full mobile, tablet, and desktop support with adaptive navigation
- **Real-time Search**: Debounced search with caching to optimize API usage
- **Multi-currency Support**: Display prices in different currencies with exchange rate conversion

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 16.1.6 with React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design tokens
- **State Management**: Zustand 5 with persistence middleware
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: Lucide React icon library
- **API Integration**: RapidAPI Booking.com API

### Project Structure

```
my-booking-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with sidebar & navbar
│   ├── page.tsx                 # Landing/itinerary page
│   ├── globals.css              # Global styles & CSS variables
│   ├── activities/              # Activities search page
│   ├── flights/                 # Flights search page
│   ├── hotels/                  # Hotels search page
│   └── api/meta/                # Meta service API routes
├── components/
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Sidebar.tsx              # Side navigation menu
│   ├── LocationSearch.tsx        # Location autocomplete component
│   ├── *Card.tsx                # Individual item cards
│   ├── *DetailsModal.tsx         # Item detail modals
│   ├── *ItinerarySection.tsx     # Itinerary sections for each type
│   ├── *ItineraryEmptyState.tsx  # Empty state components
│   ├── attractions/             # Attraction-specific components
│   └── ui/                      # Reusable UI components (Button, NavItem, etc.)
├── pages/
│   ├── FlightsPage.tsx          # Flight search functionality
│   ├── HotelPage.tsx            # Hotel search functionality
│   └── AttractionsPage.tsx      # Attractions search functionality
├── services/
│   ├── flightServices.ts        # Flight API wrapper with dual mock/real API
│   ├── hotel-service.ts         # Hotel API wrapper with dual mock/real API
│   ├── attractionService.ts     # Attraction API wrapper with dual mock/real API
│   └── metaService.ts           # Currency & location services
├── store/
│   ├── flightStore.ts           # Flight search state (Zustand)
│   ├── hotel-store.ts           # Hotel search state (Zustand)
│   ├── attractionStore.ts       # Attraction search state (Zustand)
│   └── itineraryStore.ts        # Trip itinerary state (Zustand with persistence)
├── types/
│   ├── flight-api-types.ts      # Flight API response types
│   ├── hotel-types.ts           # Hotel API response types
│   ├── attraction-types.ts      # Attraction API response types
│   ├── itinerary-types.ts       # Trip itinerary types
│   └── flight-types.ts          # Additional flight type definitions
├── data/
│   ├── flights.ts               # Mock flight data
│   ├── hotels.ts                # Mock hotel data
│   └── attractions.ts           # Mock attraction data
├── utils/
│   ├── apiUtils.ts              # TTL cache implementation for API responses
│   └── price-helpers.ts         # Price formatting & currency conversion utilities
└── lib/
    └── utils.ts                 # General utility functions
```

## 🔑 Key Features Explained

### 1. Dual API Mode (Mock Data & Real API)

The application implements a smart toggle system for seamless testing and production:

**Location**: `.env.local`

- `NEXT_PUBLIC_USE_MOCK_DATA=true` → Use mock data for testing
- `NEXT_PUBLIC_USE_MOCK_DATA=false` → Use real Booking.com API

**Implementation**:

- All service files (`services/flightServices.ts`, `services/hotel-service.ts`, `services/attractionService.ts`) contain conditional logic
- When `USE_MOCK_DATA=true`, functions return pre-generated mock data with realistic structure
- When `USE_MOCK_DATA=false`, functions make actual API calls to Booking.com via RapidAPI
- Mock data maintains the exact same response structure as real API for seamless switching

**Why Mock Data Was Needed**:

- RapidAPI Booking.com API has strict rate limiting (limited free tier requests)
- Each feature required multiple API calls for testing and development
- Mock data allows unlimited local development without consuming API quota
- Comprehensive mock datasets in `data/flights.ts`, `data/hotels.ts`, `data/attractions.ts`

### 2. Advanced Caching Strategy

Implements TTL (Time To Live) caching to minimize API calls:

**Location**: `utils/apiUtils.ts` (TTLCache implementation)

**Cache Instances**:

- Flight destination cache: 5-minute TTL
- Flight search results: 5-minute TTL
- Hotel destination cache: 10-minute TTL
- Hotel search results: 15-minute TTL
- Attraction location search: 10-minute TTL
- Attraction listings: 30-minute TTL
- Attraction reviews: 15-minute TTL

**Benefits**:

- Reduces redundant API calls within the same session
- Improves user experience with instant results for repeated searches
- Extends free API quota significantly
- Automatically invalidates stale data based on TTL

### 3. State Management

Zustand stores with optional persistence:

**Location**: `store/` directory

- **flightStore.ts**: Manages flight search parameters, results, and UI state
- **hotel-store.ts**: Manages hotel search filters, results, and selections
- **attractionStore.ts**: Manages attraction searches, filters, and reviews
- **itineraryStore.ts**: Manages trip creation, item additions, and localStorage persistence

**Itinerary Persistence**:

- Trip data persists across browser sessions via localStorage
- Selective serialization excludes large photo arrays to minimize storage
- Maintains trip structure with flights, hotels, and activities

### 4. Responsive Navigation

**Sidebar Behavior** (`components/Sidebar.tsx`):

- Always visible on desktop (lg breakpoint and above)
- Collapsible hamburger menu on mobile and tablets
- Smooth Framer Motion animations for menu transitions
- Mobile-first design approach

**Navbar Features** (`components/Navbar.tsx`):

- Sticky positioning with z-index management
- Responsive search bar (hidden on small screens)
- Mobile menu with grid layout for navigation items
- User profile section with notifications

### 5. Professional Error Handling

All service files implement consistent error management:

**Pattern** (see `services/` files):

- HTTP status codes included in error messages
- Service-specific context tags: `[Flight Search]`, `[Hotel Details]`, etc.
- User-friendly error messages through Error constructor
- Response body snippets (first 100 chars) for debugging
- Graceful fallback to mock data when real API fails

### 6. Global Design System

Centralized color and spacing tokens:

**Location**: `app/globals.css`

- CSS custom properties for all colors
- Tailwind theme configuration mapping to CSS variables
- Maintains consistency across all components
- Easy color updates without touching component code
- Supports light/dark mode (extensible)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- RapidAPI account with Booking.com API access (for production use)
- Basic knowledge of React, Next.js, and Tailwind CSS

### Local Installation

1. **Clone the repository**

   ```bash
   cd my-booking-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

4. **Update `.env.local`**

   ```
   NEXT_PUBLIC_RAPIDAPI_KEY=your_api_key_here
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

5. **Run development server**

   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Configuration

**For Testing with Mock Data** (Default):

- Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
- No API key needed
- Unlimited test requests
- Full feature testing with realistic data

**For Production Use**:

1. Get a free RapidAPI account at https://rapidapi.com
2. Subscribe to Booking.com API: https://rapidapi.com/DataCrawler/api/booking-com15/
3. Copy your API key
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_RAPIDAPI_KEY=your_actual_api_key
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```
5. Be aware of rate limits - monitor your usage on RapidAPI dashboard

**Important Note**: The free tier of Booking.com API has strict rate limiting. If you plan to do extensive testing with the real API, you may run out of free requests. Using the mock data mode is recommended for development.

## 📊 Data Flow

### Flight Search Flow

1. User enters departure/arrival airports in FlightsPage (`pages/FlightsPage.tsx`)
2. Search triggers `searchDestination()` from `services/flightServices.ts`
3. Results cached in flightDestinationCache with 5-minute TTL
4. User selects airports and date, clicks search
5. `searchFlights()` is called, results stored in flightStore
6. Local sorting (BEST, CHEAPEST, FASTEST) without additional API calls
7. User selects flight and adds to itinerary via `FlightCard` component

### Hotel Search Flow

1. User enters destination in HotelPage (`pages/HotelPage.tsx`)
2. `searchDestination()` autocompletes locations from hotelDestinationCache
3. User sets check-in/checkout dates and guest configuration
4. `searchHotels()` retrieves results with filters from `services/hotel-service.ts`
5. Hotel filters and sort options fetched from `getHotelFilters()` and `getHotelSortOptions()`
6. User filters/sorts results
7. Clicks hotel card to view details via `HotelDetailsModal`
8. Adds to itinerary with `addHotel()` action

### Attraction Search Flow

1. User navigates to activities page (`app/activities/page.tsx`)
2. AttractionsPage (`pages/AttractionsPage.tsx`) handles location search
3. `searchAttractionLocation()` finds locations via `services/attractionService.ts`
4. `searchAttractions()` retrieves available activities
5. `getAvailabilityCalendar()` and `getAvailability()` fetch time slots
6. User selects date and time
7. Adds to itinerary via `addActivity()` action

### Itinerary Management

1. User creates trip on landing page (`app/page.tsx`)
2. `createTrip()` initializes trip in itineraryStore with persistence
3. Items added from search pages automatically appear in itinerary sections
4. Each section (`FlightItinerarySection`, `HotelItinerarySection`, `AttractionsItinerarySection`) displays booked items
5. Users can remove items or delete entire trip
6. Trip data persists via localStorage middleware

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create Types**: Define data structures in `types/` directory
2. **Create Service**: Add API wrapper in `services/` with mock data option
3. **Create Store**: Add Zustand store in `store/` for state management
4. **Create Components**: Build UI components in `components/`
5. **Add Page**: Create search/display page in `pages/` or `app/` directory
6. **Test**: Use mock data mode for unlimited testing

### Code Quality Standards

- **Comments**: Minimal, meaningful comments only - code should be self-documenting
- **Error Handling**: Professional error messages with service context tags
- **Styling**: Use Tailwind classes with global CSS variables (no hardcoded colors)
- **Types**: Strict TypeScript - avoid `any` types where possible
- **Performance**: Implement caching for frequently accessed data

## 📈 Long-Term Roadmap

### Current Implementation

- ✅ Flight search and booking
- ✅ Hotel search and booking
- ✅ Attraction search and booking
- ✅ Trip itinerary management
- ✅ Mock data system for development
- ✅ Responsive mobile-first design
- ✅ Professional error handling

### Planned Enhancements

**Phase 1: Core Features**

- Payment integration (Stripe/PayPal)
- User authentication (OAuth/Email)
- Trip sharing functionality
- Calendar-based itinerary view
- Offline mode with service workers

**Phase 2: Advanced Features**

- AI-powered trip recommendations
- Budget tracking and alerts
- Collaborative trip planning
- Travel insurance integration
- Real-time price notifications

**Phase 3: Optimization**

- Server-side rendering (SSR) for search pages
- API endpoint caching at server level
- Performance monitoring and analytics
- A/B testing framework
- Progressive Web App (PWA) support

**Phase 4: Scaling**

- Database integration (PostgreSQL/MongoDB)
- User profile and preferences storage
- Trip history and analytics
- Admin dashboard for monitoring
- Multi-language support (i18n)

## 🔐 Security & Rate Limiting

### Current Strategy

- Environment variables for sensitive API keys
- Client-side validation for user inputs
- TTL caching to reduce API pressure
- Mock data as fallback when API limits exceeded
- Error messages don't expose sensitive information

### For Production Deployment

- Move API calls to backend routes (server-to-server)
- Implement API key management securely
- Add request throttling and rate limiting
- Set up monitoring for API quota usage
- Implement user authentication for access control
- Add CORS policies
- Use API gateway for routing and logging

## 🐛 Troubleshooting

### Issue: "API key invalid" or request failures

**Solution**:

- Verify your RapidAPI key is copied correctly
- Check that Booking.com API is still active on your account
- Confirm `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
- Check RapidAPI dashboard for usage limits

### Issue: Search returns no results

**Solution**:

- Ensure you're using a real destination (e.g., "New York", "Tokyo")
- Check that dates are in the future
- Try with mock data first to test UI
- Wait a few minutes if you've hit rate limits

### Issue: App crashes or styling breaks

**Solution**:

- Run `pnpm install` to ensure dependencies are correct
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `pnpm dev`
- Check console for specific errors

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Booking.com API Docs](https://rapidapi.com/DataCrawler/api/booking-com15/endpoints)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is part of an assessment task and is available for educational purposes.

## 🤝 Contributing

This is an assessment project. For feature requests or improvements, please document them in your project notes.


**Note**: Remember to generate your own API keys from RapidAPI for production use. The mock data system is designed for development and testing without API quota concerns.
