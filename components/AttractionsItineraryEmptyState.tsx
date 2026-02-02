"use client";

import React from "react";
import Image from "next/image";
import Button from "./ui/Button";

interface AttractionsItineraryEmptyStateProps {
  onAddAttraction: () => void;
}

export const AttractionsItineraryEmptyState: React.FC<
  AttractionsItineraryEmptyStateProps
> = ({ onAddAttraction }) => {
  return (
    <div className="bg-background rounded-sm p-8 flex flex-col items-center justify-center min-h-50">
      {/* Icon */}
      <Image
        src="/hotelEmpty1.svg"
        alt="hotel img"
        width={60}
        height={60}
      ></Image>

      {/* Text */}
      <p className="text-black text-xs mt-2 mb-4">No request yet</p>

      <Button onClick={onAddAttraction} variant="primary" className="text-xs">
        Search Attractions
      </Button>
    </div>
  );
};
