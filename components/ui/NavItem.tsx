import React from "react";
import Link from "next/link";
import Image from "next/image";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
};

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col gap-0.5 justify-center items-center"
    >
      <Image src={icon} alt={label} width={22} height={22} />
      <span
        className={`text-xs font-medium ${
          active ? "text-black-secondary" : "text-gray-light"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavItem;
