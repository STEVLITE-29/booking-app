import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Info,
} from "lucide-react";
import { Attraction, TimeSlot } from "@/services/attractionService";
import { useAttractionStore } from "@/store/attractionStore";
import { useItineraryStore } from "@/store/itineraryStore";
import * as attractionService from "@/services/attractionService";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AttractionDetailsModalProps {
  attraction: Attraction;
  isOpen: boolean;
  onClose: () => void;
}

const AttractionDetailsModal: React.FC<AttractionDetailsModalProps> = ({
  attraction,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "overview" | "availability" | "reviews"
  >("overview");
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    attractionDetails,
    setAttractionDetails,
    availabilityCalendar,
    setAvailabilityCalendar,
    timeSlots,
    setTimeSlots,
    reviews,
    setReviews,
    isLoadingDetails,
    setIsLoadingDetails,
    isLoadingAvailability,
    setIsLoadingAvailability,
    isLoadingReviews,
    setIsLoadingReviews,
  } = useAttractionStore();

  const { currentTrip, addActivity } = useItineraryStore();

  const loadDetails = useCallback(async () => {
    setIsLoadingDetails(true);
    try {
      const response = await attractionService.getAttractionDetails(
        attraction.slug,
      );
      setAttractionDetails(response.data);
    } catch (error) {
      console.error("Error loading attraction details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [attraction.slug, setAttractionDetails, setIsLoadingDetails]);

  const loadAvailabilityCalendar = useCallback(async () => {
    try {
      const response = await attractionService.getAvailabilityCalendar(
        attraction.id,
      );
      setAvailabilityCalendar(response.data);
    } catch (error) {
      console.error("Error loading calendar:", error);
    }
  }, [attraction.id, setAvailabilityCalendar]);

  const loadAvailability = useCallback(async () => {
    if (!selectedDate) return;

    setIsLoadingAvailability(true);
    try {
      const response = await attractionService.getAvailability(
        attraction.slug,
        selectedDate,
      );
      setTimeSlots(response.data);
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [attraction.slug, selectedDate, setIsLoadingAvailability, setTimeSlots]);

  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      const response = await attractionService.getAttractionReviews(
        attraction.id,
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [attraction.id, setIsLoadingReviews, setReviews]);

  useEffect(() => {
    if (isOpen) {
      loadDetails();
      loadAvailabilityCalendar();
      loadReviews();
      setImageError(false); // Reset image error state when modal opens
    }
  }, [isOpen, loadDetails, loadAvailabilityCalendar, loadReviews]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate, loadAvailability]);

  const nextImage = () => {
    if (attractionDetails?.photos) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % attractionDetails.photos.length,
      );
      setImageError(false); // Reset error when changing images
    }
  };

  const prevImage = () => {
    if (attractionDetails?.photos) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + attractionDetails.photos.length) %
          attractionDetails.photos.length,
      );
      setImageError(false); // Reset error when changing images
    }
  };

  const handleAddToItinerary = () => {
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

    if (bookedDates.length === 0) {
      alert("Please select at least one date for this activity.");
      return;
    }

    setIsAdding(true);

    // Add attraction to itinerary with booked dates
    addActivity(
      attraction,
      selectedDate || undefined,
      selectedTimeSlot?.start,
      ticketQuantity,
      bookedDates,
    );

    // Show success message
    setTimeout(() => {
      setIsAdding(false);
      alert(
        `Activity added to your itinerary!${
          bookedDates.length > 0
            ? `\nDates: ${bookedDates.map((d) => formatDate(d)).join(", ")}`
            : ""
        }${
          selectedTimeSlot
            ? `\nTime: ${formatTime(selectedTimeSlot.start)}`
            : ""
        }${ticketQuantity > 1 ? `\nTickets: ${ticketQuantity}` : ""}`,
      );
      onClose(); // Close the modal after adding
    }, 500);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  const totalPrice = selectedTimeSlot
    ? selectedTimeSlot.timeSlotOffers[0]?.items[0]?.price.chargeAmount *
      ticketQuantity
    : 0;

  const currentImageUrl =
    imageError ||
    !attractionDetails?.photos ||
    attractionDetails.photos.length === 0
      ? "/fallbackAttractionImage.jpg"
      : attractionDetails.photos[currentImageIndex].medium;

  const isAlreadyAdded = currentTrip?.activities.some(
    (a) => a.id === attraction.id,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10 rounded-t-lg">
          <h2 className="text-lg font-bold text-black-secondary">
            {attraction.name}
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-background-neutral rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-gray" />
            </button>
            <button className="p-2 hover:bg-background-neutral rounded-lg transition-colors">
              <Heart className="w-4 h-4 text-gray" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-neutral rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Image Gallery */}
          <div className="relative mb-6 rounded-lg overflow-hidden bg-background-neutral">
            {isLoadingDetails ? (
              <div className="h-80 bg-background-neutral animate-pulse flex items-center justify-center">
                <p className="text-gray-light text-sm">Loading images...</p>
              </div>
            ) : (
              <>
                <Image
                  src={currentImageUrl}
                  alt={attraction.name}
                  width={1200}
                  height={600}
                  className="w-full h-80 object-cover"
                  onError={() => setImageError(true)}
                />
                {attractionDetails?.photos &&
                  attractionDetails.photos.length > 1 &&
                  !imageError && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-dark" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-dark" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <p className="text-white text-xs font-medium">
                          {currentImageIndex + 1} /{" "}
                          {attractionDetails.photos.length}
                        </p>
                      </div>
                    </>
                  )}
              </>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 mb-6">
            {attraction.reviewsStats && (
              <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 text-rating fill-current" />
                <span className="font-bold text-xs text-gray-dark">
                  {attraction.reviewsStats.combinedNumericStats.average.toFixed(
                    1,
                  )}
                </span>
                <span className="text-xs text-gray-light">
                  ({attraction.reviewsStats.allReviewsCount} reviews)
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-light" />
              <span className="font-semibold text-xs text-gray-dark">
                {attraction.ufiDetails.bCityName}
              </span>
            </div>
            {attraction.cancellationPolicy.hasFreeCancellation && (
              <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-xs text-gray-dark">
                  Free Cancellation
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-5 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2.5 px-1 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "text-blue-light border-b-2 border-blue-light"
                  : "text-gray-light hover:text-gray-dark"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`pb-2.5 px-1 font-medium text-sm transition-colors ${
                activeTab === "availability"
                  ? "text-blue-light border-b-2 border-blue-light"
                  : "text-gray-light hover:text-gray-dark"
              }`}
            >
              Book Now
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2.5 px-1 font-medium text-sm transition-colors ${
                activeTab === "reviews"
                  ? "text-blue-light border-b-2 border-blue-light"
                  : "text-gray-light hover:text-gray-dark"
              }`}
            >
              Reviews ({attraction.reviewsStats?.allReviewsCount || 0})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {isLoadingDetails ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-background-neutral rounded w-3/4"></div>
                  <div className="h-3 bg-background-neutral rounded w-full"></div>
                  <div className="h-3 bg-background-neutral rounded w-5/6"></div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-black-secondary mb-2">
                      Description
                    </h3>
                    <p className="text-xs text-gray-light leading-relaxed">
                      {attractionDetails?.description ||
                        attraction.shortDescription}
                    </p>
                  </div>

                  {attractionDetails?.whatsIncluded &&
                    attractionDetails.whatsIncluded.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-black-secondary mb-2">
                          What&apos;s Included
                        </h3>
                        <ul className="space-y-1.5">
                          {attractionDetails.whatsIncluded.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-dark">
                                  {item}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {attractionDetails?.notIncluded &&
                    attractionDetails.notIncluded.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-black-secondary mb-2">
                          Not Included
                        </h3>
                        <ul className="space-y-1.5">
                          {attractionDetails.notIncluded.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              <span className="text-xs text-gray-dark">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {attractionDetails?.additionalInfo && (
                    <div className="bg-accent border border-blue-light/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-light shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-xs text-gray-dark mb-1">
                            Important Information
                          </h4>
                          <p className="text-xs text-gray-light leading-relaxed">
                            {attractionDetails.additionalInfo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "availability" && (
            <div className="space-y-5">
              {/* Date Selection */}
              <div>
                <h3 className="text-sm font-bold text-black-secondary mb-3">
                  Select Dates (Click to select multiple days)
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {availabilityCalendar.slice(0, 21).map((day) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        if (day.available) {
                          if (bookedDates.includes(day.date)) {
                            setBookedDates(
                              bookedDates.filter((d) => d !== day.date),
                            );
                          } else {
                            setBookedDates([...bookedDates, day.date].sort());
                          }
                          setSelectedDate(day.date);
                        }
                      }}
                      disabled={!day.available}
                      className={`p-2 rounded-lg text-center transition-all ${
                        bookedDates.includes(day.date)
                          ? "bg-blue-light text-white shadow-sm border-2 border-blue-600"
                          : day.available
                            ? "bg-white border border-gray-200 hover:border-blue-light text-gray-dark"
                            : "bg-background-neutral text-gray-light cursor-not-allowed"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {formatDate(day.date)}
                      </div>
                    </button>
                  ))}
                </div>
                {bookedDates.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      Selected Dates ({bookedDates.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bookedDates.map((date) => (
                        <span
                          key={date}
                          className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-lg text-xs text-gray-700 border border-blue-200"
                        >
                          {formatDate(date)}
                          <button
                            onClick={() =>
                              setBookedDates(
                                bookedDates.filter((d) => d !== date),
                              )
                            }
                            className="text-blue-600 hover:text-red-600 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-sm font-bold text-black-secondary mb-3">
                    Select a Time
                  </h3>
                  {isLoadingAvailability ? (
                    <div className="text-center py-6 text-gray-light text-sm">
                      Loading time slots...
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.timeSlotId}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-lg text-left transition-all ${
                            selectedTimeSlot?.timeSlotId === slot.timeSlotId
                              ? "bg-blue-light text-white shadow-sm"
                              : "bg-white border border-gray-200 hover:border-blue-light"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold text-sm">
                                {formatTime(slot.start)}
                              </span>
                            </div>
                            {slot.timeSlotOffers[0]?.items[0] && (
                              <span className="font-bold text-sm">
                                {formatPrice(
                                  slot.timeSlotOffers[0].items[0].price
                                    .chargeAmount,
                                  slot.timeSlotOffers[0].items[0].price
                                    .currency,
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-80">
                            {slot.timeSlotOffers[0]?.label || "Standard Ticket"}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-light text-sm">
                      No time slots available for this date
                    </div>
                  )}
                </div>
              )}

              {/* Ticket Quantity */}
              {selectedTimeSlot && (
                <div>
                  <h3 className="text-sm font-bold text-black-secondary mb-3">
                    Number of Tickets
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setTicketQuantity(Math.max(1, ticketQuantity - 1))
                      }
                      className="w-10 h-10 bg-accent text-blue-light rounded-lg font-bold hover:bg-blue-light hover:text-white transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-dark w-12 text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      className="w-10 h-10 bg-accent text-blue-light rounded-lg font-bold hover:bg-blue-light hover:text-white transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              {selectedTimeSlot && (
                <div className="bg-accent border border-blue-light/20 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-black-secondary mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-light">Date:</span>
                      <span className="font-medium text-gray-dark">
                        {formatDate(selectedDate!)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-light">Time:</span>
                      <span className="font-medium text-gray-dark">
                        {formatTime(selectedTimeSlot.start)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-light">Tickets:</span>
                      <span className="font-medium text-gray-dark">
                        {ticketQuantity}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-gray-dark">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-blue-light">
                        {formatPrice(
                          totalPrice,
                          selectedTimeSlot.timeSlotOffers[0].items[0].price
                            .currency,
                        )}
                      </span>
                    </div>
                    <button
                      onClick={handleAddToItinerary}
                      disabled={isAdding || isAlreadyAdded}
                      className={`w-full py-3 rounded-lg font-semibold text-sm shadow-sm transition-colors ${
                        isAlreadyAdded
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : isAdding
                            ? "bg-blue-400 text-white cursor-wait"
                            : "bg-blue-light text-white hover:bg-blue-dark"
                      }`}
                    >
                      {isAlreadyAdded
                        ? "Already in Itinerary"
                        : isAdding
                          ? "Adding to Itinerary..."
                          : "Add to Itinerary"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {isLoadingReviews ? (
                <div className="text-center py-6 text-gray-light text-sm">
                  Loading reviews...
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-background-neutral rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            {review.user?.avatar ? (
                              <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-blue-light font-semibold text-sm">
                                  {review.user?.name?.[0] || "?"}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-sm text-gray-dark">
                                {review.user?.name || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-light">
                                {new Date(review.epochMs).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-accent px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-rating fill-current" />
                          <span className="font-bold text-xs text-gray-dark">
                            {review.numericRating}
                          </span>
                        </div>
                      </div>
                      {review.content && (
                        <p className="text-xs text-gray-dark leading-relaxed">
                          {review.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-light text-sm">
                  No reviews yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionDetailsModal;
