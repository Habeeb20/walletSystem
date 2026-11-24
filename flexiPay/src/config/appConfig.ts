/**
 * Central runtime configuration. Override at build time via EXPO_PUBLIC_* env vars
 * (see .env.example), e.g. EXPO_PUBLIC_API_BASE_URL=https://your-host/api
 */
export const AppConfig = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.100.13:8080/api',
    // process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://flexipay.jamiuadewaleyusuf.com/api',

  /**
   * Whether to enforce TLS public-key pinning. Off by default until real pins are
   * supplied, since an incorrect pin would lock every user out of the app.
   * When enabled with no pins configured, every request fails loudly instead of
   * silently running unpinned (same intent as the Flutter placeholder PEM).
   */
  enableCertificatePinning: process.env.EXPO_PUBLIC_ENABLE_CERT_PINNING === 'true',

  /** Base64 SHA-256 SPKI hashes (at least two: current + backup). */
  pinnedPublicKeyHashes: (process.env.EXPO_PUBLIC_PINNED_PUBLIC_KEY_HASHES ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),

  /** Block app usage entirely on a rooted Android device (fintech norm). */
  blockOnRootedAndroid: true,
} as const;
