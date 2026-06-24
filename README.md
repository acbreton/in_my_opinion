
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

<br/>

*Developed By: Alec Breton (acbreton)*
