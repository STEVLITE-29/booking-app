
import React from "react";
import SideLinks from "./ui/SideLink";
import { ChevronsUpDownIcon } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white w-66 h-[calc(100vh-120px)] p-4 flex flex-col rounded-sm sticky top-25">
      {/* Sidebar Links */}
      <div className="flex-1 mb-4 overflow-y-auto">
        <SideLinks />
      </div>

      {/* Bottom Section - Go Button and Personal Account */}
      <div className="bg-background-neutral rounded-sm p-3 flex items-center justify-between mt-auto">
        {/* Left side - Go button and text */}
        <div className="flex items-center gap-2">
          {/* Go Button */}
          <div className="bg-blue-600 rounded-sm w-11 h-10.5 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Go</span>
          </div>

          {/* Personal Account Text */}
          <h2 className="text-gray-500 text-xs font-medium">
            Personal Account
          </h2>
        </div>

        {/* Right side - Arrows */}
        <ChevronsUpDownIcon className="w-6 h-6 text-[#667185]" />
      </div>
    </div>
  );
};

export default Sidebar;
