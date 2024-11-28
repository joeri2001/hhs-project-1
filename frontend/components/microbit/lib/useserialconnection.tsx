'use client'

import { useState, useEffect } from 'react'

export function useSerialConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [port, setPort] = useState<SerialPort | null>(null)

  useEffect(() => {
    if (!('serial' in navigator)) {
      setError('Web Serial API is not supported in your browser.')
    }

    return () => {
      if (port) {
        port.close().catch(console.error)
      }
    }
  }, [port])

  const connectToMicrobit = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort()
      await selectedPort.open({ baudRate: 115200 })
      setPort(selectedPort)
      setIsConnected(true)
      setError(null)
      return selectedPort
    } catch (err) {
      setError('Failed to connect to the micro:bit. Make sure it\'s connected via USB and you have the correct permissions.')
      console.error('Serial connection error:', err)
      return null
    }
  }

  return { isConnected, error, port, connectToMicrobit }
}

