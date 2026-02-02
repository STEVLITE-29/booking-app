"use client";

import React, { useState } from "react";
import { useItineraryStore } from "@/store/itineraryStore";
import { useRouter } from "next/navigation";
import { AttractionsItineraryCard } from "./AttractionsItineraryCard";
import { AttractionsItineraryEmptyState } from "./AttractionsItineraryEmptyState";
import { AttractionDetailsModal } from "./AttractionsDetailsModal";
import Button from "./ui/Button";
import Image from "next/image";
import { ItineraryAttraction } from "@/types/itinerary-types";

interface AttractionsItinerarySectionProps {
  onAddAttraction?: () => void;
}

export const AttractionsItinerarySection: React.FC<
  AttractionsItinerarySectionProps
> = ({ onAddAttraction }) => {
  const router = useRouter();
  const { currentTrip } = useItineraryStore();
  const [selectedAttraction, setSelectedAttraction] =
    useState<ItineraryAttraction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAttraction = () => {
    if (onAddAttraction) {
      onAddAttraction();
    } else {
      router.push("/activities");
    }
  };

  const handleViewDetails = (attraction: ItineraryAttraction) => {
    setSelectedAttraction(attraction);
    setIsModalOpen(true);
  };

  const handleEditDetails = (attraction: unknown) => {
    console.log("Edit attraction details:", attraction);
  };

  return (
    <div className="w-full rounded-sm border border-blue-600 bg-blue-600 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* SVG icon – use img for reliability */}
          <Image
            src="/RoadHorizonWhite.svg"
            alt="Activities icon"
            className="h-5 w-5"
            width={20}
            height={20}
          />
          <h2 className="text-sm font-semibold text-white">Activities</h2>
        </div>

        <Button
          onClick={handleAddAttraction}
          variant="ghost"
          className="text-black-secondary text-xs"
        >
          Add Activities
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {!currentTrip || currentTrip.activities.length === 0 ? (
          <AttractionsItineraryEmptyState
            onAddAttraction={handleAddAttraction}
          />
        ) : (
          currentTrip.activities.map((attraction) => (
            <AttractionsItineraryCard
              key={`${attraction.id}-${attraction.addedAt}`}
              attraction={attraction}
              onViewDetails={handleViewDetails}
              onEditDetails={handleEditDetails}
            />
          ))
        )}
      </div>

      {/* Attraction Details Modal */}
      <AttractionDetailsModal
        attraction={selectedAttraction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
