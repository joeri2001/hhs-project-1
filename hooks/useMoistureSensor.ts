"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface MoistureReading {
  id: number;
  value: number;
  timestamp: string;
}

export interface UseMoistureSensorResult {
  moisture: number | null;
  microbitSerialNumber: string | null;
  isMicrobitRegistered: boolean;
  moistureReadings: MoistureReading[];
  fetchMoistureReadings: () => Promise<void>;
  error: string | null;
}

export function useMoistureSensor(
  port: SerialPort | null
): UseMoistureSensorResult {
  const [moisture, setMoisture] = useState<number | null>(null);
  const [microbitSerialNumber, setMicrobitSerialNumber] = useState<
    string | null
  >(null);
  const [isMicrobitRegistered, setIsMicrobitRegistered] = useState(false);
  const [moistureReadings, setMoistureReadings] = useState<MoistureReading[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const accumulatedReadings = useRef<number[]>([]);
  const lastAverageSent = useRef<number>(0);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const registrationAttempts = useRef<number>(0);

  const registerMicrobit = useCallback(async (serialNumber: string) => {
    if (registrationAttempts.current >= 3) {
      setError(
        "Max registration attempts reached. Please reconnect the Microbit."
      );
      return;
    }

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
      setMicrobitSerialNumber(serialNumber);
      setIsMicrobitRegistered(true);
      setError(null);
      registrationAttempts.current = 0;
    } catch (error) {
      console.error("Error registering Microbit:", error);
      setIsMicrobitRegistered(false);
      setError("Failed to register Microbit. Retrying...");
      registrationAttempts.current++;

      // Retry registration after a delay
      setTimeout(() => registerMicrobit(serialNumber), 5000);
    }
  }, []);

  const sendAverageMoisture = useCallback(async () => {
    if (!microbitSerialNumber || accumulatedReadings.current.length === 0) {
      return;
    }

    const averageMoisture =
      accumulatedReadings.current.reduce((a, b) => a + b, 0) /
      accumulatedReadings.current.length;
    accumulatedReadings.current = [];

    try {
      console.log(
        `Sending average moisture: ${averageMoisture.toFixed(2)} for Microbit Serial Number: ${microbitSerialNumber}`
      );
      const response = await fetch("/api/moisture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: microbitSerialNumber,
          average_moisture: averageMoisture,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send average moisture");
      }

      console.log("Average moisture sent successfully");
      lastAverageSent.current = Date.now();
    } catch (error) {
      console.error("Error sending average moisture:", error);
      setError("Failed to send average moisture. Will retry on next reading.");
    }
  }, [microbitSerialNumber]);

  const fetchMoistureReadings = useCallback(async () => {
    if (!microbitSerialNumber) {
      console.error(
        "Cannot fetch moisture readings: microbitSerialNumber is null"
      );
      return;
    }

    try {
      const response = await fetch(
        `/api/getMoisture?serialNumber=${microbitSerialNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch moisture readings");
      }
      const data = await response.json();
      setMoistureReadings(data.moistureReadings);
    } catch (error) {
      console.error("Error fetching moisture readings:", error);
      setError("Failed to fetch moisture readings. Please try again.");
    }
  }, [microbitSerialNumber]);

  useEffect(() => {
    if (microbitSerialNumber) {
      fetchMoistureReadings();
    }
  }, [microbitSerialNumber, fetchMoistureReadings]);

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
            if (isMicrobitRegistered && microbitSerialNumber) {
              accumulatedReadings.current.push(moisture);
              if (Date.now() - lastAverageSent.current >= 60000) {
                sendAverageMoisture();
              }
            }
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
          setError("Error reading from Microbit. Please reconnect the device.");
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
  }, [
    port,
    registerMicrobit,
    sendAverageMoisture,
    isMicrobitRegistered,
    microbitSerialNumber,
  ]);

  return {
    moisture,
    microbitSerialNumber,
    isMicrobitRegistered,
    moistureReadings,
    fetchMoistureReadings,
    error,
  };
}
