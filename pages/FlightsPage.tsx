"use client";

import React, { useState, useEffect } from "react";
import {
  useFlightStore,
  flightDestinationCache,
  flightSearchCache,
  buildFlightCacheKey,
} from "@/store/flightStore";
import {
  searchDestination,
  searchFlights,
  getMinPrice,
} from "@/services/flightServices";
import { FlightCard } from "@/components/FlightCard";
import type {
  Destination,
  DestinationSearchResponse,
  FlightSearchServiceResponse,
  MinPriceResponse,
} from "@/types/flight-api-types";

export const FlightSearchPage: React.FC = () => {
  const {
    searchParams,
    setSearchParams,
    flights,
    setFlights,
    isSearching,
    setIsSearching,
    error,
    setError,
    setSelectedFlight,
    minPrice,
    setMinPrice,
  } = useFlightStore();

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromDestinations, setFromDestinations] = useState<Destination[]>([]);
  const [toDestinations, setToDestinations] = useState<Destination[]>([]);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(
    "round-trip",
  );
  const [currentSort, setCurrentSort] = useState<
    "BEST" | "CHEAPEST" | "FASTEST"
  >("BEST");

  // Parse duration string
  const parseDurationToMinutes = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    return hours * 60 + minutes;
  };

  // Sort flights locally (no API call)
  const sortFlights = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flightsToSort: any[],
    sortType: "BEST" | "CHEAPEST" | "FASTEST",
  ) => {
    const sorted = [...flightsToSort];

    switch (sortType) {
      case "CHEAPEST":
        return sorted.sort((a, b) => {
          const priceA = a.price?.amount || 0;
          const priceB = b.price?.amount || 0;
          return priceA - priceB;
        });

      case "FASTEST":
        return sorted.sort((a, b) => {
          const durationA = parseDurationToMinutes(a.totalDuration || "0h 0m");
          const durationB = parseDurationToMinutes(b.totalDuration || "0h 0m");
          return durationA - durationB;
        });

      case "BEST":
      default:
        return sorted.sort((a, b) => {
          const priceA = a.price?.amount || 0;
          const priceB = b.price?.amount || 0;
          const durationA = parseDurationToMinutes(a.totalDuration || "0h 0m");
          const durationB = parseDurationToMinutes(b.totalDuration || "0h 0m");

          const scoreA = priceA / 100 + durationA / 60;
          const scoreB = priceB / 100 + durationB / 60;

          return scoreA - scoreB;
        });
    }
  };

  // Handle sort button click
  const handleSortChange = (sortType: "BEST" | "CHEAPEST" | "FASTEST") => {
    console.log(`🔄 Sorting: ${sortType}`);

    setCurrentSort(sortType);
    setSearchParams({ sort: sortType });

    // Sort the existing flights array locally (NO API CALL)
    const sortedFlights = sortFlights(flights, sortType);
    setFlights(sortedFlights);

    console.log(`✅ Sorted ${sortedFlights.length} flights locally`);
  };

  // Destination search with 800ms debounce + cache
  useEffect(() => {
    if (fromQuery.length < 3) return;

    const timer = setTimeout(async () => {
      const cached = flightDestinationCache.get(fromQuery.toLowerCase());
      if (cached) {
        console.log("✈️ [FROM] cache hit for", fromQuery);
        setFromDestinations(cached as Destination[]);
        return;
      }

      try {
        const results: DestinationSearchResponse =
          await searchDestination(fromQuery);
        const data = results.data || [];
        flightDestinationCache.set(fromQuery.toLowerCase(), data);
        setFromDestinations(data);
      } catch (err) {
        console.error("Error searching from destinations:", err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [fromQuery]);

  useEffect(() => {
    if (toQuery.length < 3) return;

    const timer = setTimeout(async () => {
      const cached = flightDestinationCache.get(toQuery.toLowerCase());
      if (cached) {
        console.log("✈️ [TO] cache hit for", toQuery);
        setToDestinations(cached as Destination[]);
        return;
      }

      try {
        const results: DestinationSearchResponse =
          await searchDestination(toQuery);
        const data = results.data || [];
        flightDestinationCache.set(toQuery.toLowerCase(), data);
        setToDestinations(data);
      } catch (err) {
        console.error("Error searching to destinations:", err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [toQuery]);

  // Handlers
  const handleFromSelect = (destination: Destination) => {
    setSearchParams({ fromId: destination.id });
    setFromQuery(destination.name);
    setShowFromDropdown(false);
  };

  const handleToSelect = (destination: Destination) => {
    setSearchParams({ toId: destination.id });
    setToQuery(destination.name);
    setShowToDropdown(false);
  };

  const handleSearch = async () => {
    if (
      !searchParams.fromId ||
      !searchParams.toId ||
      !searchParams.departDate
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (tripType === "round-trip" && !searchParams.returnDate) {
      setError("Please select a return date for round-trip");
      return;
    }

    // Check cache first
    const cacheKey = buildFlightCacheKey({
      ...searchParams,
      returnDate:
        tripType === "round-trip" ? searchParams.returnDate : undefined,
    });
    const cachedFlights = flightSearchCache.get(cacheKey);

    if (cachedFlights) {
      console.log("✈️ [SEARCH] cache hit –", cachedFlights.length, "flights");

      // Apply current sort to cached flights
      const sortedCachedFlights = sortFlights(cachedFlights, currentSort);
      setFlights(sortedCachedFlights);
      return;
    }

    // Cache miss - call API
    setIsSearching(true);
    setError(null);

    try {
      const requestParams = {
        fromId: searchParams.fromId,
        toId: searchParams.toId,
        departDate: searchParams.departDate,
        returnDate:
          tripType === "round-trip" ? searchParams.returnDate : undefined,
        adults: searchParams.adults,
        children: `${searchParams.children},17`,
        stops: searchParams.stops,
        cabinClass: searchParams.cabinClass,
        sort: searchParams.sort,
        currency_code: searchParams.currency,
      };

      console.log("🔍 Searching flights with params:", requestParams);

      const results = (await searchFlights(
        requestParams,
      )) as FlightSearchServiceResponse;

      console.log("📡 Raw API Response:", results);

      if (!results.data) {
        setError("No data returned from API.");
        setFlights([]);
        return;
      }
      if (!results.data.flights) {
        setError("No flights array in response.");
        setFlights([]);
        return;
      }
      if (results.data.flights.length === 0) {
        setError("No flights found. Try different dates or destinations.");
        setFlights([]);
        return;
      }

      const transformedFlights = results.data.flights;

      console.log("✅ Transformed flights:", transformedFlights.length);

      const sortedFlights = sortFlights(transformedFlights, currentSort);

      flightSearchCache.set(cacheKey, transformedFlights);
      setFlights(sortedFlights);

      // Fetch min price (non-blocking)
      try {
        const minPriceResult: MinPriceResponse = await getMinPrice({
          fromId: searchParams.fromId,
          toId: searchParams.toId,
          departDate: searchParams.departDate,
          returnDate:
            tripType === "round-trip" ? searchParams.returnDate : undefined,
          cabinClass: searchParams.cabinClass,
          currency_code: searchParams.currency,
        });
        if (minPriceResult.data) {
          setMinPrice({
            amount: minPriceResult.data.price || 0,
            currency: searchParams.currency,
          });
        }
      } catch (err) {
        console.error("Error fetching min price:", err);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search flights";
      console.error("❌ Search error:", err);
      setError(errorMessage);
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-set return date 7 days after departure
  useEffect(() => {
    if (
      tripType === "round-trip" &&
      searchParams.departDate &&
      !searchParams.returnDate
    ) {
      const d = new Date(searchParams.departDate);
      d.setDate(d.getDate() + 7);
      setSearchParams({ returnDate: d.toISOString().split("T")[0] });
    }
  }, [
    tripType,
    searchParams.departDate,
    searchParams.returnDate,
    setSearchParams,
  ]);

  // Render
  return (
    <div className="min-h-screen bg-background-neutral">
      {/* Hero Section */}
      <div className="bg-blue-light text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
              </svg>
              <span className="text-xs font-medium">Find the Best Deals</span>
            </div>

            <h1 className="text-4xl font-bold mb-3 text-white">
              Find Your Perfect Flight
            </h1>
            <p className="text-sm text-white mb-6">
              Search and compare flights from top airlines at the best prices
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Trip Type Selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setTripType("round-trip")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                tripType === "round-trip"
                  ? "bg-blue-light text-white"
                  : "bg-background-neutral text-gray-dark hover:bg-gray-200"
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setTripType("one-way")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                tripType === "one-way"
                  ? "bg-blue-light text-white"
                  : "bg-background-neutral text-gray-dark hover:bg-gray-200"
              }`}
            >
              One Way
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                  placeholder="City or airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>

              {showFromDropdown && fromDestinations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {fromDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleFromSelect(dest)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{dest.name}</p>
                      <p className="text-sm text-gray-500">
                        {dest.code || dest.type} • ID: {dest.id}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setShowToDropdown(true);
                  }}
                  onFocus={() => setShowToDropdown(true)}
                  placeholder="City or airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>

              {showToDropdown && toDestinations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {toDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleToSelect(dest)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{dest.name}</p>
                      <p className="text-sm text-gray-500">
                        {dest.code || dest.type} • ID: {dest.id}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Depart Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depart
              </label>
              <input
                type="date"
                value={searchParams.departDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setSearchParams({ departDate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              />
            </div>

            {/* Return Date */}
            {tripType === "round-trip" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return
                </label>
                <input
                  type="date"
                  value={searchParams.returnDate}
                  min={
                    searchParams.departDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setSearchParams({ returnDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Children
              </label>
              <select
                value={searchParams.children}
                onChange={(e) =>
                  setSearchParams({ children: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Child" : "Children"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={searchParams.cabinClass}
                onChange={(e) =>
                  setSearchParams({
                    cabinClass: e.target.value as
                      | "ECONOMY"
                      | "PREMIUM_ECONOMY"
                      | "BUSINESS"
                      | "FIRST",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stops
              </label>
              <select
                value={searchParams.stops}
                onChange={(e) =>
                  setSearchParams({
                    stops: e.target.value as "none" | "0" | "1" | "2",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
              >
                <option value="0">Any Stops</option>
                <option value="1">1 Stop</option>
                <option value="2">2 Stops</option>
                <option value="none">Non-stop</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-4 bg-blue-light text-white font-semibold rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "Searching..." : "Search Flights"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {flights.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {flights.length} Flight{flights.length > 1 ? "s" : ""} Found
              </h2>
              {minPrice && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-blue-600">
                    {minPrice.currency} {minPrice.amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-6">
              {(["BEST", "CHEAPEST", "FASTEST"] as const).map((sortType) => (
                <button
                  key={sortType}
                  onClick={() => handleSortChange(sortType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentSort === sortType
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {sortType.charAt(0) + sortType.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onSelect={setSelectedFlight}
                />
              ))}
            </div>
          </>
        )}

        {!isSearching && flights.length === 0 && !error && (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No flights yet
            </h3>
            <p className="text-gray-500">
              Start by searching for flights above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;
