"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SideLink {
  label: string;
  href: string;
  icon: string; 
}

const sideLinks: SideLink[] = [
  {
    label: "Activities",
    href: "/activities",
    icon: "/RoadHorizon.svg", 
  },
  {
    label: "Hotels",
    href: "/hotels",
    icon: "/Buildings.svg", 
  },
  {
    label: "Flights",
    href: "/flights",
    icon: "/AirplaneTilt.svg", 
  },
  {
    label: "Study",
    href: "/study",
    icon: "/Student.svg", 
  },
  {
    label: "Visa",
    href: "/visa",
    icon: "/NewspaperClipping.svg", 
  },
  {
    label: "Immigration",
    href: "/immigration",
    icon: "/SuitcaseRolling.svg", 
  },
  {
    label: "Medical",
    href: "/medical",
    icon: "/FirstAidKit.svg", 
  },
  {
    label: "Vacation Packages",
    href: "/vacation-packages",
    icon: "/Package.svg", 
  },
];

const SideLinks: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      {sideLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
              isActive
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-light rounded-r-full" />
            )}

            {/* Icon */}
            <div className="w-5.5 h-5.5 relative shrink-0">
              <Image
                src={link.icon}
                alt={`${link.label} icon`}
                width={24}
                height={24}
                className={`${isActive ? "brightness-0 saturate-100" : ""}`}
              />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-medium ${
                isActive ? "text-blue-light" : "text-gray-light"
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
