"use client";

import React, { useState } from "react";
import { ItineraryAttraction } from "@/types/itinerary-types";
import {
  X,
  Dot,
  MapPin,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useItineraryStore } from "@/store/itineraryStore";
import { formatFlightPrice, getPreferredCurrency } from "@/utils/price-helpers";

interface AttractionsItineraryCardProps {
  attraction: ItineraryAttraction;
  onViewDetails?: (attraction: ItineraryAttraction) => void;
  onEditDetails?: (attraction: ItineraryAttraction) => void;
}

//  * Displays a booked attraction with image carousel, details, and actions.
//  * Responsive layout: image sidebar on desktop, full-width stack on mobile.

export const AttractionsItineraryCard: React.FC<
  AttractionsItineraryCardProps
> = ({ attraction, onViewDetails, onEditDetails }) => {
  const { removeActivity } = useItineraryStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Time not set";
    return timeString;
  };

  const formatPrice = (price: number, currency: string) => {
    const target = getPreferredCurrency();
    return formatFlightPrice(
      { amount: price, currency },
      { targetCurrency: target },
    );
  };

  // Get all available photos
  const allPhotos = [];
  if (attraction.primaryPhoto?.small) {
    allPhotos.push(attraction.primaryPhoto.small);
  }

  const currentPhotoUrl = allPhotos[currentImageIndex] || null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allPhotos.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allPhotos.length - 1 ? 0 : prev + 1,
    );
  };

  const totalPrice = attraction.ticketQuantity
    ? attraction.representativePrice.chargeAmount * attraction.ticketQuantity
    : attraction.representativePrice.chargeAmount;

  return (
    <div className="bg-background rounded-sm hover:shadow-md transition-shadow flex w-full overflow-hidden">
      {/* Attraction details – 95% */}
      <div className="w-[95%] flex h-auto">
        {/* image */}
        <div className="h-full w-auto py-3 pl-3">
          {/* Image carousel */}
          <div className="relative w-50 h-full rounded-sm overflow-hidden bg-background-neutral shrink-0 group">
            {currentPhotoUrl ? (
              <Image
                src={currentPhotoUrl}
                alt={attraction.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-light" />
              </div>
            )}

            {/* Image counter and navigation */}
            {allPhotos.length > 0 && (
              <>
                {/* Left chevron */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right chevron */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1} / {allPhotos.length}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full">
          {/* Attraction info */}
          <div className="flex justify-between items-start py-4 px-5 border-b border-[#E4E7EC]">
            {/* Attraction image and name */}
            <div className="flex items-start gap-2 flex-1">
              <div className="flex flex-col gap-1 flex-1">
                <div>
                  <p className="font-semibold text-base text-black-secondary line-clamp-2 truncate">
                    {attraction.name}
                  </p>
                  <div className="flex gap-2 items-center mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray" />
                      <span className="text-sm text-gray-dark">
                        {attraction.ufiDetails?.bCityName ?? "Unknown location"}
                      </span>
                    </div>
                    {attraction.reviewsStats && (
                      <>
                        <Dot className="w-4 h-4 text-gray-light" />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-rating fill-current" />
                          <span className="text-sm font-medium text-gray-dark">
                            {attraction.reviewsStats.combinedNumericStats.average.toFixed(
                              1,
                            )}
                          </span>
                          <span className="text-sm text-gray-light">
                            ({attraction.reviewsStats.allReviewsCount})
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-light line-clamp-2">
                  {attraction.shortDescription}
                </p>
              </div>
            </div>

            {/* Attraction price */}
            <div className="ml-4 shrink-0">
              <p className="text-2xl font-semibold text-black">
                {formatPrice(
                  totalPrice,
                  attraction.representativePrice.currency,
                )}
              </p>
              {attraction.ticketQuantity && attraction.ticketQuantity > 1 && (
                <p className="text-xs text-gray-light mt-1">
                  {attraction.ticketQuantity}{" "}
                  {attraction.ticketQuantity === 1 ? "ticket" : "tickets"}
                </p>
              )}
            </div>
          </div>

          {/* Booking details */}
          <div className="flex flex-col gap-3 py-4 px-5 border-b border-[#E4E7EC]">
            <div className="flex items-center gap-6 flex-wrap">
              {attraction.bookedDates && attraction.bookedDates.length > 0 ? (
                <div className="flex items-start gap-2 flex-col">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray shrink-0" />
                    <span className="text-sm font-medium text-gray-dark">
                      {attraction.bookedDates.length} Day
                      {attraction.bookedDates.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {attraction.bookedDates.map((date) => (
                      <span
                        key={date}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200"
                      >
                        {formatDate(date)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : attraction.selectedDate ? (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray shrink-0" />
                  <span className="text-sm text-gray-dark">
                    {formatDate(attraction.selectedDate)}
                  </span>
                </div>
              ) : null}

              {attraction.selectedTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray shrink-0" />
                  <span className="text-sm text-gray-dark">
                    {formatTime(attraction.selectedTime)}
                  </span>
                </div>
              )}

              {attraction.cancellationPolicy?.hasFreeCancellation && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-dark">
                    Free Cancellation
                  </span>
                </div>
              )}
            </div>

            {attraction.notes && (
              <div className="mt-2">
                <p className="text-xs text-gray-light">
                  <span className="font-medium">Note:</span> {attraction.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 py-4 px-5 border-t border-[#E4E7EC]">
            <div className="flex gap-4">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(attraction)}
                  className="text-blue-light hover:underline text-sm font-medium"
                >
                  Activity details
                </button>
              )}
              {onEditDetails && (
                <button
                  onClick={() => onEditDetails(attraction)}
                  className="text-blue-light hover:underline text-sm font-medium"
                >
                  Edit details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close button – 5% */}
      <button
        onClick={() => removeActivity(attraction.id)}
        aria-label="Remove activity"
        className="w-[5%] bg-error-background text-error-foreground flex items-center justify-center hover:bg-warning-background hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
