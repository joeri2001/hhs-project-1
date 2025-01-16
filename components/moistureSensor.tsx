"use client";

import { useState } from "react";
import { useMoistureSensor } from "../hooks/useMoistureSensor";

export function MoistureSensor() {
  const [port, setPort] = useState<SerialPort | null>(null);
  const { moisture, microbitId } = useMoistureSensor(port);

  const connectToDevice = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
    } catch (err) {
      console.error("Error connecting to device:", err);
    }
  };

  return (
    <div>
      <button onClick={connectToDevice}>Connect to Microbit</button>
      {port && <p>Connected to Microbit</p>}
      {microbitId && <p>Microbit ID: {microbitId}</p>}
      {moisture !== null && <p>Moisture: {moisture}</p>}
    </div>
  );
}
