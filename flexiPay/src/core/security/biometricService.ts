import { ed25519 } from '@noble/curves/ed25519.js';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';

import { base64UrlToBytes, bytesToBase64, bytesToBase64Url } from '@/lib/base64';
import { SecureStorage } from './secureStorage';

export interface PublicKeyJwk {
  kty: 'OKP';
  crv: 'Ed25519';
  x: string;
}

function messageForError(code?: string): string | null {
  switch (code) {
    case 'not_enrolled':
      return 'No biometrics are enrolled on this device. Add a fingerprint or face in your device settings first.';
    case 'not_available':
      return 'Biometric authentication is not available on this device.';
    case 'lockout':
      return 'Too many failed attempts. Please try again in a moment.';
    case 'passcode_not_set':
      return 'Set up a device PIN, pattern, or passcode to use biometric login.';
    default:
      return null; // user/system cancel: no device-level problem to report
  }
}

/**
 * Device-side half of biometric login: an Ed25519 keypair is generated on enrollment,
 * the private seed is kept in secure storage, and every login signs a server-issued
 * one-time challenge with it, gated by a biometric/device-credential prompt.
 * Same scheme as the Flutter app (RFC 8032 Ed25519, OKP JWK public key, base64 signature).
 */
class BiometricServiceImpl {
  /** Human-readable reason for the most recent failed prompt (null = user cancelled). */
  lastErrorMessage: string | null = null;

  async isDeviceSupported(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const level = await LocalAuthentication.getEnrolledLevelAsync();
      return hasHardware || level !== LocalAuthentication.SecurityLevel.NONE;
    } catch {
      return false;
    }
  }

  private async authenticate(reason: string): Promise<boolean> {
    this.lastErrorMessage = null;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        disableDeviceFallback: false, // allow device PIN/pattern as a fallback
      });
      if (result.success) return true;
      this.lastErrorMessage = messageForError(result.error);
      return false;
    } catch {
      return false;
    }
  }

  isEnrolled = () => SecureStorage.hasBiometricKeyPair();

  /** Generic device-owner prompt (biometric or device PIN), used for app lock and transfers. */
  authenticateDeviceOwner = (reason: string) => this.authenticate(reason);

  /** Generates the on-device keypair (gated by a prompt); returns the public key as an OKP JWK. */
  async enroll(): Promise<PublicKeyJwk | null> {
    const ok = await this.authenticate('Confirm your identity to enable biometric login');
    if (!ok) return null;

    const seed = Crypto.getRandomBytes(32);
    const publicKey = ed25519.getPublicKey(seed);
    const jwk: PublicKeyJwk = { kty: 'OKP', crv: 'Ed25519', x: bytesToBase64Url(publicKey) };

    await SecureStorage.saveBiometricKeyPair(
      JSON.stringify({ seed: bytesToBase64Url(seed) }),
      JSON.stringify(jwk),
    );
    return jwk;
  }

  disable = () => SecureStorage.clearBiometricKeyPair();

  /** Signs the challenge string with the stored key after a prompt; returns standard base64. */
  async signChallenge(challenge: string): Promise<string | null> {
    const ok = await this.authenticate('Confirm your identity to log in');
    if (!ok) return null;

    const privateKeyJson = await SecureStorage.getBiometricPrivateKey();
    if (!privateKeyJson) return null;

    const { seed } = JSON.parse(privateKeyJson) as { seed: string };
    const signature = ed25519.sign(new TextEncoder().encode(challenge), base64UrlToBytes(seed));
    return bytesToBase64(signature);
  }
}

export const BiometricService = new BiometricServiceImpl();
