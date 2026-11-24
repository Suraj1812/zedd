import { readFile, writeFile } from "node:fs/promises";
const candidate =
  process.env.EXPO_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;
if (candidate) {
  const origin = new URL(
    candidate.startsWith("http") ? candidate : `https://${candidate}`,
  ).origin;
  const escape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;");
  const safeOrigin = escape(origin);
  let html = await readFile("dist/index.html", "utf8");
  html = html.replaceAll(
    'content="/social-card.png"',
    `content="${safeOrigin}/social-card.png"`,
  );
  html = html.replace(
    "</head>",
    `<link rel="canonical" href="${safeOrigin}/" /><meta property="og:url" content="${safeOrigin}/" /></head>`,
  );
  await writeFile("dist/index.html", html);
  console.log(`Web metadata finalized for ${origin}`);
} else
  console.log(
    "Web export ready. Set EXPO_PUBLIC_SITE_URL for absolute canonical/social URLs outside Vercel.",
  );
