"use client";

import { useState, useEffect, useRef } from "react";

export function useSerialConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  useEffect(() => {
    if (!("serial" in navigator)) {
      setError("Web Serial API is not supported in your browser.");
    }

    return () => {
      closePort();
    };
  }, []);

  const closePort = async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current = null;
    }
    if (portRef.current) {
      await portRef.current.close();
      portRef.current = null;
    }
    setIsConnected(false);
  };

  const connectToMicrobit = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      portRef.current = selectedPort;
      setIsConnected(true);
      setError(null);
      return selectedPort;
    } catch {
      setError(
        "Failed to connect to the micro:bit. Make sure it's connected via USB and you have the correct permissions."
      );
      return null;
    }
  };

  return {
    isConnected,
    error,
    port: portRef.current,
    connectToMicrobit,
    closePort,
  };
}
