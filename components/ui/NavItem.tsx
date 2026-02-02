"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
};

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-1 cursor-pointer"
      >
        <Image src={icon} alt={label} width={22} height={22} />
        <span
          className={`text-xs font-medium transition-colors ${
            active ? "text-black-secondary" : "text-gray-light"
          }`}
        >
          {label}
        </span>

        {/* Active indicator */}
        {active && (
          <motion.div
            layoutId="nav-indicator"
            className="w-4 h-0.5 bg-black-secondary rounded-full"
          />
        )}
      </motion.div>
    </Link>
  );
};

export default NavItem;
