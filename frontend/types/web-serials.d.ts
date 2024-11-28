interface SerialPort {
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<Uint8Array>;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
  }
  
  interface SerialOptions {
    baudRate: number;
  }
  
  interface Navigator {
    serial: {
      requestPort(): Promise<SerialPort>;
    };
  }
  
  