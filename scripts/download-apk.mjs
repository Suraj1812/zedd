import { readFile, writeFile } from "node:fs/promises";
const [resultFile, output] = process.argv.slice(2);
const response = JSON.parse(await readFile(resultFile, "utf8"));
const build = Array.isArray(response) ? response[0] : response;
if (build.status !== "FINISHED")
  throw Error(`APK build is not finished: ${build.status}`);
const artifact =
  build.artifacts?.buildUrl || build.artifacts?.applicationArchiveUrl;
if (!artifact || new URL(artifact).protocol !== "https:")
  throw Error("No HTTPS APK artifact returned by EAS.");
const download = await fetch(artifact);
if (!download.ok) throw Error(`APK download failed: ${download.status}`);
const bytes = new Uint8Array(await download.arrayBuffer());
if (bytes[0] !== 0x50 || bytes[1] !== 0x4b)
  throw Error("Artifact is not an APK/ZIP archive.");
await writeFile(output, bytes);
console.log(`Saved Android APK (${bytes.byteLength} bytes).`);
