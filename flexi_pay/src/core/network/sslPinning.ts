import { AppConfig } from '@/config/appConfig';
import { ApiError } from '@/models/types';

let ready: Promise<void> | null = null;

function hostOf(url: string): string {
  const match = /^https?:\/\/([^/:?#]+)/i.exec(url);
  if (!match) throw new Error(`Cannot determine host from ${url}`);
  return match[1];
}

/**
 * Resolves once the transport is safe to use. With pinning disabled it's a no-op.
 * With pinning enabled it initializes native public-key pinning for the API host; if that
 * can't be done (e.g. no pins configured) every request fails loudly rather than silently
 * running unpinned, mirroring the Flutter placeholder-certificate behaviour.
 */
export function ensureTransportReady(): Promise<void> {
  if (!AppConfig.enableCertificatePinning) return Promise.resolve();

  ready ??= (async () => {
    if (AppConfig.pinnedPublicKeyHashes.length < 2) {
      throw new ApiError(
        'Certificate pinning is enabled but fewer than two public-key hashes are configured.',
      );
    }
    const { initializeSslPinning } =
      require('react-native-ssl-public-key-pinning') as typeof import('react-native-ssl-public-key-pinning');
    await initializeSslPinning({
      [hostOf(AppConfig.apiBaseUrl)]: {
        includeSubdomains: false,
        publicKeyHashes: [...AppConfig.pinnedPublicKeyHashes],
      },
    });
  })();
  return ready;
}
