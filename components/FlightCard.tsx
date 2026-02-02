"use client";

import React from "react";
import { Plane, Clock } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FlightSegment {
  departureTime: string;
  arrivalTime: string;
  departureAirport: {
    code: string;
    name: string;
    city: string;
  };
  arrivalAirport: {
    code: string;
    name: string;
    city: string;
  };
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  duration: string;
}

interface Flight {
  id: string;
  token: string;
  segments: FlightSegment[];
  totalDuration: string;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  cabinClass: string;
  facilities: string[];
  baggage?: {
    cabin: string;
    checked: string;
  };
}

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  const router = useRouter();
  const { currentTrip, addFlight } = useItineraryStore();
  const [isAdding, setIsAdding] = React.useState(false);

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
      month: "short",
      day: "numeric",
    });
  };

  const handleAddToItinerary = () => {
    if (!currentTrip) {
      // If no trip exists, redirect to create trip
      if (
        confirm(
          "You need to create a trip first. Would you like to create one now?",
        )
      ) {
        router.push("/itinerary/create");
      }
      return;
    }

    setIsAdding(true);

    // Add flight to itinerary with the departure date
    addFlight(flight, firstSegment.departureTime.split("T")[0]);

    // Show success message
    setTimeout(() => {
      setIsAdding(false);
      alert("Flight added to your itinerary!");
    }, 500);
  };

  const isAlreadyAdded = currentTrip?.flights.some((f) => f.id === flight.id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Airline and Price Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border">
            <Image
              src={`https://images.kiwi.com/airlines/64/${firstSegment.airlineCode}.png`}
              alt={firstSegment.airlineName}
              className="w-full h-full object-contain"
              width={48}
              height={48}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/AirplaneTilt.svg";
              }}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {firstSegment.airlineName}
            </p>
            <p className="text-sm text-gray-500">{firstSegment.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {flight.price.currency} {flight.price.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{flight.cabinClass}</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        {/* Departure */}
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-900">
            {formatTime(firstSegment.departureTime)}
          </p>
          <p className="text-lg font-medium text-gray-700">
            {firstSegment.departureAirport.code}
          </p>
          <p className="text-sm text-gray-500">
            {firstSegment.departureAirport.city}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(firstSegment.departureTime)}
          </p>
        </div>

        {/* Flight Path */}
        <div className="flex-[1.5] flex flex-col items-center px-4">
          <div className="flex items-center gap-2 w-full">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="flex-1 h-0.5 bg-blue-500 relative">
              {flight.stops > 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                </div>
              )}
            </div>
            <Plane className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600 font-medium">
              {flight.totalDuration}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {flight.stops === 0
              ? "Direct"
              : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Arrival */}
        <div className="flex-1 text-right">
          <p className="text-3xl font-bold text-gray-900">
            {formatTime(lastSegment.arrivalTime)}
          </p>
          <p className="text-lg font-medium text-gray-700">
            {lastSegment.arrivalAirport.code}
          </p>
          <p className="text-sm text-gray-500">
            {lastSegment.arrivalAirport.city}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(lastSegment.arrivalTime)}
          </p>
        </div>
      </div>

      {/* Facilities */}
      {flight.facilities && flight.facilities.length > 0 && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
          <span className="text-sm text-gray-500">Facilities:</span>
          <div className="flex flex-wrap gap-2">
            {flight.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {facility}
              </span>
            ))}
            {flight.facilities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{flight.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Baggage */}
      {flight.baggage && (
        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 3a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8zm0 2h4v1H8V5z" />
            </svg>
            <span>Cabin: {flight.baggage.cabin}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 3a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8z" />
            </svg>
            <span>Checked: {flight.baggage.checked}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onSelect(flight)}
          className="flex-1 py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={handleAddToItinerary}
          disabled={isAdding || isAlreadyAdded}
          className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${
            isAlreadyAdded
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : isAdding
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isAlreadyAdded
            ? "Added to Itinerary"
            : isAdding
              ? "Adding..."
              : "Add to Itinerary"}
        </button>
      </div>
    </div>
  );
};
