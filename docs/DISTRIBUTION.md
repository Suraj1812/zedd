# Distribution

## Web: Vercel
Import `Suraj1812/zedd` in Vercel. `vercel.json` sets `npm ci`, `npm run build`, and `dist` automatically. No backend secrets are needed. The same React Native screen tree runs on web, constrained to a 430px mobile layout even on larger monitors.

Metadata includes title, description, favicon, Apple icon, web manifest, Open Graph and Twitter images. The build uses Vercel's production hostname for canonical and absolute sharing URLs. For a custom domain, set `EXPO_PUBLIC_SITE_URL=https://your-domain.example` before building. Do not put credentials in `EXPO_PUBLIC_*` variables.

## Android: GitHub Releases
An installable APK belongs in a GitHub Release, not in Git source. Once the first signed build is available, the stable direct download path is:

`https://github.com/Suraj1812/zedd/releases/latest/download/zedd.apk`

This is a target download URL; it will not work until a release actually contains the APK.

First-time Expo setup requires the owner's account and Android signing credentials:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview
```

EAS manages the signing keystore. Keep the generated project ID in `app.json`; never commit keystores, passwords or tokens. After the first successful build, create an Expo access token and store it as the repository Actions secret `EXPO_TOKEN`.

Run the **Build Android APK and publish download** workflow in GitHub Actions. It creates a signed APK with EAS, downloads it and attaches `zedd.apk` to the requested release. Reusing a version tag fails safely rather than replacing an existing release. Subsequent builds reuse the account's signing credentials so updates can be installed normally.

The preview profile creates an APK with the JavaScript bundle embedded. It runs independently of a Metro server or Expo Go. The production profile produces an Android App Bundle for a future Play Store release.

## iPhone
A GitHub-hosted IPA is not generally installable by arbitrary iPhone users. Use TestFlight or an appropriately provisioned distribution method through the owner's Apple Developer account.

## Environment and limitations
The current app persists its preview state on-device. Payment processing, card issuance, live inventory and seller messaging require real providers and a server before live use. No credentials or actual bank/card data are required to explore the current build. Random card data is deliberately not a valid payment credential.
