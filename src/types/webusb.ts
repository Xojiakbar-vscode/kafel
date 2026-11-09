// ============================================================
// WebUSB Type Definitions for TypeScript
// ============================================================

export interface USBEndpoint {
  endpointNumber: number;
  direction: 'in' | 'out';
  type: 'bulk' | 'interrupt' | 'isochronous';
}

export interface USBAlternateInterface {
  alternateSetting: number;
  endpoints: USBEndpoint[];
}

export interface USBInterface {
  interfaceNumber: number;
  alternates: USBAlternateInterface[];
}

export interface USBConfiguration {
  configurationValue: number;
  interfaces: USBInterface[];
}

export interface USBDevice {
  opened: boolean;
  productName?: string;
  vendorId: number;
  productId: number;
  configuration?: USBConfiguration;
  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferOut(endpointNumber: number, data: BufferSource | Uint8Array): Promise<unknown>;
}

export interface USBDeviceRequestOptions {
  filters: Array<{
    vendorId?: number;
    productId?: number;
    classCode?: number;
    subclassCode?: number;
    protocolCode?: number;
    serialNumber?: string;
  }>;
}

export interface USB {
  requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
  getDevices(): Promise<USBDevice[]>;
}

declare global {
  interface Navigator {
    usb?: USB;
  }
}
