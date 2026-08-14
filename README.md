
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

## Building the add-on from source (AMO reviewers)

This section provides step-by-step instructions to reproduce an exact copy of the
published Firefox add-on package.

**Operating system:** Linux, macOS, or Windows.

**Build environment requirements:**

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`). Install the LTS
  release from <https://nodejs.org/en/download>. No other npm packages are
  required — the build scripts use only Node's built-in modules.
- The standard `zip` command-line utility, used to create the package archive.
  It is preinstalled on macOS and most Linux distributions; on Debian/Ubuntu it
  can be installed with `sudo apt-get install zip`.

**Build steps:**

1. From the project root, run:

   ```bash
   npm run package:firefox
   ```

   This regenerates the manifests from `build/manifest.config.js`, stages the
   Firefox files (using `manifest-firefox.json` as `manifest.json`), and writes
   the packaged add-on to `dist/in_my_opinion-<version>.zip`.

The produced zip is an exact copy of the submitted package. No source file is
transpiled, concatenated, minified, or otherwise obfuscated; the only generated
file is `manifest.json`, produced from the plain-JavaScript config described
under *Development* above.

## Suggestions

The popup's *Suggest something to hide* link opens a prefilled GitHub issue form (`.github/ISSUE_TEMPLATE/selector-request.yml`) that captures the site, page URL, and (optionally) a CSS selector. Submitted issues carry the `selector-request` label, and 👍 reactions act as upvotes so the most-wanted requests rise to the top. The issue list itself serves as the suggestion board.


<br/>

*Developed By: Alec Breton (acbreton)*
