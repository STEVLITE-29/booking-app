"use client";

import React, { useState, useEffect } from "react";
import { ItineraryHotel } from "@/types/itinerary-types";
import {
  X,
  Dot,
  MapPin,
  Star,
  Calendar,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useItineraryStore } from "@/store/itineraryStore";
import { formatFlightPrice, getPreferredCurrency } from "@/utils/price-helpers";

interface HotelItineraryCardProps {
  hotel: ItineraryHotel;
  onViewDetails?: (hotel: ItineraryHotel) => void;
  onEditDetails?: (hotel: ItineraryHotel) => void;
}

/**
 * Displays a booked hotel with image carousel, details, and actions.
 * Responsive layout: stacked on mobile, image sidebar on desktop.
 */
export const HotelItineraryCard: React.FC<HotelItineraryCardProps> = ({
  hotel,
  onViewDetails,
}) => {
  const { removeHotel } = useItineraryStore();
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

  const formatPrice = (price: number, currency: string) => {
    const target = getPreferredCurrency();
    return formatFlightPrice(
      { amount: price, currency },
      { targetCurrency: target },
    );
  };

  const nights = hotel.nights || 0;
  const totalPrice = hotel.priceBreakdown?.grossPrice?.value || 0;
  const currency = hotel.priceBreakdown?.grossPrice?.currency || "USD";
  const reviewScore = hotel.property?.reviewScore || 0;
  const reviewCount = hotel.property?.reviewCount || 0;

  // Build initial photo list from hotel props
  const buildPhotos = () => {
    const list: string[] = [];
    if (hotel.property?.mainPhotoUrl) list.push(hotel.property.mainPhotoUrl);
    if (hotel.property?.photoUrls && Array.isArray(hotel.property.photoUrls)) {
      list.push(
        ...hotel.property.photoUrls.filter(
          (url) => url !== hotel.property?.mainPhotoUrl,
        ),
      );
    }
    return list;
  };

  // Persist photos in localStorage per hotel so they survive refresh/navigation
  const storageKey = `hotel-photos:${hotel.hotel_id || hotel.property?.name}`;
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
    // Rebuild photos when hotel prop changes and merge with storage
    const built = buildPhotos();
    setPhotos((prev) => {
      // prefer stored order but ensure all built photos are present
      const merged = Array.from(new Set([...prev, ...built]));
      try {
        if (typeof window !== "undefined")
          localStorage.setItem(storageKey, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
    // clamp index
    setCurrentImageIndex((i) => (i >= built.length ? 0 : i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.property?.mainPhotoUrl, hotel.property?.photoUrls]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? Math.max(0, photos.length - 1) : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-background rounded-sm hover:shadow-md transition-shadow flex flex-col md:flex-row w-full overflow-hidden">
      {/* Hotel details – full width on mobile, 95% on desktop */}
      <div className="w-full md:w-[95%] flex flex-col md:flex-row h-auto">
        {/* Image - full width on mobile, sidebar on desktop */}
        <div className="h-48 md:h-full w-full md:w-auto py-0 md:py-3 pl-0 md:pl-3">
          {/* Image carousel */}
          <div className="relative w-full md:w-50 h-full rounded-t-sm md:rounded-sm overflow-hidden bg-background-neutral shrink-0 group">
            {currentPhotoUrl ? (
              <Image
                key={currentPhotoUrl}
                src={currentPhotoUrl}
                alt={hotel.property.name}
                fill
                className="object-cover"
                onError={() => {
                  // remove broken image and persist
                  setPhotos((prev) => {
                    const next = prev.filter((p) => p !== currentPhotoUrl);
                    try {
                      if (typeof window !== "undefined")
                        localStorage.setItem(storageKey, JSON.stringify(next));
                    } catch {
                      // ignore
                    }
                    return next;
                  });
                }}
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
          {/* Hotel info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 py-4 px-4 sm:px-5 border-b border-[#E4E7EC]">
            {/* Hotel name and details */}
            <div className="flex items-start gap-2 flex-1 w-full">
              <div className="flex flex-col gap-1 flex-1">
                <div>
                  <p className="font-semibold text-base text-black-secondary line-clamp-2">
                    {hotel.property.name}
                  </p>

                  {/* Address */}
                  <p className="text-xs text-gray-light mt-1 line-clamp-2">
                    {hotel.property.latitude && hotel.property.longitude
                      ? `Coordinates: ${hotel.property.latitude.toFixed(2)}°, ${hotel.property.longitude.toFixed(2)}°`
                      : "Address not available"}
                  </p>

                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray" />
                      <span className="text-sm text-gray-dark">
                        {hotel.property.latitude && hotel.property.longitude
                          ? "Show in map"
                          : "Location"}
                      </span>
                    </div>
                    {reviewScore > 0 && (
                      <>
                        <Dot className="w-4 h-4 text-gray-light hidden sm:block" />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-rating fill-current" />
                          <span className="text-sm font-medium text-gray-dark">
                            {reviewScore.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-light">
                            ({reviewCount})
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Room Type */}
                  {hotel.roomType && (
                    <p className="text-xs text-gray-dark mt-2">
                      <span className="font-medium">Room:</span>{" "}
                      {hotel.roomType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Hotel price */}
            <div className="shrink-0 w-full sm:w-auto sm:ml-4">
              <p className="text-2xl font-semibold text-black">
                {formatPrice(totalPrice, currency)}
              </p>
              <p className="text-xs text-gray-light mt-1">Total Price</p>
              {nights > 0 && (
                <p className="text-xs text-gray-light mt-1">
                  {hotel.numberOfRooms || 1} room
                  {hotel.numberOfRooms !== 1 ? "s" : ""} × {nights}{" "}
                  {nights === 1 ? "night" : "nights"} incl. taxes
                </p>
              )}
            </div>
          </div>

          {/* Booking details */}
          <div className="flex flex-col gap-3 py-4 px-4 sm:px-5 border-b border-[#E4E7EC]">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {hotel.checkinDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray shrink-0" />
                  <span className="text-sm text-gray-dark">
                    Check-in: {formatDate(hotel.checkinDate)}
                  </span>
                </div>
              )}

              {hotel.checkoutDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray shrink-0" />
                  <span className="text-sm text-gray-dark">
                    Check-out: {formatDate(hotel.checkoutDate)}
                  </span>
                </div>
              )}

              {nights > 0 && (
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-gray shrink-0" />
                  <span className="text-sm text-gray-dark">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              )}

              {hotel.numberOfRooms && hotel.numberOfRooms > 0 && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="text-sm text-gray-dark">
                    {hotel.numberOfRooms}{" "}
                    {hotel.numberOfRooms === 1 ? "room" : "rooms"}
                  </span>
                </div>
              )}
            </div>

            {hotel.notes && (
              <div className="text-xs text-gray-light">
                <span className="font-medium text-gray-dark">Notes: </span>
                {hotel.notes}
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="py-4 px-4 sm:px-5">
            <div className="flex flex-wrap gap-4">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(hotel)}
                  className="text-blue-light hover:underline text-sm font-medium"
                >
                  Hotel details
                </button>
              )}
              <button className="text-blue-light hover:underline text-sm font-medium">
                Price details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close button – hidden on mobile, shown as sidebar on desktop */}
      <button
        onClick={() => removeHotel(hotel.hotel_id)}
        aria-label="Remove hotel"
        className="hidden md:flex md:w-[5%] bg-error-background text-error-foreground items-center justify-center hover:bg-warning-background hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Mobile close button - shown at top right on mobile */}
      <button
        onClick={() => removeHotel(hotel.hotel_id)}
        aria-label="Remove hotel"
        className="md:hidden absolute top-2 right-2 p-2 bg-white/90 text-error-foreground rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
