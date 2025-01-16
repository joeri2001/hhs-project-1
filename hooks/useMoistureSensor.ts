"use client";

import { useState, useEffect } from "react";

export function useMoistureSensor(port: SerialPort | null) {
  const [moisture, setMoisture] = useState<number | null>(null);
  const [microbitId, setMicrobitId] = useState<number | null>(null);

  useEffect(() => {
    if (!port) return;

    const readMoisture = async () => {
      const textDecoder = new TextDecoder();
      let buffer = "";

      while (port.readable) {
        const reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += textDecoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (line.startsWith("moisture")) {
                  const moisture = parseFloat(
                    line.replace("moisture", "").trim()
                  );
                  if (!isNaN(moisture)) {
                    setMoisture(moisture);
                  }
                }

                if (line.startsWith("serial")) {
                  const serialNumber = line.replace("serial", "").trim();
                  console.log("Serial:", serialNumber);
                  registerMicrobit(serialNumber);
                }
              }
            }
          }
        } catch (err) {
          console.error("Error reading from serial port:", err);
        } finally {
          reader.releaseLock();
        }
      }
    };

    const registerMicrobit = async (serialNumber: string) => {
      try {
        const response = await fetch("/api/microbit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serial_number: serialNumber }),
        });

        if (!response.ok) {
          throw new Error("Failed to register Microbit");
        }

        const data = await response.json();
        setMicrobitId(data.microbit.id);
      } catch (error) {
        console.error("Error registering Microbit:", error);
      }
    };

    readMoisture();
  }, [port]);

  return { moisture, microbitId };
}
