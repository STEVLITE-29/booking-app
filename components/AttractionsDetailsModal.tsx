"use client";

import React from "react";
import { ItineraryAttraction } from "@/types/itinerary-types";
import { X, MapPin, Star, Calendar, Clock, Ticket } from "lucide-react";
import Image from "next/image";

interface AttractionDetailsModalProps {
  attraction: ItineraryAttraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttractionDetailsModal: React.FC<AttractionDetailsModalProps> = ({
  attraction,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !attraction) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const photoUrl = attraction.primaryPhoto?.small;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header with Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={attraction.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-lg transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Activity Name & Rating */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {attraction.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">
                {attraction.ufiDetails?.bCityName ?? "Unknown location"}
              </p>
            </div>
            {attraction.reviewsStats && (
              <div className="flex items-center gap-2 mt-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">
                  {attraction.reviewsStats.combinedNumericStats.average.toFixed(
                    1,
                  )}
                </span>
                <span className="text-sm text-gray-600">
                  ({attraction.reviewsStats.allReviewsCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {attraction.shortDescription && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {attraction.shortDescription}
              </p>
            </div>
          )}

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-4">
            {attraction.bookedDates && attraction.bookedDates.length > 0 ? (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-light" />
                  <p className="text-sm font-medium text-gray-600">Dates</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {attraction.bookedDates.length} day
                  {attraction.bookedDates.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {attraction.bookedDates.map((date) => (
                    <span
                      key={date}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {formatDate(date)}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-light" />
                  <p className="text-sm font-medium text-gray-600">Date</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatDate(attraction.selectedDate)}
                </p>
              </div>
            )}

            {attraction.selectedTime && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-light" />
                  <p className="text-sm font-medium text-gray-600">Time</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {attraction.selectedTime}
                </p>
              </div>
            )}

            {attraction.ticketQuantity && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-4 h-4 text-blue-light" />
                  <p className="text-sm font-medium text-gray-600">Tickets</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {attraction.ticketQuantity} ticket
                  {attraction.ticketQuantity !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Cancellation Policy */}
          {attraction.cancellationPolicy?.hasFreeCancellation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-700">
                ✓ Free Cancellation Available
              </p>
              <p className="text-xs text-green-600 mt-1">
                You can cancel this activity for free until the specified
                deadline.
              </p>
            </div>
          )}

          {/* Price */}
          {attraction.representativePrice && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">
                  {attraction.ticketQuantity
                    ? `Total (${attraction.ticketQuantity} ticket${attraction.ticketQuantity !== 1 ? "s" : ""})`
                    : "Price per Ticket"}
                </p>
                <p className="text-2xl font-bold text-blue-light">
                  {attraction.representativePrice.currency}{" "}
                  {(
                    attraction.representativePrice.chargeAmount *
                    (attraction.ticketQuantity || 1)
                  ).toLocaleString()}
                </p>
              </div>
              {attraction.ticketQuantity && attraction.ticketQuantity > 1 && (
                <p className="text-sm text-gray-600 mt-2">
                  {attraction.representativePrice.currency}{" "}
                  {attraction.representativePrice.chargeAmount.toLocaleString()}{" "}
                  per ticket
                </p>
              )}
            </div>
          )}

          {/* Booking Info */}
          {(attraction.bookingReference ||
            attraction.confirmationNumber ||
            attraction.notes) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Booking Information
              </h3>
              {attraction.bookingReference && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">Reference:</span>{" "}
                  {attraction.bookingReference}
                </p>
              )}
              {attraction.confirmationNumber && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">
                    Confirmation:
                  </span>{" "}
                  {attraction.confirmationNumber}
                </p>
              )}
              {attraction.notes && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Notes:</span>{" "}
                  {attraction.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
