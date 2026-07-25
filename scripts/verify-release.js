const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "release-manifest.json"), "utf8")
);

assert.ok(manifest.stable, "release-manifest.json must define a stable release.");
assert.ok(
  manifest.releases?.[manifest.stable],
  `Stable release ${manifest.stable} is missing from the manifest.`
);

for (const [version, release] of Object.entries(manifest.releases || {})) {
  const releasePath = path.join(root, release.file);
  assert.ok(fs.existsSync(releasePath), `${version} file does not exist.`);

  const contents = fs.readFileSync(releasePath);
  const digest = crypto.createHash("sha256").update(contents).digest("hex");

  assert.strictEqual(
    digest,
    release.sha256,
    `${version} changed after release. Publish a new version instead of editing it.`
  );
}

console.log(`PASS: ${Object.keys(manifest.releases).length} immutable widget release verified`);
console.log(`PASS: stable widget release is ${manifest.stable}`);
