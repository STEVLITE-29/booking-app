"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useItineraryStore } from "@/store/itineraryStore";
import type { Attraction } from "@/services/attractionService";
import AttractionDetailsModal from "./AttractionDetailsModal";

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const router = useRouter();
  const { currentTrip, addActivity } = useItineraryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToItinerary = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!currentTrip) {
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

    // Add attraction to itinerary
    addActivity(attraction);

    // Show success message
    setTimeout(() => {
      setIsAdding(false);
      alert("Activity added to your itinerary!");
    }, 500);
  };

  const isAlreadyAdded = currentTrip?.activities.some(
    (a) => a.id === attraction.id,
  );

  const handleCardClick = () => {
    // Open modal instead of navigating
    setIsModalOpen(true);
  };

  const imageUrl = imageError
    ? "/fallbackAttractionImage.jpg"
    : attraction.primaryPhoto.small;

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={attraction.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          {attraction.flags?.some((flag) => flag.flag === "bestseller") && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Bestseller
            </div>
          )}
          {attraction.cancellationPolicy?.hasFreeCancellation && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Free Cancellation
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-12">
            {attraction.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-600 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs truncate">
              {attraction.ufiDetails?.bCityName ?? "Unknown location"}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {attraction.shortDescription}
          </p>

          {/* Rating */}
          {attraction.reviewsStats && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" />
                {attraction.reviewsStats.combinedNumericStats.average.toFixed(
                  1,
                )}
              </div>
              <span className="text-xs text-gray-600">
                {attraction.reviewsStats.percentage} (
                {attraction.reviewsStats.allReviewsCount.toLocaleString()}{" "}
                reviews)
              </span>
            </div>
          )}

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-xl font-bold text-gray-900">
                {attraction.representativePrice.currency}{" "}
                {attraction.representativePrice.chargeAmount.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleAddToItinerary}
              disabled={isAdding || isAlreadyAdded}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isAlreadyAdded
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : isAdding
                    ? "bg-blue-400 text-white cursor-wait"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isAlreadyAdded
                ? "Added"
                : isAdding
                  ? "Adding..."
                  : "Add to Trip"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AttractionDetailsModal
        attraction={attraction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AttractionCard;
