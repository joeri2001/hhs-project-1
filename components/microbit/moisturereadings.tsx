import React, { useEffect, useState } from "react";
import { MoistureReading } from "@/hooks/useMoistureSensor";

interface MoistureReadingsProps {
  serialNumber: string;
}

export function MoistureReadings({ serialNumber }: MoistureReadingsProps) {
  const [readings, setReadings] = useState<MoistureReading[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = async () => {
    try {
      const response = await fetch(
        `/api/getMoisture?serialNumber=${serialNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch moisture readings");
      }
      const data = await response.json();
      setReadings(data.moistureReadings.slice(-24).reverse());
    } catch (error) {
      console.error("Error fetching moisture readings:", error);
      setError("Failed to fetch moisture readings. Please try again.");
    }
  };

  useEffect(() => {
    fetchReadings();

    const intervalId = setInterval(fetchReadings, 10000);

    return () => clearInterval(intervalId);
  }, [serialNumber]);

  const maxMeasuredValue = Math.max(...readings.map((r) => r.value), 0);
  const maxValue = Math.ceil(maxMeasuredValue / 100) * 100;
  const yAxisLabels = Array.from(
    { length: maxValue / 100 + 1 },
    (_, i) => i * 100
  ).reverse();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Moisture Readings
        </h3>
        <p className="text-sm text-gray-600">
          Last 24 readings for Microbit {serialNumber}
        </p>
      </div>
      <div className="p-4">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {readings.length === 0 ? (
          <p className="text-gray-600">No readings available yet.</p>
        ) : (
          <div className="flex">
            <div className="flex flex-col justify-between pr-2 text-right h-80">
              {yAxisLabels.map((label) => (
                <span key={label} className="text-xs text-gray-500">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex-grow relative">
              <div className="absolute inset-0">
                <div className="h-full flex items-end">
                  {readings.map((reading) => {
                    const height = (reading.value / maxValue) * 100;
                    return (
                      <div
                        key={reading.id}
                        className="flex-1 flex flex-col items-center justify-end h-full"
                        title={`Value: ${reading.value.toFixed(2)}, Time: ${new Date(reading.timestamp).toLocaleString()}`}
                      >
                        <div
                          className="w-full bg-blue-200"
                          style={{ height: `${Math.max(height, 1)}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute left-0 right-0 bottom-0 flex justify-between mt-2 transform translate-y-full">
                {readings.map((reading) => (
                  <div
                    key={`label-${reading.id}`}
                    className="flex-1 overflow-hidden"
                  >
                    <span className="text-[8px] text-gray-500 inline-block transform -rotate-90 origin-top-left translate-y-4 whitespace-nowrap">
                      {new Date(reading.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-4"></div>
          </div>
        )}
      </div>
      <div className="h-16"></div>
    </div>
  );
}
