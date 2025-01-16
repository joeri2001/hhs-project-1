"use client";

import { useSerialConnection } from "./lib/useserialconnection";
import { useMoistureSensor } from "./sensors/useTestSensor";

export default function MicrobitReader() {
  const { isConnected, error, port, connectToMicrobit } = useSerialConnection();
  const { moisture } = useMoistureSensor(port);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Moisture sensor</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <p className="text-lg font-semibold">
            Current Moist: {moisture !== null ? `${moisture}` : "Reading..."}
          </p>
        </div>
      )}
    </div>
  );
}
