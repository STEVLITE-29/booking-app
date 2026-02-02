"use client";

import React from "react";
import { ItineraryHotel } from "@/types/itinerary-types";
import { X, MapPin, Star, DoorOpen, Users, Calendar } from "lucide-react";
import Image from "next/image";

interface HotelDetailsModalProps {
  hotel: ItineraryHotel | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Displays detailed hotel booking information with room details, dates, and pricing.
 * Fully responsive modal: adaptive image heights, responsive grid layouts for mobile.
 */
export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({
  hotel,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !hotel) return null;

  // Format date with weekday, day, month, year
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

  // Get primary photo URL from hotel property
  const photoUrl =
    hotel.property?.mainPhotoUrl || hotel.property?.photoUrls?.[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-96 overflow-y-auto">
        {/* Header image with close button */}
        <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200 overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={hotel.property.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <MapPin className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 hover:bg-white p-1 sm:p-2 rounded-lg transition-colors shadow-lg"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Hotel name and location info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {hotel.property.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500 shrink-0" />
              <p className="text-xs sm:text-sm text-gray-600">
                Lat: {hotel.property.latitude.toFixed(2)}, Lon:{" "}
                {hotel.property.longitude.toFixed(2)}
              </p>
            </div>
            {hotel.property.reviewScore && (
              <div className="flex items-center gap-2 mt-3">
                <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current shrink-0" />
                <span className="font-semibold text-sm sm:text-base text-gray-900">
                  {hotel.property.reviewScore.toFixed(1)}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  ({hotel.property.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Stay details grid: responsive 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-light shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Check-in
                </p>
              </div>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {formatDate(hotel.checkinDate)}
              </p>
            </div>
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-light shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Check-out
                </p>
              </div>
              <p className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                {formatDate(hotel.checkoutDate)}
              </p>
            </div>
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <DoorOpen className="w-4 h-4 text-blue-light shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Rooms
                </p>
              </div>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                {hotel.numberOfRooms || 1}{" "}
                {(hotel.numberOfRooms || 1) === 1 ? "room" : "rooms"}
              </p>
            </div>
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-light shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Guests
                </p>
              </div>
              <p className="text-sm sm:text-lg font-semibold text-gray-900">
                {hotel.numberOfGuests || 1} guest
                {(hotel.numberOfGuests || 1) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Room type */}
          {hotel.roomType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                Room Type
              </p>
              <p className="font-semibold text-sm sm:text-base text-gray-900">
                {hotel.roomType}
              </p>
            </div>
          )}

          {/* Stay duration */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Duration
            </p>
            <p className="text-sm sm:text-lg font-semibold text-gray-900">
              {hotel.nights} {hotel.nights === 1 ? "night" : "nights"}
            </p>
          </div>

          {/* Pricing summary */}
          {hotel.priceBreakdown?.grossPrice && (
            <div className="border-t pt-3 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <p className="text-sm sm:text-lg font-semibold text-gray-900">
                  Total
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-light">
                  {hotel.priceBreakdown.grossPrice.currency}{" "}
                  {hotel.priceBreakdown.grossPrice.value.toLocaleString()}
                </p>
              </div>
              {hotel.nights > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {hotel.priceBreakdown.grossPrice.currency}{" "}
                  {(
                    hotel.priceBreakdown.grossPrice.value / hotel.nights
                  ).toFixed(0)}{" "}
                  per night
                </p>
              )}
            </div>
          )}

          {/* Booking reference and notes */}
          {(hotel.bookingReference ||
            hotel.confirmationNumber ||
            hotel.notes) && (
            <div className="border-t pt-3 sm:pt-4">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                Booking Information
              </h3>
              {hotel.bookingReference && (
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">Reference:</span>{" "}
                  {hotel.bookingReference}
                </p>
              )}
              {hotel.confirmationNumber && (
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  <span className="font-medium text-gray-900">
                    Confirmation:
                  </span>{" "}
                  {hotel.confirmationNumber}
                </p>
              )}
              {hotel.notes && (
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Notes:</span>{" "}
                  {hotel.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
