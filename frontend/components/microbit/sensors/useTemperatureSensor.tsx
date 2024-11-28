'use client'

import { useState, useEffect } from 'react'

export function useTemperatureSensor(port: SerialPort | null) {
  const [temperature, setTemperature] = useState<number | null>(null)

  useEffect(() => {
    if (!port) return

    const readTemperature = async () => {
      while (port.readable) {
        const reader = port.readable.getReader()
        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const decoded = new TextDecoder().decode(value)
            const temp = parseFloat(decoded)
            if (!isNaN(temp)) {
              setTemperature(temp)
            }
          }
        } catch (err) {
          console.error('Error reading from serial port:', err)
        } finally {
          reader.releaseLock()
        }
      }
    }

    readTemperature()
  }, [port])

  return temperature
}
