# Travel Go - My Booking App Journey

A travel itinerary platform I built that lets users search and book flights, hotels, and activities all in one place.

## What I Built

This is a full-stack travel booking app where you can:
- Search for flights with filters for price, stops, and cabin class
- Find hotels with detailed amenities and ratings
- Discover local attractions and activities
- Create trip itineraries and manage everything in one dashboard
- Switch between mock data and real API seamlessly

## Tech Stack

I built this with:
- **Next.js 16** & **React 19** - For the app framework
- **TypeScript** - Because type safety matters
- **Tailwind CSS** - For styling (with custom design tokens)
- **Zustand** - State management with localStorage persistence
- **Framer Motion** - Smooth animations
- **RapidAPI Booking.com** - Real travel data

## The Challenge I Faced

Here's the thing - when I started building this, I quickly ran into a major problem: **the Booking.com API has strict rate limits**. The free tier gives you very limited requests, and I was burning through them just testing basic features.

Every time I wanted to test a search, check if filters worked, or debug an issue, I'd make 5-10 API calls. Within a day of development, I'd hit my monthly limit. This was unsustainable.

## My Solution: Dual API Mode

I implemented a smart toggle system that saved my development process:

```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true  # Development mode
NEXT_PUBLIC_USE_MOCK_DATA=false # Production mode
```

**How it works:**
- I created realistic mock data that mirrors the exact API response structure
- All my service files (`flightServices.ts`, `hotel-service.ts`, `attractionService.ts`) check this flag
- When true: instant responses from mock data, unlimited testing
- When false: real API calls to Booking.com

This meant I could:
- Test features unlimited times without worrying about quotas
- Develop faster with instant responses
- Save real API calls for production testing
- Show a working demo even if API limits are reached

The mock data lives in `/data` and includes flights, hotels, and attractions with realistic pricing, availability, and details.

## Project Structure

```
my-booking-app/
├── app/                    # Next.js pages (flights, hotels, activities)
├── components/             # React components (cards, modals, forms)
├── services/              # API wrappers with mock/real toggle
├── store/                 # Zustand state management
├── data/                  # Mock data for development
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions and cache
```

## Key Features I'm Proud Of

### 1. Smart Caching
I implemented TTL (Time To Live) caching to minimize API calls:
- Flight searches cached for 5 minutes
- Hotel searches cached for 15 minutes
- Attraction listings cached for 30 minutes

This dramatically reduced redundant API calls and made the app feel snappy.

### 2. Persistent Itineraries
Trip data automatically saves to localStorage, so users don't lose their plans when they close the browser. I built this with Zustand's persistence middleware.

### 3. Responsive Everything
The app works seamlessly on mobile, tablet, and desktop. The sidebar collapses into a hamburger menu on smaller screens with smooth animations.

### 4. Professional Error Handling
Every API call has proper error handling with user-friendly messages. If the real API fails, the app gracefully falls back to mock data so the demo always works.

## Getting Started

1. **Clone and install**
   ```bash
   cd my-booking-app
   pnpm install
   ```

2. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   ```

3. **For development (recommended)**
   ```
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```
   No API key needed - unlimited testing!

4. **For production**
   ```
   NEXT_PUBLIC_RAPIDAPI_KEY=your_key_here
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```
   Get your free key at [RapidAPI](https://rapidapi.com/DataCrawler/api/booking-com15/)

5. **Run it**
   ```bash
   pnpm dev
   ```

## How It Works

**Flight Search:**
1. Type in airports (autocomplete kicks in after 3 characters)
2. Results are cached for 5 minutes
3. Select dates and search
4. Sort by best, cheapest, or fastest
5. Add to your trip itinerary

**Hotel Search:**
1. Enter destination
2. Set check-in/out dates
3. Filter by price, rating, amenities
4. View detailed modal with photos
5. Add to itinerary

**Activities:**
1. Search location
2. Browse available attractions
3. Check availability calendar
4. Select time slot
5. Book it

Everything syncs to your trip itinerary in real-time.

## What I Learned

- **API rate limiting is real** - Always have a backup plan
- **Caching is crucial** - Save those API calls
- **Mock data done right** - Match real API structure exactly
- **TypeScript saves time** - Catch errors before they happen
- **State management matters** - Zustand made everything cleaner

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| API rate limits killing development | Built comprehensive mock data system |
| Repeated searches wasting quota | Implemented TTL caching |
| State getting messy | Used Zustand with clean separation |
| Mobile navigation cramped | Collapsible sidebar with animations |
| Prices in different formats | Created utility functions for formatting |

## What's Next

If I had more time, I'd add:
- User authentication
- Payment integration
- AI trip recommendations
- Collaborative trip planning
- Real-time price alerts
- Mobile app (React Native)

## Important Notes

⚠️ **Always start with mock data mode** - The free API tier has strict limits

💡 **The mock data is production-quality** - It's not just placeholder text, it's realistic travel data

🚀 **Cache is your friend** - The app remembers searches for a few minutes to save API calls

## Running Into Issues?

**"API key invalid"**
- Check your RapidAPI key is correct
- Make sure you've subscribed to the Booking.com API
- Try mock data mode first

**"No results found"**
- Use real destinations like "New York" or "London"
- Make sure dates are in the future
- Check if you've hit rate limits (switch to mock mode)

**App won't start**
- Run `pnpm install` again
- Delete `.next` folder and restart
- Check console for errors

## Final Thoughts

This project taught me how to build around real-world constraints (API limits), implement smart caching strategies, and create a seamless user experience. The dual API mode was a game-changer that let me develop at full speed while preserving API quota for when it mattered.

---

Built with ☕ and a lot of Stack Overflow tab