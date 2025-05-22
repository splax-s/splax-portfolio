import { UAParser } from 'ua-parser-js';
import { OsType } from '@/store/useOsStore';


export const detectOS = (): OsType => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return 'mac'; // Default to Mac in SSR
  }

  const parser = new UAParser();
  const os = parser.getOS();
  const device = parser.getDevice();

  // Check for mobile devices first
  if (device.type === 'mobile' || device.type === 'tablet') {
    if (os.name?.toLowerCase().includes('ios') || os.name?.toLowerCase() === 'mac os') {
      return 'ios';
    } else {
      return 'android';
    }
  }
  
  // Desktop OS detection
  const osName = os.name?.toLowerCase() || '';
  if (osName.includes('mac') || osName.includes('darwin')) {
    return 'mac';
  } else if (osName.includes('win')) {
    return 'windows';
  } else {
    // Default to Mac for other desktop OS
    return 'mac';
  }
};
