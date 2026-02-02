"use client";

import React, { useState, useEffect } from "react";
import {
  useHotelStore,
  hotelDestinationCache,
  hotelSearchCache,
  buildHotelCacheKey,
} from "@/store/hotel-store";
import {
  searchHotelDestination,
  searchHotels,
  getHotelFilters,
  getHotelSortOptions,
} from "@/services/hotel-service";
import { HotelCard } from "@/components/HotelCard";
import type {
  HotelDestination,
  HotelDestinationResponse,
  HotelSearchResponse,
} from "@/types/hotel-types";

export const HotelSearchPage: React.FC = () => {
  const {
    searchParams,
    setSearchParams,
    hotels,
    setHotels,
    isSearching,
    setIsSearching,
    error,
    setError,
    setSelectedHotel,
    setFilters,
    setSortOptions,
  } = useHotelStore();

  const [destinationQuery, setDestinationQuery] = useState("");
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [destinations, setDestinations] = useState<HotelDestination[]>([]);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);

  // Destination search with 800ms debounce + cache
  useEffect(() => {
    if (destinationQuery.length < 3) return;

    const timer = setTimeout(async () => {
      // Check cache first
      const cached = hotelDestinationCache.get(destinationQuery.toLowerCase());
      if (cached) {
        console.log("🏨 [DEST] cache hit for", destinationQuery);
        setDestinations(cached as unknown as HotelDestination[]);
        return;
      }

      // Cache miss - fetch from API
      try {
        const results: HotelDestinationResponse =
          await searchHotelDestination(destinationQuery);
        const data = results.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hotelDestinationCache.set(destinationQuery.toLowerCase(), data as any);
        setDestinations(data);
      } catch (err) {
        console.error("Error searching destinations:", err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [destinationQuery]);

  // Handlers
  const handleDestinationSelect = (destination: HotelDestination) => {
    setSearchParams({
      dest_id: destination.dest_id,
      search_type: destination.dest_type as
        | "CITY"
        | "REGION"
        | "DISTRICT"
        | "HOTEL"
        | "LANDMARK",
    });
    setDestinationQuery(destination.label);
    setShowDestinationDropdown(false);
  };

  const handleChildrenChange = (count: number) => {
    setChildren(count);
    const ages = Array(count).fill(0);
    setChildrenAges(ages);
    updateChildrenAgeParam(ages);
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
    updateChildrenAgeParam(newAges);
  };

  const updateChildrenAgeParam = (ages: number[]) => {
    const ageString = ages.length > 0 ? ages.join(",") : "0,17";
    setSearchParams({ children_age: ageString });
  };

  const handleSearch = async () => {
    if (
      !searchParams.dest_id ||
      !searchParams.arrival_date ||
      !searchParams.departure_date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Check cache first
    const cacheKey = buildHotelCacheKey(searchParams);
    const cachedHotels = hotelSearchCache.get(cacheKey);

    if (cachedHotels) {
      console.log("🏨 [SEARCH] cache hit –", cachedHotels.length, "hotels");
      setHotels(cachedHotels);
      return;
    }

    // Cache miss - call API
    setIsSearching(true);
    setError(null);

    try {
      const results: HotelSearchResponse = await searchHotels({
        dest_id: searchParams.dest_id,
        search_type: searchParams.search_type,
        arrival_date: searchParams.arrival_date,
        departure_date: searchParams.departure_date,
        adults: searchParams.adults,
        children_age: searchParams.children_age,
        room_qty: searchParams.room_qty,
        page_number: searchParams.page_number,
        currency_code: searchParams.currency_code,
        languagecode: searchParams.languagecode,
      });

      const hotelsData = results.data?.hotels || [];
      hotelSearchCache.set(cacheKey, hotelsData);
      setHotels(hotelsData);

      // Fetch filters (non-blocking)
      try {
        const filterResults = await getHotelFilters({
          dest_id: searchParams.dest_id,
          search_type: searchParams.search_type,
          adults: searchParams.adults,
          children_age: searchParams.children_age,
          room_qty: searchParams.room_qty,
        });
        setFilters(filterResults.data?.filters || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }

      // Fetch sort options (non-blocking)
      try {
        const sortResults = await getHotelSortOptions({
          dest_id: searchParams.dest_id,
          search_type: searchParams.search_type,
          adults: searchParams.adults,
          children_age: searchParams.children_age,
          room_qty: searchParams.room_qty,
        });
        setSortOptions(sortResults.data?.sortOptions || []);
      } catch (err) {
        console.error("Error fetching sort options:", err);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search hotels";
      setError(errorMessage);
      console.error("Error searching hotels:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-background-neutral">
      {/* Hero Section */}
      <div className="bg-blue-light text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V18a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs font-medium">
                Discover Amazing Stays
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-3 text-white">
              Find Your Perfect Hotel
            </h1>
            <p className="text-sm text-white mb-6">
              Search and compare hotels from around the world at the best rates
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Destination Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setShowDestinationDropdown(true);
                }}
                onFocus={() => setShowDestinationDropdown(true)}
                placeholder="Where are you going?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {showDestinationDropdown && destinations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {destinations.map((dest) => (
                    <button
                      key={dest.dest_id}
                      onClick={() => handleDestinationSelect(dest)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors"
                    >
                      <p className="font-medium text-gray-dark">{dest.label}</p>
                      <p className="text-sm text-gray-light">
                        {dest.dest_type} • {dest.nr_hotels || 0} hotels
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dates and Guests */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={searchParams.arrival_date}
                onChange={(e) =>
                  setSearchParams({ arrival_date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={searchParams.departure_date}
                onChange={(e) =>
                  setSearchParams({ departure_date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              />
            </div>

            {/* Adults */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Adults
              </label>
              <select
                value={searchParams.adults}
                onChange={(e) =>
                  setSearchParams({ adults: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Adult{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">
                Rooms
              </label>
              <select
                value={searchParams.room_qty}
                onChange={(e) =>
                  setSearchParams({ room_qty: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Room{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Children Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Children
            </label>
            <select
              value={children}
              onChange={(e) => handleChildrenChange(parseInt(e.target.value))}
              className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Child" : "Children"}
                </option>
              ))}
            </select>

            {/* Children Ages */}
            {children > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {childrenAges.map((age, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium text-gray-dark mb-1">
                      Child {index + 1} age
                    </label>
                    <select
                      value={age}
                      onChange={(e) =>
                        handleChildAgeChange(index, parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light text-sm"
                    >
                      {Array.from({ length: 18 }, (_, i) => (
                        <option key={i} value={i}>
                          {i} {i === 1 ? "year" : "years"}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-4 bg-blue-light text-white font-semibold rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "Searching..." : "Search Hotels"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-error-background text-error-foreground rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {hotels.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {hotels.length} Hotel{hotels.length > 1 ? "s" : ""} Found
              </h2>
            </div>

            {/* Hotel Results */}
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.hotel_id}
                  hotel={hotel}
                  onSelect={setSelectedHotel}
                  checkinDate={searchParams.arrival_date}
                  checkoutDate={searchParams.departure_date}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isSearching && hotels.length === 0 && !error && (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-light mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-dark mb-2">
              No hotels yet
            </h3>
            <p className="text-gray-light">
              Start by searching for hotels above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
