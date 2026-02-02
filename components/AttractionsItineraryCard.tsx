"use client";

import React, { useState, useEffect } from "react";
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

/**
 * Displays a booked attraction with image carousel, details, and actions.
 * Responsive layout: stacked on mobile, image sidebar on desktop.
 */
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

  // Build photos and persist to localStorage so images persist across navigation
  const buildPhotos = () => {
    const list: string[] = [];
    if (attraction.primaryPhoto?.small)
      list.push(attraction.primaryPhoto.small);
    return list;
  };

  const storageKey = `attraction-photos:${attraction.id || attraction.name}`;
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey);
        if (stored) return JSON.parse(stored) as string[];
      }
    } catch {
      // ignore
    }
    return buildPhotos();
  });

  const currentPhotoUrl = photos[currentImageIndex] || null;

  useEffect(() => {
    const built = buildPhotos();
    setPhotos((prev) => {
      const merged = Array.from(new Set([...prev, ...built]));
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(storageKey, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
    setCurrentImageIndex((i) => (i >= built.length ? 0 : i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attraction.primaryPhoto?.small]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? Math.max(0, photos.length - 1) : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const totalPrice = attraction.ticketQuantity
    ? attraction.representativePrice.chargeAmount * attraction.ticketQuantity
    : attraction.representativePrice.chargeAmount;

  return (
    <div className="relative bg-background rounded-sm hover:shadow-md transition-shadow flex flex-col md:flex-row w-full overflow-hidden">
      {/* Attraction details – full width on mobile, 95% on desktop */}
      <div className="w-full md:w-[95%] flex flex-col md:flex-row h-auto">
        {/* Image - full width on mobile, sidebar on desktop */}
        <div className="h-48 md:h-full w-full md:w-auto py-0 md:py-3 pl-0 md:pl-3">
          {/* Image carousel */}
          <div className="relative w-full md:w-50 h-full rounded-t-sm md:rounded-sm overflow-hidden bg-background-neutral shrink-0 group">
            {currentPhotoUrl ? (
              <Image
                key={currentPhotoUrl}
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
            {photos.length > 1 && (
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
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="w-full">
          {/* Attraction info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 py-4 px-4 sm:px-5 border-b border-[#E4E7EC]">
            {/* Attraction name and details */}
            <div className="flex items-start gap-2 flex-1 w-full">
              <div className="flex flex-col gap-1 flex-1">
                <div>
                  <p className="font-semibold text-base text-black-secondary line-clamp-2">
                    {attraction.name}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray" />
                      <span className="text-sm text-gray-dark">
                        {attraction.ufiDetails?.bCityName ?? "Unknown location"}
                      </span>
                    </div>
                    {attraction.reviewsStats && (
                      <>
                        <Dot className="w-4 h-4 text-gray-light hidden sm:block" />
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

                <p className="text-xs text-gray-light line-clamp-2 mt-1">
                  {attraction.shortDescription}
                </p>
              </div>
            </div>

            {/* Attraction price */}
            <div className="shrink-0 w-full sm:w-auto sm:ml-4">
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
          <div className="flex flex-col gap-3 py-4 px-4 sm:px-5 border-b border-[#E4E7EC]">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {attraction.bookedDates && attraction.bookedDates.length > 0 ? (
                <div className="flex items-start gap-2 flex-col w-full sm:w-auto">
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
          <div className="py-4 px-4 sm:px-5">
            <div className="flex flex-wrap gap-4">
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

      {/* Close button – hidden on mobile, shown as sidebar on desktop */}
      <button
        onClick={() => removeActivity(attraction.id)}
        aria-label="Remove activity"
        className="hidden md:flex md:w-[5%] bg-error-background text-error-foreground items-center justify-center hover:bg-warning-background hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Mobile close button - shown at top right on mobile */}
      <button
        onClick={() => removeActivity(attraction.id)}
        aria-label="Remove activity"
        className="md:hidden absolute top-2 right-2 p-2 bg-white/90 text-error-foreground rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
