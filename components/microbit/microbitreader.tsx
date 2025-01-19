"use client";

import { useSerialConnection } from "./lib/useserialconnection";
import { useMoistureSensor } from "@/hooks/useMoistureSensor";
import { MoistureReadings } from "./moisturereadings";

export default function MicrobitReader() {
  const {
    isConnected,
    error: connectionError,
    port,
    connectToMicrobit,
  } = useSerialConnection();
  const {
    moisture,
    microbitSerialNumber,
    isMicrobitRegistered,
    error: sensorError,
  } = useMoistureSensor(port);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Moisture sensor</h2>
      {connectionError && (
        <p className="text-red-500 mb-4">{connectionError}</p>
      )}
      {sensorError && <p className="text-red-500 mb-4">{sensorError}</p>}
      {!isConnected && (
        <button
          onClick={connectToMicrobit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Connect to micro:bit (USB)
        </button>
      )}
      {isConnected && (
        <div>
          {isMicrobitRegistered && microbitSerialNumber ? (
            <p className="text-green-600 font-semibold mb-2">
              Connected Microbit Serial Number: {microbitSerialNumber}
            </p>
          ) : (
            <p className="text-yellow-600 font-semibold mb-2">
              Microbit connected, waiting for registration...
            </p>
          )}
          <p className="text-lg font-semibold">
            Current Moisture:{" "}
            {moisture !== null ? `${moisture.toFixed(2)}` : "Reading..."}
          </p>
          {microbitSerialNumber && (
            <MoistureReadings serialNumber={microbitSerialNumber} />
          )}
        </div>
      )}
    </div>
  );
}
