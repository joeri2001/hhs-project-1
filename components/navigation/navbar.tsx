"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PopUpButton from "../popupbutton/popupbutton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/stats", label: "Datapagina" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex justify-between w-full">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Blad Buddy
              </span>
            </div>
            <div className="ml-6 flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? "border-green-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div>
                <PopUpButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
