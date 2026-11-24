// Rasterize the same vector mark used by Launch.tsx, with adaptive-icon padding.
// Run with: node scripts/generate-android-icon.cjs
const fs = require("node:fs");
const { PNG } = require("pngjs");
const Jimp = require("jimp-compact");
const path =
  "M29 31 Q29 12 49 12 H117 L63 81 H116 Q116 101 96 101 H29 L84 32 H29 Z";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path d="${path}" fill="#F4F5EE" transform="translate(298.6 296.2) scale(4.85) translate(-29 -12)"/></svg>\n`;
fs.writeFileSync("assets/brand/adaptive-foreground.svg", svg);
const points = [[29, 31]];
function curve(start, control, end) {
  for (let i = 1; i <= 64; i++) {
    const t = i / 64,
      u = 1 - t;
    points.push([
      u * u * start[0] + 2 * u * t * control[0] + t * t * end[0],
      u * u * start[1] + 2 * u * t * control[1] + t * t * end[1],
    ]);
  }
}
curve([29, 31], [29, 12], [49, 12]);
points.push([117, 12], [63, 81], [116, 81]);
curve([116, 81], [116, 101], [96, 101]);
points.push([29, 101], [84, 32], [29, 32]);
const scale = 4;
const size = 1024 * scale;
const outline = points.map(([x, y]) => [
  (298.6 + (x - 29) * 4.85) * scale,
  (296.2 + (y - 12) * 4.85) * scale,
]);
const png = new PNG({ width: size, height: size });
for (let y = 0; y < size; y++) {
  const hits = [];
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i],
      b = outline[(i + 1) % outline.length];
    if (a[1] > y + 0.5 !== b[1] > y + 0.5)
      hits.push(a[0] + ((y + 0.5 - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
  }
  hits.sort((a, b) => a - b);
  for (let i = 0; i < hits.length; i += 2) {
    for (let x = Math.ceil(hits[i] - 0.5); x < hits[i + 1] - 0.5; x++) {
      const offset = (y * size + x) * 4;
      png.data.set([244, 245, 238, 255], offset);
    }
  }
}
Jimp.read(PNG.sync.write(png)).then((image) =>
  image
    .resize(1024, 1024, Jimp.RESIZE_BICUBIC)
    .writeAsync("assets/brand/adaptive-foreground.png"),
);
