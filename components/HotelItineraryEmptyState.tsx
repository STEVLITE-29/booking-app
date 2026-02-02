"use client";

import React from "react";
import Button from "./ui/Button";
import Image from "next/image";

interface HotelItineraryEmptyStateProps {
  onAddHotel?: () => void;
}

export const HotelItineraryEmptyState: React.FC<
  HotelItineraryEmptyStateProps
> = ({ onAddHotel }) => {
  return (
    <div className="bg-background rounded-sm p-8 flex flex-col items-center justify-center min-h-50">
      {/* Icon */}
      <Image
        src="/hotelEmpty.svg"
        alt="hotel img"
        width={50}
        height={50}
      ></Image>

      {/* Text */}
      <p className="text-black text-xs mt-2 mb-4">No request yet</p>

      {onAddHotel && (
        <Button onClick={onAddHotel} variant="primary" className="text-xs">
          Search Hotels
        </Button>
      )}
    </div>
  );
};
