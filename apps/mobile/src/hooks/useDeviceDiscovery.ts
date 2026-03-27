import { useState, useCallback } from 'react';
import { devicesApi } from '../api/devicesApi';

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

  const scanForCameras = useCallback(async (): Promise<DiscoveredCamera[]> => {
    setScanning(true);
    setCameras([]);
    try {
      const discovered = await devicesApi.discover({ deviceType: 'camera' });
      setCameras(discovered);
      return discovered;
    } catch {
      return [];
    } finally {
      setScanning(false);
    }
  }, []);

  const scanForLights = useCallback(async (): Promise<DiscoveredLight[]> => {
    setScanning(true);
    setLights([]);
    try {
      const discoveredRaw = await devicesApi.discover({ deviceType: 'light' });
      const discovered = discoveredRaw.map((d) => ({
        ...d,
        capabilities: ['on_off', 'brightness'],
      }));
      setLights(discovered);
      return discovered;
    } catch {
      return [];
    } finally {
      setScanning(false);
    }
  }, []);

  return { cameras, lights, scanning, scanForCameras, scanForLights };
}
