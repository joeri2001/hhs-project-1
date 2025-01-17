"use client";

import { useState, useEffect } from "react";

export function useMoistureSensor(port: SerialPort | null) {
  const [moisture, setMoisture] = useState<number | null>(null);

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
                  const serialValue = line.replace("serial", "").trim();
                  console.log("Serial:", serialValue);
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

    readMoisture();
  }, [port]);

  return moisture;
}
