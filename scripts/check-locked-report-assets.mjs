import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const lockedAssets = [
  {
    path: "docs/brand/locked/liontech-corporate-letterhead-approved-20260816.png",
    sha256: "a9148bdb9c1678f0246ae5432508ed739eb64d5b230e2ab7cf2ce45ac7660298",
    png: [1055, 1491],
  },
  {
    path: "docs/brand/locked/ai-visibility-snapshot/liontech-ai-visibility-snapshot-template-approved-20260816.pdf",
    sha256: "58791aad05821a2e75375a2dcedc4fe00d878f95813332777a73ce6dfc4126a6",
    pdf: true,
  },
  {
    path: "docs/brand/locked/ai-visibility-snapshot/source-pages/page-1.png",
    sha256: "772ef315b7aa8b3a058cbefac7052104cf2d95cdb538e2649b3dbc86f756417e",
    png: [1055, 1491],
  },
  {
    path: "docs/brand/locked/ai-visibility-snapshot/source-pages/page-2.png",
    sha256: "3b44f24386a7d1f3e8e742929fd259ad5f48e024dbd6c1fc88be215826cbfff7",
    png: [1055, 1491],
  },
  {
    path: "docs/brand/locked/ai-visibility-snapshot/source-pages/page-3.png",
    sha256: "34a60b1a7476969661da069f8cfdb4aff78d765d57f4a49f58dc38f5430ded57",
    png: [1055, 1491],
  },
];

function fail(message) {
  throw new Error(`Locked report asset check failed: ${message}`);
}

for (const asset of lockedAssets) {
  const bytes = await readFile(resolve(root, asset.path)).catch(() =>
    fail(`missing ${asset.path}`),
  );
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== asset.sha256) fail(`${asset.path} has SHA-256 ${hash}`);

  if (asset.png) {
    const signature = bytes.subarray(0, 8).toString("hex");
    if (signature !== "89504e470d0a1a0a") fail(`${asset.path} is not a PNG`);
    const dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    if (dimensions[0] !== asset.png[0] || dimensions[1] !== asset.png[1]) {
      fail(`${asset.path} is ${dimensions.join("x")}, expected ${asset.png.join("x")}`);
    }
  }

  if (asset.pdf && bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    fail(`${asset.path} does not have a PDF header`);
  }
}

const readmePath = "docs/brand/locked/README.md";
const readme = await readFile(resolve(root, readmePath), "utf8");
const privateAddressPatterns = [
  /streetAddress/i,
  /postalCode/i,
  /PostalAddress/i,
  /registered office\s*:/i,
  /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i,
];
for (const pattern of privateAddressPatterns) {
  if (pattern.test(readme)) fail(`${readmePath} contains private-address-shaped text (${pattern})`);
}

console.log(`Locked report assets: PASS (${lockedAssets.length} files)`);
