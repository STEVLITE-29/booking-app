"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Filter,
  ChevronDown,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAttractionStore } from "../store/attractionStore";
import * as attractionService from "../services/attractionService";
import {
  AttractionLocation,
  mockAttractionLocations,
} from "../services/attractionService";
import AttractionCard from "@/components/attractions/AttractionCard";

const AttractionsPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchLocations,
    setSearchLocations,
    selectedLocation,
    setSelectedLocation,
    attractions,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    isSearchingLocations,
    setIsSearchingLocations,
    isLoadingAttractions,
    setIsLoadingAttractions,
    setAttractions,
    error,
    setError,
    currencyCode,
  } = useAttractionStore();

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const lastSearchTime = useRef<number>(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchCacheRef = useRef<Map<string, any>>(new Map());

  const loadAttractions = useCallback(async () => {
    if (!selectedLocation?.id) return;

    setIsLoadingAttractions(true);
    setError(null);

    try {
      const response = await attractionService.searchAttractions(
        selectedLocation.id,
        sortBy,
        currentPage,
        currencyCode,
      );

      setAttractions(response.data.products);
    } catch (err) {
      console.error("Error loading attractions:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load attractions";

      if (errorMessage.includes("429")) {
        setError("Rate limit exceeded. Please wait a moment and try again.");
      } else if (errorMessage.includes("403")) {
        setError("API access error. Please check your API key.");
      } else {
        setError("Failed to load attractions. Please try again.");
      }
    } finally {
      setIsLoadingAttractions(false);
    }
  }, [
    selectedLocation?.id,
    sortBy,
    currentPage,
    currencyCode,
    setIsLoadingAttractions,
    setError,
    setAttractions,
  ]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchError(null);

    if (searchQuery.length >= 3) {
      // Check cache first
      if (searchCacheRef.current.has(searchQuery)) {
        const cachedData = searchCacheRef.current.get(searchQuery);
        setSearchLocations([
          ...cachedData.destinations,
          ...cachedData.products,
        ]);
        setShowLocationDropdown(true);
        return;
      }

      searchTimeoutRef.current = setTimeout(async () => {
        const now = Date.now();
        const timeSinceLastSearch = now - lastSearchTime.current;

        if (timeSinceLastSearch < 1000) {
          searchTimeoutRef.current = setTimeout(async () => {
            await performSearch();
          }, 1000 - timeSinceLastSearch);
          return;
        }

        await performSearch();
      }, 800);
    } else {
      setSearchLocations([]);
      setShowLocationDropdown(false);
    }

    async function performSearch() {
      setIsSearchingLocations(true);
      setSearchError(null);

      try {
        lastSearchTime.current = Date.now();
        const response =
          await attractionService.searchAttractionLocation(searchQuery);

        // Cache the result
        searchCacheRef.current.set(searchQuery, response.data);

        setSearchLocations([
          ...response.data.destinations,
          ...response.data.products,
        ]);
        setShowLocationDropdown(true);
      } catch (err) {
        console.error("Error searching locations:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";

        if (errorMessage.includes("429")) {
          setSearchError(
            "Too many searches. Please wait a moment before trying again.",
          );
        } else if (errorMessage.includes("403")) {
          setSearchError("API access error. Please check your connection.");
        } else {
          setSearchError("Search failed. Please try again.");
        }

        setSearchLocations([]);
        setShowLocationDropdown(false);
      } finally {
        setIsSearchingLocations(false);
      }
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, setIsSearchingLocations, setSearchLocations]);

  useEffect(() => {
    if (selectedLocation?.id) {
      loadAttractions();
    }
  }, [selectedLocation, loadAttractions]);

  const handleLocationSelect = (location: AttractionLocation) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    setCurrentPage(1);
    setSearchError(null);
  };

  const handleQuickSearch = (location: AttractionLocation) => {
    setSearchQuery(location.cityName || location.title || "");
    setSelectedLocation(location);
    setCurrentPage(1);
    setSearchError(null);
  };

  const applyFilters = () => {
    let filtered = [...attractions];

    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      filtered = filtered.filter(
        (a) =>
          a.representativePrice.chargeAmount >= priceRange[0] &&
          a.representativePrice.chargeAmount <= priceRange[1],
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(
        (a) =>
          a.reviewsStats &&
          a.reviewsStats.combinedNumericStats.average >= minRating,
      );
    }

    if (freeCancellationOnly) {
      filtered = filtered.filter(
        (a) => a.cancellationPolicy.hasFreeCancellation,
      );
    }

    return filtered;
  };

  const displayedAttractions = applyFilters();

  const handleManualSearch = () => {
    if (selectedLocation) {
      loadAttractions();
    }
  };

  return (
    <div className="min-h-screen rounded-sm overflow-hidden bg-background-neutral">
      {/* Hero Section */}
      <div className="bg-blue-light text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">
                Discover Amazing Experiences
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-3 text-white">
              Explore Activities & Attractions
            </h1>
            <p className="text-sm text-white mb-6">
              Find unforgettable experiences, tours, and attractions at your
              destination
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="flex items-center gap-3 bg-white rounded-lg p-1.5 shadow-sm">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-light w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for a destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm text-gray-dark placeholder-gray-light focus:outline-none rounded-lg"
                  />
                </div>
                <button
                  className="bg-blue-light text-white px-6 py-3 rounded-lg text-xs font-medium shadow-sm hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleManualSearch}
                  disabled={!selectedLocation}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {/* Search Error Message */}
              {searchError && (
                <div className="mt-2 bg-error-background border border-error-foreground/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-error-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-error-foreground font-medium">
                      {searchError}
                    </p>
                    <p className="text-xs text-error-foreground/80 mt-1">
                      Tip: Try selecting from popular destinations below.
                    </p>
                  </div>
                </div>
              )}

              {/* Location Dropdown */}
              {showLocationDropdown && searchLocations.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto border border-gray-200">
                  {isSearchingLocations ? (
                    <div className="p-6 text-center text-gray-light">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-light mx-auto"></div>
                      <p className="mt-2 text-xs">Searching...</p>
                    </div>
                  ) : (
                    <>
                      {searchLocations.some((loc) => loc.ufi !== undefined) && (
                        <div>
                          <div className="px-4 py-2 bg-background-neutral border-b">
                            <p className="text-xs font-semibold text-gray-light uppercase">
                              Destinations
                            </p>
                          </div>
                          {searchLocations
                            .filter((loc) => loc.ufi !== undefined)
                            .map((location) => (
                              <button
                                key={location.id}
                                onClick={() => handleLocationSelect(location)}
                                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b last:border-0"
                              >
                                <MapPin className="w-4 h-4 text-blue-light shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-dark">
                                    {location.cityName}
                                  </p>
                                  <p className="text-xs text-gray-light">
                                    {location.country} • {location.productCount}{" "}
                                    activities
                                  </p>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}

                      {searchLocations.some(
                        (loc) => loc.productId !== undefined,
                      ) && (
                        <div>
                          <div className="px-4 py-2 bg-background-neutral border-b">
                            <p className="text-xs font-semibold text-gray-light uppercase">
                              Popular Activities
                            </p>
                          </div>
                          {searchLocations
                            .filter((loc) => loc.productId !== undefined)
                            .slice(0, 5)
                            .map((location) => (
                              <button
                                key={location.id}
                                onClick={() => handleLocationSelect(location)}
                                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b last:border-0"
                              >
                                <Sparkles className="w-4 h-4 text-blue-light shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-dark">
                                    {location.title}
                                  </p>
                                  <p className="text-xs text-gray-light">
                                    {location.cityName}
                                  </p>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Quick Search Buttons - Using Mock Data */}
              {!selectedLocation && !isSearchingLocations && (
                <div className="mt-4">
                  <p className="text-white/70 text-xs mb-2">
                    Popular Destinations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mockAttractionLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleQuickSearch(location)}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                      >
                        <MapPin className="w-3 h-3" />
                        {location.cityName}
                        <span className="text-white/60">
                          • {location.country}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedLocation && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">
                  Showing activities in{" "}
                  <strong>
                    {selectedLocation.cityName || selectedLocation.title}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {selectedLocation && (
          <>
            {/* Filters and Sorting */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-200"
                >
                  <Filter className="w-4 h-4 text-gray-dark" />
                  <span className="font-medium text-xs text-gray-dark">
                    Filters
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-light transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="text-xs text-gray-light">
                  <span className="font-semibold text-gray-dark">
                    {displayedAttractions.length}
                  </span>{" "}
                  activities found
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-light">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "trending"
                        | "attr_book_score"
                        | "lowest_price",
                    )
                  }
                  className="px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-light focus:outline-none font-medium text-xs text-gray-dark"
                >
                  <option value="trending">Most Popular</option>
                  <option value="attr_book_score">Highest Rated</option>
                  <option value="lowest_price">Lowest Price</option>
                </select>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mb-6 bg-white rounded-lg shadow-sm p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-dark mb-2">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full accent-blue-light"
                      />
                      <div className="flex justify-between text-xs text-gray-light">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-dark mb-2">
                      Minimum Rating
                    </label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            minRating === rating
                              ? "bg-blue-light text-white shadow-sm"
                              : "bg-background-neutral text-gray-dark hover:bg-gray-200"
                          }`}
                        >
                          {rating === 0 ? "Any" : `${rating}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Free Cancellation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-dark mb-2">
                      Booking Options
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeCancellationOnly}
                        onChange={(e) =>
                          setFreeCancellationOnly(e.target.checked)
                        }
                        className="w-4 h-4 text-blue-light rounded focus:ring-blue-light accent-blue-light"
                      />
                      <span className="text-xs text-gray-dark">
                        Free cancellation only
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      setMinRating(0);
                      setFreeCancellationOnly(false);
                    }}
                    className="px-4 py-2 bg-background-neutral text-gray-dark rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-error-background border border-error-foreground/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-error-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-error-foreground">
                      {error}
                    </p>
                    <button
                      onClick={() => {
                        setError(null);
                        loadAttractions();
                      }}
                      className="mt-2 text-xs text-error-foreground hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingAttractions && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-light mb-3"></div>
                <p className="text-gray-light text-sm">
                  Finding amazing activities...
                </p>
              </div>
            )}

            {/* Attractions Grid */}
            {!isLoadingAttractions && displayedAttractions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoadingAttractions &&
              displayedAttractions.length === 0 &&
              attractions.length > 0 && (
                <div className="text-center py-16">
                  <div className="inline-block p-6 bg-accent rounded-full mb-4">
                    <Search className="w-12 h-12 text-blue-light" />
                  </div>
                  <h3 className="text-lg font-bold text-black-secondary mb-2">
                    No activities match your filters
                  </h3>
                  <p className="text-sm text-gray-light mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 10000]);
                      setMinRating(0);
                      setFreeCancellationOnly(false);
                    }}
                    className="bg-blue-light text-white px-6 py-2.5 rounded-lg text-xs font-medium shadow-sm hover:bg-blue-dark transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

            {/* Empty State */}
            {!isLoadingAttractions && attractions.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-6 bg-accent rounded-full mb-4">
                  <Sparkles className="w-12 h-12 text-blue-light" />
                </div>
                <h3 className="text-lg font-bold text-black-secondary mb-2">
                  No activities found
                </h3>
                <p className="text-sm text-gray-light">
                  Try searching for a different location
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!selectedLocation && !isLoadingAttractions && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white rounded-full shadow-sm mb-4">
              <MapPin className="w-16 h-16 text-blue-light" />
            </div>
            <h2 className="text-2xl font-bold text-black-secondary mb-2">
              Start Your Adventure
            </h2>
            <p className="text-sm text-gray-light mb-6">
              Search for a destination above or select from popular destinations
            </p>

            {/* Quick Search Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {mockAttractionLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleQuickSearch(location)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <MapPin className="w-8 h-8 text-blue-light mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-sm text-gray-dark">
                    {location.cityName}
                  </p>
                  <p className="text-xs text-gray-light mt-1">
                    {location.country}
                  </p>
                  <p className="text-xs text-blue-light mt-2 font-medium">
                    {location.productCount} activities
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionsPage;
