"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Loader } from "lucide-react";
import metaService from "@/services/metaService";

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  onLocationSelected?: (lat: number, lon: number) => void;
  placeholder?: string;
}

interface LocationResult {
  name: string;
  latitude?: number;
  longitude?: number;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onLocationSelected,
  placeholder = "Search for a destination...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearch = async (query: string) => {
    onChange(query);
    setError("");

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Set new debounce timer (800ms)
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);

      try {
        const response = await metaService.locationToLatLong(query);

        if (response.data && Array.isArray(response.data)) {
          const formattedResults = response.data
            .slice(0, 5)
            .map((location: LocationResult) => ({
              name: location.name || query,
              latitude: location.latitude,
              longitude: location.longitude,
            }));
          setResults(formattedResults);
        } else {
          setError("No locations found");
          setResults([]);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to search locations";
        setError(errorMsg);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSelectLocation = (location: LocationResult) => {
    onChange(location.name);
    if (location.latitude !== undefined && location.longitude !== undefined) {
      onLocationSelected?.(location.latitude, location.longitude);
    }
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => value && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
        />
        {isLoading && (
          <Loader className="absolute right-3 top-3 w-5 h-5 text-blue-light animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-600 text-sm">{error}</div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="max-h-64 overflow-y-auto">
              {results.map((result, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSelectLocation(result)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {result.name}
                        </p>
                        {result.latitude !== undefined &&
                        result.longitude !== undefined ? (
                          <p className="text-xs text-gray-500">
                            {result.latitude.toFixed(2)}°,{" "}
                            {result.longitude.toFixed(2)}°
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">Location</p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && results.length === 0 && !error && value && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
