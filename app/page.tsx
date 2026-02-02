"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useItineraryStore } from "@/store/itineraryStore";
import Image from "next/image";
import {
  Calendar,
  Trash2,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Ellipsis,
  Settings,
  Users,
  MapPin,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { FlightItinerarySection } from "@/components/FlightItinerarySection";
import { AttractionsItinerarySection } from "@/components/AttractionsItinerarySection";
import { HotelItinerarySection } from "@/components/HotelItinerarySection";

export default function Home() {
  const { currentTrip, createTrip, deleteTrip, isHydrated } =
    useItineraryStore();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [soloTrip, setSoloTrip] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const handleCreateTrip = () => {
    if (tripName && destination && startDate && endDate) {
      createTrip(
        tripName,
        destination,
        startDate,
        endDate,
        bannerImage,
        latitude,
        longitude,
        soloTrip,
      );
      setTripName("");
      setDestination("");
      setLatitude(undefined);
      setLongitude(undefined);
      setStartDate("");
      setEndDate("");
      setSoloTrip(false);
      setBannerImage(null);
    }
  };

  const handleDeleteTrip = () => {
    deleteTrip();
    setShowDeleteConfirmation(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateTripDays = () => {
    if (!currentTrip) return 0;
    const start = new Date(currentTrip.startDate);
    const end = new Date(currentTrip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleBannerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isHydrated) {
    // Show loading state while hydrating from localStorage
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-light/10 rounded-full">
            <div className="w-8 h-8 border-2 border-blue-light border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-dark font-medium">Loading your trip...</p>
        </div>
      </div>
    );
  }

  // Show trip creation modal only if hydrated and no trip exists
  const shouldShowCreateModal = !currentTrip;

  if (shouldShowCreateModal) {
    return (
      <div className="flex bg-background p-4 rounded-sm">
        {shouldShowCreateModal && (
          <div className="bg-background w-full p-4">
            <h2 className="text-3xl font-bold text-black mb-6">
              Create Your Trip
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Summer Vacation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
              </div>

              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <input
                  type="checkbox"
                  id="soloTrip"
                  checked={soloTrip}
                  onChange={(e) => setSoloTrip(e.target.checked)}
                  className="w-4 h-4 text-blue-light border-gray-300 rounded focus:ring-2 focus:ring-blue-light cursor-pointer"
                />
                <label
                  htmlFor="soloTrip"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Users className="w-4 h-4 text-blue-light" />
                  <span className="text-sm font-medium text-gray-dark">
                    This is a solo trip
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Banner Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-light"
                />
                {bannerImage && (
                  <div className="mt-2">
                    <Image
                      src={bannerImage}
                      alt="Banner preview"
                      width={200}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleCreateTrip}
                disabled={!tripName || !destination || !startDate || !endDate}
                className="w-full bg-blue-light text-white py-3 rounded-lg font-semibold hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Trip
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 w-full">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-black">Cancel Trip?</h3>
            </div>

            <p className="text-gray-dark mb-6">
              Are you sure you want to cancel &quot;{currentTrip.name}&quot;?
              This will remove all flights, hotels, and activities from your
              itinerary. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-dark font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Trip
              </button>
              <button
                onClick={handleDeleteTrip}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Header with Background Image */}
      <div
        className="relative rounded-sm overflow-hidden mb-2 h-40 md:h-60 w-full"
        style={{
          backgroundImage: currentTrip.bannerImage
            ? `url(${currentTrip.bannerImage})`
            : "/banner.svg",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="">
            <div className="inline-flex font-medium py-1 px-2 items-center gap-2 mb-1 bg-warning-background text-warning-foreground">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">
                {formatDate(currentTrip.startDate)}{" "}
                <ArrowRight className="w-4 h-4 inline-block" />{" "}
                {formatDate(currentTrip.endDate)}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-black mb-1">
              {currentTrip.name}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-lg text-gray-light">
                  {currentTrip.destination}
                </p>
              </div>
              {currentTrip.latitude && currentTrip.longitude && (
                <p className="text-xs text-gray-500 ml-2">
                  ({currentTrip.latitude.toFixed(2)}°,{" "}
                  {currentTrip.longitude.toFixed(2)}°)
                </p>
              )}
            </div>

            {currentTrip.soloTrip && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full mb-3">
                <Users className="w-3 h-3" />
                <span className="text-xs font-medium">Solo Trip</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="inline-block bg-background-neutral backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-black font-medium">
                  {calculateTripDays()}{" "}
                  {calculateTripDays() === 1 ? "day" : "days"} trip
                </p>
              </div>

              {/* Cancel Trip Button */}
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="inline-flex items-center gap-2 bg-red-600/90 hover:bg-red-700 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">
                  Cancel Trip
                </span>
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:flex-col md:items-center md:gap-4">
            <div className="flex items-center justify-between">
              <Button variant="secondary" size="md">
                <UserPlus className="w-4 h-4 mr-9 ml-9" />
              </Button>
              <Ellipsis className="w-6 h-6 text-gray-600 cursor-pointer ml-5" />
            </div>
            <div className="flex items-center">
              {/* Avatar */}
              <Image
                src="/avatar.svg"
                alt="User"
                width={30}
                height={30}
                className="object-cover"
              />
              <div className="flex items-center">
                {/* Connector line */}
                <div className="w-6 h-0.5 bg-blue-100" />

                {/* Action circle */}
                <div className="w-7.5 h-7.5 cursor-pointer rounded-full border border-blue-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-2">
          <div className="bg-blue-deep rounded-sm py-4 px-3 max-w-60">
            <h3 className="text-white text-lg font-semibold mb-4">
              Activities
            </h3>
            <p className="text-white text-xs mb-4">
              Build, personalize, and optimize your itineraries with our trip
              planner.
            </p>
            <Link href="/activities" className="block">
              <Button
                variant="primary"
                size="md"
                className="mt-4 mx-auto w-full text-xs"
              >
                Add Activities
              </Button>
            </Link>
          </div>
          <div className="bg-accent rounded-sm py-4 px-3 max-w-60">
            <h3 className="text-black text-lg font-semibold mb-4">Hotels</h3>
            <p className="text-black-secondary text-xs mb-4">
              Build, personalize, and optimize your itineraries with our trip
              planner.
            </p>
            <Link href="/hotels" className="block">
              <Button
                variant="primary"
                size="md"
                className="mt-4 mx-auto w-full text-xs"
              >
                Add Hotels
              </Button>
            </Link>
          </div>
          <div className="bg-blue-light rounded-sm py-4 px-3 max-w-60">
            <h3 className="text-white text-lg font-semibold mb-4">Flights</h3>
            <p className="text-white text-xs mb-4">
              Build, personalize, and optimize your itineraries with our trip
              planner.
            </p>
            <Link href="/flights" className="block">
              <Button
                variant="ghost"
                size="md"
                className="mt-4 mx-auto w-full text-xs"
              >
                Add Flights
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trip Itineraries Section */}
      <div className="mt-17 mb-6">
        <h2 className="text-xl font-semibold text-black-secondary mb-0.5">
          Trip Itineraries
        </h2>
        <p className="text-xs font-medium text-gray-light mb-4">
          Your trip itineraries are placed here.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="mb-10">
            <FlightItinerarySection />
          </div>
          <div className="mb-10">
            <HotelItinerarySection />
          </div>
          <div className="">
            <AttractionsItinerarySection />
          </div>
        </div>
      </div>
    </div>
  );
}
