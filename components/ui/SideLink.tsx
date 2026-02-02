"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface SideLink {
  label: string;
  href: string;
  icon: string;
}

const sideLinks: SideLink[] = [
  { label: "Activities", href: "/activities", icon: "/RoadHorizon.svg" },
  { label: "Hotels", href: "/hotels", icon: "/Buildings.svg" },
  { label: "Flights", href: "/flights", icon: "/AirplaneTilt.svg" },
  { label: "Study", href: "/study", icon: "/Student.svg" },
  { label: "Visa", href: "/visa", icon: "/NewspaperClipping.svg" },
  { label: "Immigration", href: "/immigration", icon: "/SuitcaseRolling.svg" },
  { label: "Medical", href: "/medical", icon: "/FirstAidKit.svg" },
  {
    label: "Vacation Packages",
    href: "/vacation-packages",
    icon: "/Package.svg",
  },
];

const SideLinks: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {sideLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-lg
              transition
              group
              ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {/* Animated Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
              />
            )}

            <Image
              src={link.icon}
              alt={link.label}
              width={22}
              height={22}
              className="shrink-0 transition-transform group-hover:scale-110"
            />

            <span
              className={`text-sm font-medium truncate ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SideLinks;
