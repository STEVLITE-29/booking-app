"use client";

import React, { useState } from "react";
import { useItineraryStore } from "@/store/itineraryStore";
import { useRouter } from "next/navigation";
import { FlightItineraryCard } from "./FlightItineraryCard";
import { FlightItineraryEmptyState } from "./FlightItineraryEmptyState";
import { FlightDetailsModal } from "./FlightDetailsModal";
import Image from "next/image";
import Button from "./ui/Button";
import { ItineraryFlight } from "@/types/itinerary-types";

interface FlightItinerarySectionProps {
  onAddFlight?: () => void;
}

export const FlightItinerarySection: React.FC<FlightItinerarySectionProps> = ({
  onAddFlight,
}) => {
  const router = useRouter();
  const { currentTrip } = useItineraryStore();
  const [selectedFlight, setSelectedFlight] = useState<ItineraryFlight | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddFlight = () => {
    if (onAddFlight) {
      onAddFlight();
    } else {
      router.push("/flights");
    }
  };

  const handleViewDetails = (flight: ItineraryFlight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleEditDetails = (flight: unknown) => {
    // You can implement editing functionality
    console.log("Edit flight details:", flight);
  };

  return (
    <div className="space-y-4 bg-background-neutral p-3 rounded-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/AirplaneInFlight.svg"
            alt="plaen icon"
            width={20}
            height={20}
          ></Image>
          <h2 className="text-sm font-semibold text-black">Flights</h2>
        </div>
        <Button onClick={handleAddFlight} variant="ghost" className="text-xs">
          Add Flights
        </Button>
      </div>

      {/* Content */}
      {!currentTrip || currentTrip.flights.length === 0 ? (
        <FlightItineraryEmptyState onAddFlight={handleAddFlight} />
      ) : (
        <div className="space-y-4">
          {currentTrip.flights.map((flight) => (
            <FlightItineraryCard
              key={`${flight.id}-${flight.addedAt}`}
              flight={flight}
              onViewDetails={handleViewDetails}
              onEditDetails={handleEditDetails}
            />
          ))}
        </div>
      )}

      {/* Flight Details Modal */}
      <FlightDetailsModal
        flight={selectedFlight}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
