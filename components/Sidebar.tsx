"use client";

import React, { useState } from "react";
import SideLinks from "./ui/SideLink";
import { ChevronsUpDownIcon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            items-center
            gap-2
            bg-white
            border
            border-gray-200
            rounded-lg
            px-4
            py-3
            w-full
            hover:bg-gray-50
            transition
          "
        >
          {open ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {open ? "Hide Menu" : "Show Menu"}
          </span>
        </button>
      </div>

      {/* Sidebar Container */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -40, opacity: 0, height: 0 }}
            animate={{ x: 0, opacity: 1, height: "auto" }}
            exit={{ x: -40, opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              bg-white
              w-full
              lg:w-62
              lg:h-[calc(100vh-120px)]
              p-4
              flex
              flex-col
              rounded-lg
              lg:sticky
              lg:top-25
              border
              border-gray-200
              lg:border-0
            "
          >
            {/* Links */}
            <div className="flex-1 mb-4 overflow-y-auto">
              <SideLinks />
            </div>

            {/* Bottom Account Section */}
            <button
              className="
                bg-background-neutral
                rounded-lg
                p-3
                flex
                items-center
                justify-between
                mt-auto
                hover:bg-gray-100
                transition
              "
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">Go</span>
                </div>
                <h2 className="text-gray-500 text-xs font-medium truncate">
                  Personal Account
                </h2>
              </div>

              <ChevronsUpDownIcon className="w-5 h-5 text-[#667185] shrink-0" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
