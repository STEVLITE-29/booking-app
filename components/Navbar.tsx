"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

import SearchBar from "./ui/SearchBar";
import NavItem from "./ui/NavItem";
import Button from "./ui/Button";
import { useEffect } from "react";
import { loadExchangeRates } from "@/utils/price-helpers";
import { getExchangeRates } from "@/services/metaService";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Load exchange rates on app start (non-blocking)
    (async () => {
      try {
        await loadExchangeRates(getExchangeRates, "USD");
        // console.log("Exchange rates loaded");
      } catch (e) {
        console.warn("Failed to load exchange rates on startup", e);
      }
    })();
  }, []);

  return (
    <header className="bg-background border-b border-gray-100 sticky top-0 z-50">
      <div className="px-5 py-4 flex items-center justify-between max-w-360 mx-auto">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={37} height={37} />

          {/* Search hidden on small screens */}
          <div className="hidden lg:block">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          <NavItem href="/" icon="/House.svg" label="Home" />
          <NavItem href="/" icon="/ChartPieSlice.svg" label="Dashboard" />
          <NavItem href="/" icon="/Wallet.svg" label="Wallet" />
          <NavItem href="/" icon="/ListChecks.svg" label="Plan a trip" active />
          <NavItem href="/" icon="/HandCoins.svg" label="Commission for life" />

          <div className="h-10 w-px bg-gray-200" />

          <Button variant="primary" size="md">
            Subscribe
          </Button>

          <NavItem href="#" icon="/Bell.svg" label="Notification" />
          <NavItem href="#" icon="/Basket.svg" label="Cart" />
          <NavItem href="#" icon="/PlusSquare.svg" label="Create" />

          {/* Profile */}
          <button className="flex items-center gap-2">
            <Image
              src="/avatar.svg"
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <ChevronDown className="w-5 h-5 text-gray-light" />
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="xl:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="xl:hidden overflow-hidden border-t border-gray-100 bg-background"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.05 }}
              className="px-5 py-6 space-y-6"
            >
              <SearchBar />

              <div className="grid grid-cols-3 gap-4">
                <NavItem href="#" icon="/House.svg" label="Home" />
                <NavItem href="#" icon="/ChartPieSlice.svg" label="Dashboard" />
                <NavItem href="#" icon="/Wallet.svg" label="Wallet" />
                <NavItem
                  href="#"
                  icon="/ListChecks.svg"
                  label="Plan a trip"
                  active
                />
                <NavItem href="#" icon="/HandCoins.svg" label="Commission" />
                <NavItem href="#" icon="/Bell.svg" label="Alerts" />
                <NavItem href="#" icon="/Basket.svg" label="Cart" />
                <NavItem href="#" icon="/PlusSquare.svg" label="Create" />
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Subscribe
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
