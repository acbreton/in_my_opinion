
<h2 align="center">In My Opinion</h2>
<p align="center">
    <img width="250" alt="Opinionated finger" src="../master/images/imo.png">
</p>

<p align="center">
    <a rel="noreferrer noopener" target="_blank" href="https://chrome.google.com/webstore/detail/in-my-opinion/lkopodamggoocbopennlkmhbmhohlkdc">
        <img alt="Chrome Web Store" src="https://img.shields.io/static/v1?label=Chrome&message=1.1&color=green&style=for-the-badge&logo=google-chrome">
    </a>
    <a rel="noreferrer noopener" target="_blank" href="https://addons.mozilla.org/firefox/addon/in-my-opinion/">
        <img alt="Firefox Add-ons" src="https://img.shields.io/static/v1?label=firefox&message=1.1&color=blue&style=for-the-badge&logo=firefox">
    </a>
</p>
<br/>
<p align="center">
    <em>In My Opinion</em> is an open-source <strong>browser extension</strong> that analyzes and hides fan/critic reviews from popular webpage search results.  Go back to looking for movies, TV programs, books, and video games without seeing other opinions.
</p>
<br/>

## Development

The extension ships three manifests (Chrome dev, Chrome Web Store, and Firefox). They all share the same large list of Google ccTLD match patterns, so the manifests are **generated** from a single source rather than hand-edited.

- Edit `build/manifest.config.js` (per-target settings) and `build/tlds.json` (the Google ccTLD list).
- Regenerate the manifests:

```bash
npm run build
```

- Verify the committed manifests are up to date (useful in CI):

```bash
npm run build:check
```

To load the extension locally, build it and then load the project directory as an unpacked extension (Chrome: `chrome://extensions` → *Load unpacked*; Firefox: `about:debugging` → *Load Temporary Add-on* → select `manifest-firefox.json`).

## Hidden-today badge

`background.js` runs as a background service worker (MV3) / background script (MV2). Content scripts message it with how many rating elements they hid; it keeps a per-day tally in `chrome.storage.local` and shows the total as the integer badge on the toolbar icon. The count resets at local midnight and clears when the extension is toggled off. `background.js` is shared verbatim across targets and is wired into each manifest by the build config.

## Suggestion board

The popup's *Suggest something to hide* link opens a prefilled GitHub issue form (`.github/ISSUE_TEMPLATE/selector-request.yml`) that captures the site, page URL, and (optionally) a CSS selector. Submitted issues carry the `selector-request` label and feed a public upvote board, where a 👍 reaction counts as an upvote. The board is a standalone static page that reads the GitHub API client-side — no server or database — and lives with the website rather than in this extension package.


<br/>

*Developed By: Alec Breton (acbreton)*
