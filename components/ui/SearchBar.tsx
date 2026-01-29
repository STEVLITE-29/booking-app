"use client";

import React, { useState } from "react";
import Image from "next/image";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative h-8.75">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Image
            src="/SearchIcon.svg"
            alt="Search Icon"
            width={16}
            height={16}
          />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="
            h-8.75
            w-full
            pl-9 pr-3
            text-sm
            rounded-xs
            bg-background-neutral
            text-gray-light
            placeholder-gray-light
            border border-transparent
            focus:outline-none
            focus:ring-2 focus:ring-blue-light
            transition
            duration-200
          "
        />
      </div>
    </div>
  );
};

export default SearchBar;
