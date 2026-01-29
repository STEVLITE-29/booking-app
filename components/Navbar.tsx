
import React from "react";
import Image from "next/image";
import SearchBar from "./ui/SearchBar";
import NavItem from "./ui/NavItem";
import Button from "./ui/Button";
import { ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <div className="bg-background py-5 px-5 flex justify-between items-center">
      {/* Left side, Logo and Search bar */}
      <div className="flex gap-4 items-center">
        <Image src="/logo.svg" alt="Logo image" height={37} width={37}></Image>
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex gap-5.5 items-center">
        <NavItem href="#" icon="/House.svg" label="Home" />
        <NavItem href="#" icon="/ChartPieSlice.svg" label="Dashboard" />
        <NavItem href="#" icon="/Wallet.svg" label="Wallet" />
        <NavItem href="#" icon="/ListChecks.svg" label="Plan a trip" active />
        <NavItem href="#" icon="/HandCoins.svg" label="Commission for life" />
        <div className="h-12 w-px bg-[#98A2B3]"></div>
        <Button variant="primary" size="md">
          Subscribe
        </Button>
        <NavItem href="#" icon="/Bell.svg" label="Notification" />
        <NavItem href="#" icon="/Basket.svg" label="Cart" />
        <NavItem href="#" icon="/PlusSquare.svg" label="Create" />
        {/* User Profile */}
        <button className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src="/avatar.svg"
              alt="avatar image"
              width={40}
              height={40}
              className="object-center"
            />
          </div>

          <ChevronDown className="w-5.5 h-5.5 text-gray-light" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
