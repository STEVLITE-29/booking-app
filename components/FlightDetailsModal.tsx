"use client";

import React from "react";
import { ItineraryFlight } from "@/types/itinerary-types";
import { X, PlaneTakeoff, PlaneLanding, Briefcase } from "lucide-react";

interface FlightDetailsModalProps {
  flight: ItineraryFlight | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  flight,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !flight) return null;

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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-light text-white p-6 flex items-start justify-between border-b">
          <div>
            <h2 className="text-2xl font-bold">{firstSegment.airlineName}</h2>
            <p className="text-sm text-white/80 mt-1">
              Flight {firstSegment.flightNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Route */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {firstSegment.departureAirport.code}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatTime(firstSegment.departureTime)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(firstSegment.departureTime)}
                </p>
              </div>

              <div className="flex-1 mx-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PlaneTakeoff className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 h-1 bg-gray-300 rounded-full" />
                  <PlaneLanding className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {flight.totalDuration}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {flight.stops === 0
                    ? "Non-stop"
                    : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {lastSegment.arrivalAirport.code}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatTime(lastSegment.arrivalTime)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(lastSegment.arrivalTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Cabin Class
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {flight.cabinClass}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Aircraft</p>
              <p className="text-lg font-semibold text-gray-900">
                {flight.segments[0].aircraft || "N/A"}
              </p>
            </div>
          </div>

          {/* Segments */}
          {flight.segments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Flight Segments
              </h3>
              <div className="space-y-3">
                {flight.segments.map((segment, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {segment.departureAirport.code} →{" "}
                          {segment.arrivalAirport.code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Flight {segment.flightNumber} • {segment.airlineName}
                        </p>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">
                        Segment {idx + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Departure</p>
                        <p className="font-medium text-gray-900">
                          {formatTime(segment.departureTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Arrival</p>
                        <p className="font-medium text-gray-900">
                          {formatTime(segment.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {flight.facilities && flight.facilities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {flight.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <Briefcase className="w-4 h-4 text-blue-light" />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Baggage */}
          {flight.baggage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Baggage</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Cabin Baggage</p>
                  <p className="font-medium text-gray-900">
                    {flight.baggage.cabin}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Checked Baggage</p>
                  <p className="font-medium text-gray-900">
                    {flight.baggage.checked}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Info */}
          {(flight.bookingReference ||
            flight.confirmationNumber ||
            flight.notes) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Booking Information
              </h3>
              {flight.bookingReference && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">Reference:</span>{" "}
                  {flight.bookingReference}
                </p>
              )}
              {flight.confirmationNumber && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">
                    Confirmation:
                  </span>{" "}
                  {flight.confirmationNumber}
                </p>
              )}
              {flight.notes && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Notes:</span>{" "}
                  {flight.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
