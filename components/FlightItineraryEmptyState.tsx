"use client";

import React from "react";
import Image from "next/image";
import Button from "./ui/Button";

interface FlightItineraryEmptyStateProps {
  onAddFlight: () => void;
}

export const FlightItineraryEmptyState: React.FC<
  FlightItineraryEmptyStateProps
> = ({ onAddFlight }) => {
  return (
    <div className="bg-background rounded-sm p-8 flex flex-col items-center justify-center min-h-50">
      {/* Icon */}
      <Image
        src="/PlaneEmpty.png"
        alt="plane img"
        width={90}
        height={90}
      ></Image>

      {/* Text */}
      <p className="text-black text-xs mt-2 mb-4">No request yet</p>

      {/* Add Button */}
      <Button
        onClick={onAddFlight}
        variant="primary"
        size="md"
        className="text-xs"
      >
        Add Flight
      </Button>
    </div>
  );
};
