import * as SecureStore from 'expo-secure-store';

/**
 * Wraps expo-secure-store (Keychain on iOS, Keystore-backed encrypted storage on Android)
 * for anything that must never live in plain AsyncStorage: the JWT and the biometric keypair.
 */
const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

const TOKEN_KEY = 'auth_token';
const BIOMETRIC_PRIVATE_KEY = 'biometric_private_key';
const BIOMETRIC_PUBLIC_KEY = 'biometric_public_key';

export const SecureStorage = {
  saveToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token, options),
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY, options),
  deleteToken: () => SecureStore.deleteItemAsync(TOKEN_KEY, options),

  async saveBiometricKeyPair(privateKeyJson: string, publicKeyJson: string) {
    await SecureStore.setItemAsync(BIOMETRIC_PRIVATE_KEY, privateKeyJson, options);
    await SecureStore.setItemAsync(BIOMETRIC_PUBLIC_KEY, publicKeyJson, options);
  },
  getBiometricPrivateKey: () => SecureStore.getItemAsync(BIOMETRIC_PRIVATE_KEY, options),
  getBiometricPublicKey: () => SecureStore.getItemAsync(BIOMETRIC_PUBLIC_KEY, options),
  async hasBiometricKeyPair() {
    return (await SecureStore.getItemAsync(BIOMETRIC_PRIVATE_KEY, options)) != null;
  },

  async clearAll() {
    await SecureStore.deleteItemAsync(TOKEN_KEY, options);
    // Biometric keys intentionally survive logout: re-enrolling on every login would
    // defeat the point. They're cleared explicitly if the user disables biometrics.
  },

  async clearBiometricKeyPair() {
    await SecureStore.deleteItemAsync(BIOMETRIC_PRIVATE_KEY, options);
    await SecureStore.deleteItemAsync(BIOMETRIC_PUBLIC_KEY, options);
  },
};
