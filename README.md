# Zedd

A mobile React Native app for everyday payments, travel, food and shopping. Built with Expo SDK 58 and Expo Router for Android, iOS and a mobile web experience.

## Run

```sh
npm ci
npm run web
```

Open the Local URL printed by Expo. The website stays within a 430px mobile canvas on larger screens. Use `npm run android` / `npm run ios` with a configured device or simulator.

## Included

- Original Zedd identity, branded launch, accessible motion and 500ms layout-matched page skeletons.
- Graphite payment card with front/back flip, persistent random display identity, and card controls.
- Home, Explore, wallet, Activity and Profile navigation.
- Hotels, restaurants/menus, shopping, marketplace and supporting transport/event/health catalogs.
- Search, categories, sorting, saved collections, calendar, cart quantities, checkout review and receipts.
- Profile details, contact portraits, notifications, help and persisted checkout sessions.
- AOS scroll animation on web and native reveal animations on mobile.
- Locally bundled fonts and photographs, responsive safe-area layouts, icons, press feedback and haptics.
- Vercel build configuration, sharing metadata, favicon, touch icons and web manifest.
- EAS APK profile and GitHub release workflow.

The current environment uses on-device state and illustrative inventory. Live payments, card issuance, travel reservations, insurance cover and seller messaging require providers and a server. Card numbers are generated solely for presentation and deliberately fail payment credential validation. No real card information or account credentials are needed.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Web output: `dist`. See [distribution instructions](docs/DISTRIBUTION.md) for Vercel and installable APK releases. Initial EAS login, project setup and signing are required before creating the first APK.

## Structure

- `src/app` — file-based routes
- `src/screens` — page implementations
- `src/components` — reusable UI, loading states, motion and card
- `src/store` — versioned local persistence
- `src/lib` — catalogs, money/cart validation and navigation
- `assets` / `public` — app imagery, branding and web metadata
- `.github/workflows` — checks and Android release packaging

## Design and content

The supplied screenshots and original Lovable app informed the feature audit in [PRODUCT-SCOPE.md](docs/PRODUCT-SCOPE.md). Original generated images and prompt records are documented in [ASSETS.md](docs/ASSETS.md). Editorial photography is bundled from Unsplash; do not imply the pictured people endorse the app or identify real users.
