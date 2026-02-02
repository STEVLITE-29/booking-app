"use client";

import React, { useState } from "react";
import { useItineraryStore } from "@/store/itineraryStore";
import { useRouter } from "next/navigation";
import { HotelItineraryCard } from "./HotelItineraryCard";
import { HotelItineraryEmptyState } from "./HotelItineraryEmptyState";
import { HotelDetailsModal } from "./HotelDetailsModal";
import Button from "./ui/Button";
import Image from "next/image";
import { ItineraryHotel } from "@/types/itinerary-types";

interface HotelItinerarySectionProps {
  onAddHotel?: () => void;
}

export const HotelItinerarySection: React.FC<HotelItinerarySectionProps> = ({
  onAddHotel,
}) => {
  const router = useRouter();
  const { currentTrip } = useItineraryStore();
  const [selectedHotel, setSelectedHotel] = useState<ItineraryHotel | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddHotel = () => {
    if (onAddHotel) {
      onAddHotel();
    } else {
      router.push("/hotels");
    }
  };

  const handleViewDetails = (hotel: ItineraryHotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleEditDetails = (hotel: unknown) => {
    console.log("Edit hotel details:", hotel);
  };

  return (
    <div className="w-full rounded-sm bg-gray-dark p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* SVG icon – use img for reliability */}
          <Image
            src="/WareHouse.svg"
            alt="Hotels icon"
            className="h-5 w-5"
            width={20}
            height={20}
          />
          <h2 className="text-sm font-semibold text-white">Hotels</h2>
        </div>

        <Button
          onClick={handleAddHotel}
          variant="ghost"
          className="text-black-secondary text-xs"
        >
          Add Hotels
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {!currentTrip || currentTrip.hotels.length === 0 ? (
          <HotelItineraryEmptyState onAddHotel={handleAddHotel} />
        ) : (
          currentTrip.hotels.map((hotel) => (
            <HotelItineraryCard
              key={`${hotel.hotel_id}-${hotel.addedAt}`}
              hotel={hotel}
              onViewDetails={handleViewDetails}
              onEditDetails={handleEditDetails}
            />
          ))
        )}
      </div>

      {/* Hotel Details Modal */}
      <HotelDetailsModal
        hotel={selectedHotel}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
