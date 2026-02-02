import React, { useState } from "react";
import type { Hotel } from "@/types/hotel-types";
import Image from "next/image";
import { useItineraryStore } from "@/store/itineraryStore";
import { Check, Plus } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
  checkinDate?: string;
  checkoutDate?: string;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onSelect,
  checkinDate,
  checkoutDate,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addHotel, currentTrip } = useItineraryStore();

  const price = hotel.priceBreakdown?.grossPrice?.value || 0;
  const currency = hotel.priceBreakdown?.grossPrice?.currency || "USD";
  const reviewScore = hotel.property?.reviewScore || 0;
  const reviewWord = hotel.property?.reviewScoreWord || "";
  const reviewCount = hotel.property?.reviewCount || 0;
  const photoUrl =
    hotel.property?.mainPhotoUrl || hotel.property?.photoUrls?.[0];

  const handleAddToItinerary = () => {
    if (!currentTrip) {
      alert("Please create a trip first!");
      return;
    }

    if (!checkinDate || !checkoutDate) {
      alert("Please select check-in and check-out dates!");
      return;
    }

    addHotel(hotel, checkinDate, checkoutDate);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Helper function to safely get date values
  const getCheckinDate = () => checkinDate || hotel.property.checkinDate || "";
  const getCheckoutDate = () =>
    checkoutDate || hotel.property.checkoutDate || "";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-1/3 relative h-48 md:h-64">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={hotel.property.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-2">
                {hotel.property.name}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-light mb-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <button
                  onClick={() => {
                    /* Show on map */
                  }}
                  className="text-blue-light hover:underline"
                >
                  Show in map
                </button>
              </div>

              {/* Review Score */}
              {reviewScore > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-dark text-white px-2 py-1 rounded font-semibold text-sm">
                    {reviewScore.toFixed(1)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark text-sm">
                      {reviewWord}
                    </p>
                    <p className="text-xs text-gray-light">
                      {reviewCount.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-1 text-sm text-gray">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span>Pool</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Bar</span>
                </div>
              </div>

              {/* Check-in/Check-out */}
              {getCheckinDate() && getCheckoutDate() && (
                <div className="flex items-center gap-4 text-sm text-gray-light">
                  <div className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Check-in:{" "}
                      {new Date(getCheckinDate()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Check-out:{" "}
                      {new Date(getCheckoutDate()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Price and Action */}
            <div className="md:ml-6 mt-4 md:mt-0 flex flex-col items-end justify-between">
              <div className="text-right mb-4">
                <p className="text-xs text-gray-light mb-1">Total Price</p>
                <p className="text-2xl font-bold text-black">
                  {currency} {price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-light mt-1">
                  1 room ·{" "}
                  {getCheckinDate() && getCheckoutDate()
                    ? Math.ceil(
                        (new Date(getCheckoutDate()).getTime() -
                          new Date(getCheckinDate()).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    : 0}{" "}
                  nights incl. taxes
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => onSelect(hotel)}
                  className="px-6 py-3 bg-white text-blue-light border border-blue-light font-semibold rounded-lg hover:bg-accent transition-colors w-full whitespace-nowrap"
                >
                  View Details
                </button>
                <button
                  onClick={handleAddToItinerary}
                  disabled={isAdded || !checkinDate || !checkoutDate}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all w-full whitespace-nowrap flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : "bg-blue-light text-white hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex gap-4 pt-3 border-t border-gray-200">
            <button className="text-sm text-blue-light hover:underline">
              Hotel details
            </button>
            <button className="text-sm text-blue-light hover:underline">
              Price details
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 z-10"
          onClick={(e) => {
            e.stopPropagation();
            // Handle remove from list
          }}
        >
          <svg
            className="w-5 h-5 text-gray-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
