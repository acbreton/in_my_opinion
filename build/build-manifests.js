"use strict";

// Generates every manifest-*.json from build/manifest.config.js so the large,
// shared list of Google ccTLD match patterns lives in exactly one place.
//
//   node build/build-manifests.js          regenerate all manifests
//   node build/build-manifests.js --check   fail if any manifest is stale (CI)

const fs = require("fs");
const path = require("path");
const { shared, contentScripts, targets } = require("./manifest.config");

const repoRoot = path.join(__dirname, "..");

// Build an ordered manifest object. Key insertion order matches the existing
// hand-written files so regeneration produces a clean diff.
function buildManifest(target) {
    const action = {
        default_title: shared.name,
        default_popup: "./modal/modal.html",
        default_icon: shared.icons,
    };

    const manifest = {
        name: shared.name,
        short_name: shared.short_name,
        version: target.version,
        description: shared.description,
        permissions: target.permissions,
        [target.actionKey]: action,
        icons: shared.icons,
        content_scripts: contentScripts(target.googleSubdomains),
        manifest_version: target.manifestVersion,
        ...(target.extra || {}),
    };

    return manifest;
}

function serialize(manifest) {
    return JSON.stringify(manifest, null, 4) + "\n";
}

function main() {
    const checkOnly = process.argv.includes("--check");
    let stale = false;

    for (const [filename, target] of Object.entries(targets)) {
        const filePath = path.join(repoRoot, filename);
        const next = serialize(buildManifest(target));

        if (checkOnly) {
            const current = fs.existsSync(filePath)
                ? fs.readFileSync(filePath, "utf8")
                : "";
            if (current !== next) {
                stale = true;
                console.error(`✗ ${filename} is out of date (run: npm run build)`);
            } else {
                console.log(`✓ ${filename} is up to date`);
            }
        } else {
            fs.writeFileSync(filePath, next);
            console.log(`Wrote ${filename}`);
        }
    }

    if (checkOnly && stale) {
        process.exit(1);
    }
}

main();
