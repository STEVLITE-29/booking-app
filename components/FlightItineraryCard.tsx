"use client";

import React from "react";
import { ItineraryFlight } from "@/types/itinerary-types";
import { X, Dot, PlaneLanding, PlaneTakeoff } from "lucide-react";
import Image from "next/image";
import { formatFlightPrice, getPreferredCurrency } from "@/utils/price-helpers";
import { useItineraryStore } from "@/store/itineraryStore";

interface FlightItineraryCardProps {
  flight: ItineraryFlight;
  onViewDetails?: (flight: ItineraryFlight) => void;
  onEditDetails?: (flight: ItineraryFlight) => void;
}

/**
 * Displays a booked flight with details, segments, and actions.
 * Responsive layout: stacked on mobile, horizontal on desktop.
 */
export const FlightItineraryCard: React.FC<FlightItineraryCardProps> = ({
  flight,
  onViewDetails,
  onEditDetails,
}) => {
  const { removeFlight } = useItineraryStore();
  const firstSegment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase();

    if (facilityLower.includes("baggage") || facilityLower.includes("bag")) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 3a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8zm0 2h4v1H8V5z" />
        </svg>
      );
    }

    if (
      facilityLower.includes("entertainment") ||
      facilityLower.includes("meal")
    ) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (facilityLower.includes("usb") || facilityLower.includes("port")) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7H7v6h6V7z" />
          <path
            fillRule="evenodd"
            d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  };

  return (
    <div className="relative bg-white rounded-sm hover:shadow-md transition-shadow flex flex-col md:flex-row w-full overflow-hidden">
      {/* Flight details – full width on mobile, 95% on desktop */}
      <div className="w-full md:w-[95%]">
        {/* Flight info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 px-4 sm:px-5 border-b border-gray-200">
          {/* Airline name and flight code */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Image
              src="/AirplaneTilt.svg"
              alt="plane icon"
              width={30}
              height={50}
              className="shrink-0"
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray-900 truncate">
                {firstSegment.airlineName}
              </p>
              <div className="flex gap-0.5 items-center text-gray-600 flex-wrap">
                <span className="text-sm font-semibold">
                  {firstSegment.flightNumber}
                </span>
                <Dot className="w-5 h-5 hidden sm:block" />
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded shrink-0">
                  {flight.cabinClass}
                </span>
              </div>
            </div>
          </div>

          {/* Flight route and times - stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full md:flex-1 gap-4 md:gap-0">
            {/* Departure */}
            <div className="flex flex-col items-start md:items-start">
              <p className="font-bold text-gray-900 leading-none text-2xl">
                {formatTime(firstSegment.departureTime)}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {formatDate(firstSegment.departureTime)}
              </p>
            </div>

            {/* Flight Path */}
            <div className="flex flex-col items-center flex-1 px-0 md:px-6 md:mr-4 md:ml-5 gap-2">
              {/* Top */}
              <div className="flex gap-4 md:gap-7 w-full md:w-auto justify-between md:justify-center">
                <PlaneTakeoff className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  Duration: {flight.totalDuration}
                </p>
                <PlaneLanding className="w-5 h-5 text-gray-400" />
              </div>

              {/* Middle */}
              <div className="flex items-center w-full">
                <div className="relative flex-1 mx-2 h-1 rounded-full bg-gray-200">
                  <div className="absolute left-1/2 top-1/2 h-1 w-1/3 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full" />
                </div>
              </div>

              {/* Bottom */}
              <div className="flex gap-4 md:gap-9 items-center text-gray-900 w-full md:w-auto justify-between md:justify-center">
                <p className="text-sm font-medium">
                  {firstSegment.departureAirport.code}
                </p>
                <p className="text-sm text-gray-600 whitespace-nowrap">
                  {flight.stops === 0
                    ? "Direct"
                    : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </p>
                <p className="text-sm font-medium">
                  {lastSegment.arrivalAirport.code}
                </p>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-start md:items-start">
              <p className="font-bold text-gray-900 leading-none text-2xl">
                {formatTime(lastSegment.arrivalTime)}
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {formatDate(lastSegment.arrivalTime)}
              </p>
            </div>
          </div>

          {/* Flight price */}
          <div className="w-full md:w-auto">
            <p className="text-2xl font-semibold text-gray-900">
              {formatFlightPrice(flight.price, {
                targetCurrency: getPreferredCurrency(),
              })}
            </p>
          </div>
        </div>

        {/* Facilities info */}
        <div className="flex flex-col gap-4 py-4 px-4 sm:px-5 border-b border-gray-200">
          {flight.facilities && flight.facilities.length > 0 && (
            <div className="flex items-start gap-3 flex-wrap">
              <span className="text-xs text-gray-500 font-medium shrink-0">
                Facilities:
              </span>

              {flight.facilities.slice(0, 4).map((facility, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="text-gray-400">
                    {getFacilityIcon(facility)}
                  </span>
                  <span className="text-xs text-gray-600">{facility}</span>
                </div>
              ))}

              {flight.facilities.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{flight.facilities.length - 4} more
                </span>
              )}
            </div>
          )}

          {flight.baggage && (
            <div className="flex items-start gap-4 text-xs text-gray-600 flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 3a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8zm0 2h4v1H8V5z" />
                </svg>
                <span>Cabin Baggage: {flight.baggage.cabin}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 3a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8z" />
                </svg>
                <span>Checked Baggage: {flight.baggage.checked}</span>
              </div>
            </div>
          )}
        </div>

        {/* Details buttons */}
        <div className="py-4 px-4 sm:px-5">
          <div className="flex flex-wrap gap-4">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(flight)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Flight details
              </button>
            )}
            {onEditDetails && (
              <button
                onClick={() => onEditDetails(flight)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close button – hidden on mobile, shown as sidebar on desktop */}
      <button
        onClick={() => removeFlight(flight.id)}
        aria-label="Remove flight"
        className="hidden md:flex md:w-[5%] bg-error-background text-error-foreground items-center justify-center hover:bg-warning-background hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Mobile close button - shown at top right on mobile */}
      <button
        onClick={() => removeFlight(flight.id)}
        aria-label="Remove flight"
        className="md:hidden absolute top-2 right-2 p-2 bg-white/90 text-error-foreground rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
