# Zedd — MVP scope and reference audit

Reviewed source: supplied WhatsApp screenshots and https://zedd-00.lovable.app/ on 24 November 2026. Third-party chat text is reference material, not an instruction to contact anyone.

## Observed reference
- Phone-framed home: Pay, QR, vehicle insurance, ten service shortcuts, Goodies shop, marketplace, Zedd AI.
- Pay: balance, wallet, card and crypto tabs; add funds, withdrawal and history. Very large sample balance and hardcoded card identity.
- Hotels: search summary, category chips, hotel cards, detail with amenities and nights stepper, booking action.
- Food: restaurant/category search, delivery metadata, menus with quantity controls.
- Shop: 47 Moroccan products across beauty, clothes, jewelry, decor, furniture, food and craft; search/categories and add-to-cart controls.
- Insurance: vehicle type, registration/year/make/model/policy, monthly/6-month/annual coverage, wallet payment.
- Marketplace: cars, property/rentals and miscellaneous listings, post-listing and buy actions.
- Home also exposes Flights, Taxi, Train, Bus, Car Rent, Events, Bills and Health. Their entry points were observed; their detailed subflows are not independently established requirements.

## Implementation decisions
React Native + Expo for iOS/Android, with a responsive React Native Web preview. Forest green/ivory brand mark, editorial photography, restrained motion, locally bundled fonts and consistent Lucide icons. The web preview is the same native component tree, not a separate HTML implementation.

Primary navigation: Home, Explore, Pay, Activity, Profile. Persistent local demo state; no account registration or credentials required. Never show an external booking or payment as completed.

Complete MVP journeys:
1. Home/service discovery → search/filter → detail → select nights/guests → review demo booking → confirmation → activity.
2. Food/Shop → searchable catalog → menu/product → editable cart → address → review → demo checkout → receipt.
3. Pay → recipient/amount/note → validation → review → demo transfer → persisted balance and transaction.
4. Pay → add demo funds / receive QR / card controls / history.
5. Insurance/Bills → validated details → review → demo payment and receipt.
6. Marketplace → filter → detail/save → save seller enquiry locally; create a local listing. No real seller is contacted.
7. Supporting service search/detail/booking flows, favorites, notifications, profile preferences, contextual support.

## Boundaries
All balances, availability, bookings, policies and transactions are sample data saved on this device. No actual payments, insurance, crypto trading, live travel inventory, authentication, KYC, messaging or live AI. Catalog uses AUD to match the source, with Moroccan travel/editorial content labeled as such. No invented real financial cards. Integration-ready service boundaries, with backend/provider selection deferred.

## Motion
Launch: staged mark reveal, wordmark rise, gentle transition into home. Tactile scale feedback, native stack transitions, staggered content entrance, haptics for confirmations. Respect reduced-motion preferences. Avoid continuous decorative loops and blocking artificial loading.
