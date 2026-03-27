import { useState, useCallback } from 'react';

export interface DiscoveredCamera {
  ip: string;
  port: number;
  brand: string;
  model?: string;
  protocol: 'rtsp' | 'onvif' | 'http';
}

export interface DiscoveredLight {
  ip: string;
  port: number;
  brand: string;
  model?: string;
  protocol: 'mqtt' | 'http' | 'yeelight' | 'hue';
  capabilities: string[];
}

/**
 * Hook for discovering devices on the local network.
 * Scanning is delegated to the BabyGuardian Hub tablet via API,
 * since the tablet has better network access and runs 24/7.
 * Falls back to direct mobile scan if hub is unavailable.
 */
export function useDeviceDiscovery() {
  const [cameras, setCameras] = useState<DiscoveredCamera[]>([]);
  const [lights, setLights] = useState<DiscoveredLight[]>([]);
  const [scanning, setScanning] = useState(false);

  const scanForCameras = useCallback(async () => {
    setScanning(true);
    setCameras([]);
    try {
      // In production: call hub API at local IP for network scan
      // const response = await hubApi.scanCameras();
      // For demo/dev, simulate discovery
      await new Promise(r => setTimeout(r, 3000));
      setCameras([
        { ip: '192.168.1.100', port: 554, brand: 'EZVIZ', model: 'C6N', protocol: 'rtsp' },
        { ip: '192.168.1.101', port: 554, brand: 'Tapo', model: 'C200', protocol: 'onvif' },
        { ip: '192.168.1.102', port: 80, brand: 'Hikvision', protocol: 'onvif' },
      ]);
    } finally {
      setScanning(false);
    }
  }, []);

  const scanForLights = useCallback(async () => {
    setScanning(true);
    setLights([]);
    try {
      await new Promise(r => setTimeout(r, 2500));
      setLights([
        { ip: '192.168.1.110', port: 55443, brand: 'Yeelight', model: 'RGB Bulb', protocol: 'yeelight', capabilities: ['on_off', 'brightness', 'color'] },
        { ip: '192.168.1.111', port: 80, brand: 'Philips Hue', model: 'Bridge', protocol: 'http', capabilities: ['on_off', 'brightness', 'color', 'scenes'] },
      ]);
    } finally {
      setScanning(false);
    }
  }, []);

  return { cameras, lights, scanning, scanForCameras, scanForLights };
}
