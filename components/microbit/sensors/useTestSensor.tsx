"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MoistureReading {
  value: number;
  timestamp: number;
}

export function useMoistureSensor(port: SerialPort | null) {
  const [moisture, setMoisture] = useState<number | null>(null);
  const [microbitId, setMicrobitId] = useState<number | null>(null);
  const [isMicrobitRegistered, setIsMicrobitRegistered] = useState(false);
  const moistureReadings = useRef<MoistureReading[]>([]);
  const lastAverageSent = useRef<number>(0);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );

  const registerMicrobit = useCallback(async (serialNumber: string) => {
    try {
      console.log(
        "Attempting to register Microbit with serial number:",
        serialNumber
      );
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
      console.log("Microbit registered successfully. Received data:", data);
      setMicrobitId(data.microbit.id);
      setIsMicrobitRegistered(true);
    } catch (error) {
      console.error("Error registering Microbit:", error);
    }
  }, []);

  const sendAverageMoisture = useCallback(
    async (averageMoisture: number) => {
      if (!microbitId) {
        console.error("Cannot send average moisture: microbitId is null");
        return;
      }

      try {
        console.log(
          `Sending average moisture: ${averageMoisture} for Microbit ID: ${microbitId}`
        );
        const response = await fetch("/api/moisture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            microbit_id: microbitId,
            average_moisture: averageMoisture,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send average moisture");
        }

        console.log("Average moisture sent successfully");
      } catch (error) {
        console.error("Error sending average moisture:", error);
      }
    },
    [microbitId]
  );

  const addMoistureReading = useCallback(
    (value: number) => {
      const now = Date.now();
      moistureReadings.current.push({ value, timestamp: now });

      moistureReadings.current = moistureReadings.current.filter(
        (reading) => now - reading.timestamp <= 60000
      );

      if (now - lastAverageSent.current >= 60000 && isMicrobitRegistered) {
        const average = calculateAverageMoisture();
        if (average !== null) {
          sendAverageMoisture(average);
          lastAverageSent.current = now;
        }
      }
    },
    [isMicrobitRegistered, sendAverageMoisture]
  );

  const calculateAverageMoisture = () => {
    if (moistureReadings.current.length === 0) return null;
    const sum = moistureReadings.current.reduce(
      (acc, reading) => acc + reading.value,
      0
    );
    return sum / moistureReadings.current.length;
  };

  useEffect(() => {
    if (!port) return;

    const textDecoder = new TextDecoder();
    let buffer = "";

    const processData = (chunk: Uint8Array) => {
      buffer += textDecoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("moisture")) {
          const moisture = parseFloat(line.replace("moisture", "").trim());
          if (!isNaN(moisture)) {
            setMoisture(moisture);
            addMoistureReading(moisture);
          }
        } else if (line.startsWith("serial")) {
          const serialNumber = line.replace("serial", "").trim();
          console.log("Received serial number:", serialNumber);
          registerMicrobit(serialNumber);
        }
      }
    };

    const readMoisture = async () => {
      while (port.readable) {
        try {
          if (readerRef.current) {
            await readerRef.current.cancel();
          }

          readerRef.current = port.readable.getReader();

          while (true) {
            const { value, done } = await readerRef.current.read();
            if (done) break;
            if (value) processData(value);
          }
        } catch (error) {
          console.error("Error reading from serial port:", error);
        } finally {
          if (readerRef.current) {
            try {
              readerRef.current.releaseLock();
            } catch (releaseError) {
              console.error("Error releasing lock:", releaseError);
            }
          }
          readerRef.current = null;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    readMoisture();

    return () => {
      if (readerRef.current) {
        readerRef.current.cancel().catch(console.error);
        try {
          readerRef.current.releaseLock();
        } catch (releaseError) {
          console.error("Error releasing lock during cleanup:", releaseError);
        }
      }
      readerRef.current = null;
    };
  }, [port, registerMicrobit, addMoistureReading]);

  return { moisture, microbitId, isMicrobitRegistered };
}
