# Asset provenance

Generated with the built-in image generation tool. Final selected project assets:

- `assets/brand/zedd-mark.png` — Zedd Z monogram. Prompt: "Production mobile app icon for Zedd. Flat deep forest green #063F32 background, centered ivory sculptural geometric Z monogram; Swiss identity design, precise corners, balanced negative space, simple two-color artwork. No glow, shadows, mockup or extra text."
- `assets/brand/app-icon.png` — icon size derived from the selected mark.
- `assets/images/riad.png` — Prompt: "Architectural editorial photograph of a boutique Moroccan riad courtyard, emerald tiled pool, date palms, cream plaster arches and limestone, woven loungers, natural late-afternoon light; no people or text."
- `assets/images/argan.png` — Prompt: "Premium beauty product photograph: amber argan oil dropper bottle, ivory ARGAN / 100% PURE label, limestone plinth, argan nuts and olive branch shadow, authentic warm daylight, restrained catalog composition."
- `assets/images/lemonade.png` — Prompt: "Realistic menu photograph: clear tumbler of fresh sparkling lemonade, lemon slices, mint, ice and condensation, light stone cafe table, natural daylight, no text or branding."
- `public/social-card.png` — Prompt: "Landscape Zedd sharing graphic using the exact Z monogram, forest green background and white Swiss typography. Wordmark zedd. and exact text Everyday, beautifully connected. Small PAY / TRAVEL / DISCOVER footer, generous whitespace."

App icons, favicon and touch icons are resized copies of the selected mark. Social graphic is sized to 1200×630.

`assets/editorial/*.jpg` contains locally bundled Unsplash photographs. Source photo IDs and download sizes are recorded in `scripts/download-editorial.mjs`. Contact portraits are editorial images used with fictional names, not actual saved contacts. Lemonade uses the original project asset listed above.

The launch Z outline is a code-native brand animation, separate from the raster asset. No extra generated variants are referenced by this application.

## Sharing image v2

Selected asset: `public/social-card-v2.png` (1200×630), generated with the built-in image tool and resized for Open Graph. The original social-card.png is retained for older cached references.

Final prompt brief: "Create a premium landscape product showcase for Zedd. Use the original Z monogram, the actual Home screen from the supplied screenshot (extract only the app, discard browser chrome and warning toast), and the original riad photograph as references. Cool-white background with a forest-green architectural plane; restrained charcoal phone device displaying the graphite Zedd card, balance, payment actions and service grid. Offset travel panel and a matching payment-card detail demonstrate the product. Left-aligned headline, exact text: Your day. / One app. / More life. Small Zedd lockup above, Pay. Travel. Discover. below. Strong editorial hierarchy, crisp typography, physically credible devices, quiet grounding shadows, safe margins. No neon, glow, blobs, abstract arcs, coins, fake awards, partner logos, watermarks or unrelated screenshot content."

Metadata now points to the versioned file, with an absolute image URL finalized by the Vercel build. This changes only web sharing artwork; the native app binary is unaffected.
