"use strict";

// Builds the exact Firefox add-on package from source.
//
//   node build/package-firefox.js      (or: npm run package:firefox)
//
// Steps performed:
//   1. Regenerate the manifests from build/manifest.config.js (single source).
//   2. Stage the Firefox files into dist/firefox/, using the generated
//      manifest-firefox.json as the package's manifest.json.
//   3. Zip the staging directory into dist/in_my_opinion-<version>.zip.
//
// Everything shipped is included verbatim; the only generated file is the
// manifest. Requires Node.js and the standard `zip` utility on PATH.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const distDir = path.join(repoRoot, "dist");
const stageDir = path.join(distDir, "firefox");

// Files that make up the Firefox package (relative to the repo root).
const PACKAGE_FILES = [
    "contentScript.js",
    "contentScriptGoogle.js",
    "modal/modal.html",
    "modal/modal.css",
    "modal/modal.js",
    "modal/fonts/louis_george_cafe.ttf",
    "images/imo.png",
    "images/imo16.png",
    "images/imo32.png",
    "images/imo48.png",
    "images/imo128.png",
];

function copyInto(relPath, destRoot) {
    const dest = path.join(destRoot, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, relPath), dest);
}

// 1. Regenerate manifests so the package always reflects the config.
execFileSync(process.execPath, [path.join(__dirname, "build-manifests.js")], {
    stdio: "inherit",
});

// 2. Stage a clean copy of the Firefox package.
fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });
fs.copyFileSync(
    path.join(repoRoot, "manifest-firefox.json"),
    path.join(stageDir, "manifest.json")
);
for (const relPath of PACKAGE_FILES) copyInto(relPath, stageDir);

// 3. Zip the staged files.
const { version } = JSON.parse(fs.readFileSync(path.join(stageDir, "manifest.json"), "utf8"));
const outPath = path.join(distDir, `in_my_opinion-${version}.zip`);
fs.rmSync(outPath, { force: true });

try {
    execFileSync("zip", ["-r", "-X", outPath, "."], { cwd: stageDir, stdio: "inherit" });
} catch (err) {
    console.error(
        "\nFailed to run `zip`. Install the standard zip utility (preinstalled on " +
            "macOS/Linux) or zip the contents of dist/firefox/ manually."
    );
    process.exit(1);
}

console.log(`\nFirefox package written to ${path.relative(repoRoot, outPath)}`);
