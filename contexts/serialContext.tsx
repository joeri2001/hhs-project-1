"use client";

import React, { createContext, useContext } from "react";
import { useSerialConnection } from "@/components/microbit/lib/useSerialConnection";

interface SerialContextType {
  isConnected: boolean;
  error: string | null;
  port: SerialPort | null;
  connectToMicrobit: () => Promise<SerialPort | null>;
  closePort: () => Promise<void>;
}

const SerialContext = createContext<SerialContextType | undefined>(undefined);

export function SerialProvider({ children }: { children: React.ReactNode }) {
  const serialConnection = useSerialConnection();

  return (
    <SerialContext.Provider value={serialConnection}>
      {children}
    </SerialContext.Provider>
  );
}

export function useSerial() {
  const context = useContext(SerialContext);
  if (context === undefined) {
    throw new Error("useSerial must be used within a SerialProvider");
  }
  return context;
}
