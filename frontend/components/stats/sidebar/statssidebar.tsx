"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/stats", label: "Mijn plant" },
  { href: "/stats/microbit", label: "Link Microbit" },
];

export default function StatsSidebar() {
  const pathname = usePathname();

  return (
    <div className={"w-56 h-screen bg-green-600 text-white p-5"}>
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-1 pt-1 text-lg font-medium ${pathname === item.href ? "underline" : "decoration-none"}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
