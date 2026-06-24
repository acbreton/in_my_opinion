"use strict";

// Single source of truth for every generated manifest. Edit this file (and
// build/tlds.json) instead of the manifest-*.json files, then run `npm run
// build` to regenerate them. See build/build-manifests.js.

const tlds = require("./tlds.json");

// Fields shared by every target.
const shared = {
    name: "In My Opinion",
    short_name: "IMO",
    description:
        "A Google Chrome extension for removing critic and fan review ratings from search results and various popular webpages.",
    icons: {
        16: "images/imo16.png",
        32: "images/imo32.png",
        48: "images/imo48.png",
        128: "images/imo128.png",
    },
};

// The Google search/Play store content script runs against every Google ccTLD.
// `subdomains` controls whether play.google.* is included alongside www.google.*.
function googleMatches(subdomains) {
    return subdomains.flatMap((sub) => tlds.map((tld) => `*://${sub}.google.${tld}/*`));
}

// The dedicated review-site content script. Shared across all targets.
const reviewSiteMatches = ["*://www.imdb.com/*", "*://www.goodreads.com/*"];

function contentScripts(subdomains) {
    return [
        {
            matches: googleMatches(subdomains),
            js: ["contentScriptGoogle.js"],
            run_at: "document_end",
        },
        {
            matches: reviewSiteMatches,
            js: ["contentScript.js"],
            run_at: "document_start",
        },
    ];
}

// Per-target configuration. Versions are intentionally per-target because each
// store approves releases independently, so the published versions can differ.
const targets = {
    // Chrome, loaded unpacked for development (also targets the Play store).
    "manifest.json": {
        version: "1.2",
        manifestVersion: 3,
        actionKey: "action",
        permissions: ["storage"],
        googleSubdomains: ["www", "play"],
    },
    // Chrome Web Store submission build.
    "manifest-google-v3.json": {
        version: "1.2",
        manifestVersion: 3,
        actionKey: "action",
        permissions: ["storage"],
        googleSubdomains: ["www"],
    },
    // Firefox Add-ons (Manifest V2).
    "manifest-firefox.json": {
        version: "1.1",
        manifestVersion: 2,
        actionKey: "browser_action",
        permissions: ["*://www.google.com/*", "*://www.imdb.com/*", "storage"],
        googleSubdomains: ["www"],
        extra: {
            browser_specific_settings: {
                gecko: { id: "{1e883c16-fc94-4cf8-b58f-f34b445f632e}" },
            },
        },
    },
};

module.exports = { shared, contentScripts, targets };
