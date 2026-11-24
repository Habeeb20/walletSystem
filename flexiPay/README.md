# Flexi Pay (React Native + Tailwind)

Port of the Flutter `flexi_pay` app to **Expo (React Native) + NativeWind (Tailwind CSS)**. Same backend, same screens, same flows.

## Run it

```bash
npm install
cp .env.example .env        # optional: override the API URL
npx expo run:android        # or: npx expo run:ios   (development build)
```

Use a development build (`expo run:*`), not Expo Go: `jail-monkey` and SSL pinning are native modules.

## Project layout

```
app/                      expo-router screens (file = route)
  _layout.tsx             root: 401 handler, app-lock overlay, toasts
  index.tsx               splash + integrity check
  login / register / verify-email / login-otp / forgot-password / change-password / complete-profile
  (main)/                 tabs: home, bills, wallet, history, settings (+ header and drawer)
  transfer / airtime / data / electricity / tv / fund-wallet / checkout / support / transactions
src/
  components/             AppDrawer, AppLockScreen, CodeVerification, TransactionHistory
  components/ui/          AppInput, Buttons, Screen, SelectField, AmountChips, NetworkSelector, Toast, ...
  core/                   network (apiClient, ssl pinning), security (secure storage, biometrics, app lock, integrity)
  services/               auth, wallet, transfer, bills, plans, profile, contact (1:1 with the Dart services)
  models/types.ts         all models + ApiError
  lib/                    dashboardStore, navigation, validators, format, events, postLogin
  theme/palette.json      Tailwind colors (same hex values as color.dart)
```

## Flutter -> React Native mapping

| Flutter | React Native |
|---|---|
| `provider`, `ChangeNotifier`, `get_it` | tiny store (`lib/store.ts`) |
| `http` + `ApiClient` | `fetch` + `ApiClient` (same 401/403 force-logout) |
| `flutter_secure_storage` | `expo-secure-store` |
| `shared_preferences` | `@react-native-async-storage/async-storage` |
| `local_auth` + `cryptography` (Ed25519) | `expo-local-authentication` + `@noble/curves` (same JWK / signature format) |
| `safe_device` | `jail-monkey` |
| `jwt_decoder` | `jwt-decode` |
| `lottie` | `lottie-react-native` |
| `webview_flutter` | `react-native-webview` |
| Navigator / named routes | `expo-router` |
| SnackBar | `toast.success/error/info(...)` |
| `Kotlin MainActivity` / `Swift AppDelegate` | not needed (they were Flutter boilerplate); permissions live in `app.json` |

## Intentional differences

- **Shared dashboard state**: Home, Wallet, History and the drawer read one `/auth/dashboard` fetch instead of each refetching. Purchases, transfers and funding emit `WALLET_CHANGED` to refresh it.
- **App lock** is an overlay above the whole navigator, so pushed screens (transfer, bills) are covered too. Only `background` arms it (iOS `inactive` also fires during the Face ID prompt).
- **Certificate pinning**: Flutter pinned a root-CA PEM (it shipped as a placeholder). React Native pins SPKI hashes: set `EXPO_PUBLIC_ENABLE_CERT_PINNING=true` and at least two hashes in `EXPO_PUBLIC_PINNED_PUBLIC_KEY_HASHES`. Enabled with no hashes, every request fails (same fail-loud intent).
- **Integrity check** is skipped in `__DEV__` and doesn't replicate safe_device's emulator/mock-location checks.
- Biometric enrollment prompts once (the Flutter settings toggle prompted twice).
- Transfer: changing bank or account number clears the verified account, so you can't send to a previously verified recipient by mistake.
- Dropped: the unused `RegisterService` (validators live in `lib/validators.ts`) and the app bar's placeholder search/notifications (they only showed hard-coded sample data).
- Date of birth uses a small built-in picker (18+ enforced); banks/plans/providers use a bottom-sheet `SelectField`.
- Existing Flutter biometric keypairs can't be migrated; users re-enable biometrics once.

## Not included

App icon / splash artwork (add `icon`, `splash` in `app.json`), and tests. Verified: `tsc --noEmit` passes and `expo export --platform android` bundles; not yet run on a device or emulator.
