import { Platform } from 'react-native';

import { AppConfig } from '@/config/appConfig';

export type DeviceIntegrityStatus = 'ok' | 'compromisedBlocked' | 'compromisedWarn';

/**
 * Root/jailbreak check, run once at splash. A rooted Android device can be hard-blocked
 * (standard fintech practice); a jailbroken iOS device can only be warned about, since an
 * App Store build can't reliably enforce a hard block.
 *
 * Needs a development/production build (jail-monkey is a native module). In Expo Go, or if
 * the check itself fails, legitimate users are never blocked over a plugin error.
 */
export const IntegrityService = {
  async check(): Promise<DeviceIntegrityStatus> {
    if (__DEV__) return 'ok'; // emulators and dev builds would otherwise be flagged

    let compromised: boolean;
    try {
      const JailMonkey = require('jail-monkey').default as { isJailBroken(): boolean };
      compromised = JailMonkey.isJailBroken();
    } catch {
      return 'ok';
    }

    if (!compromised) return 'ok';
    if (Platform.OS === 'android' && AppConfig.blockOnRootedAndroid) return 'compromisedBlocked';
    return 'compromisedWarn';
  },
};
