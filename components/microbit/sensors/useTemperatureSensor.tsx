"use client";

import { useState, useEffect } from "react";

export function useTemperatureSensor(port: SerialPort | null) {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    if (!port) return;

    const readTemperature = async () => {
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
                const temp = parseFloat(line.trim());
                if (!isNaN(temp)) {
                  setTemperature(temp);
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

    readTemperature();
  }, [port]);

  return temperature;
}
