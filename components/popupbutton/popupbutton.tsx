"use client";

import { useState } from "react";
import MicrobitReader from "../microbit/microbitreader";

export default function PopUpButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 py-5 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
          <div className="mt-8">
            <MicrobitReader />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 mt-3 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg"
        >
          BladBuddy
        </button>
      </div>
    </>
  );
}
