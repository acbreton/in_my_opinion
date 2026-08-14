"use strict";

const STYLE_ID = "imo-google-style";
const HIDDEN_CLASS = "imo-hidden";

// Pure-selector targets hidden via an injected stylesheet (fully reversible).
const SELECTORS_TO_HIDE = [
    '[data-attrid="kc:/book/book:reviews"]',
    '[data-attrid="kc:/cvg/computer_videogame:reviews"]',
    '[data-attrid="kc:/ugc:top_thumbs_up"]',
    '[data-attrid="kc:/ugc:thumbs_up"]',
    '[data-attrid="kc:/ugc:user_reviews"]',
    '[data-starbar-class="rating-list"]',
    '[data-attrid="kc:/film/film:reviews"]',
    '[data-attrid="kc:/film/film:critic_reviews"]',
    '[itemprop="starRating"]',
    '[itemprop="tomatoMeter"]',
    '[data-g-id="reviews"]',
    '[data-sncf="3"]',
    '[data-md="17"]',
    '[data-attrid="kc:/tv/tv_program:reviews"]',
];

// Rating elements whose closest <div> ancestor should be hidden.
const ARIA_SELECTORS = ['[aria-label^="Rated"]', '[aria-label^="Scored"]'];

let isEnabled = true;
let observer = null;
let scheduled = false;

function buildStyle() {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
        `${SELECTORS_TO_HIDE.join(", ")} { display: none !important; }\n` +
        `.${HIDDEN_CLASS} { display: none !important; }`;
    return style;
}

function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    (document.head || document.documentElement).appendChild(buildStyle());
}

function removeStyle() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
}

// Hide ancestors that can't be targeted by a static selector by tagging them
// with a class. This is reversible without clobbering original inline styles.
function tagAncestors() {
    ARIA_SELECTORS.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
            const div = el.closest("div");
            if (div) div.classList.add(HIDDEN_CLASS);
        });
    });

    if (window.location.host === "www.google.com") {
        Array.from(document.getElementsByTagName("g-review-stars")).forEach((stars) => {
            if (stars.parentElement) stars.parentElement.classList.add(HIDDEN_CLASS);
        });
    }

    // Result rows whose citation references a review. The word boundary avoids
    // false positives such as "bookreviewblog.com".
    Array.from(document.getElementsByTagName("cite")).forEach((cite) => {
        if (/\breviews?\b/i.test(cite.textContent)) {
            const row = cite.closest(".g");
            if (row) row.classList.add(HIDDEN_CLASS);
        }
    });
}

function clearTags() {
    document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((el) => {
        el.classList.remove(HIDDEN_CLASS);
    });
}

function scheduleTag() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
        scheduled = false;
        if (isEnabled) tagAncestors();
    });
}

function startObserver() {
    if (observer) return;
    observer = new MutationObserver(scheduleTag);
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

function stopObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

function apply(enabled) {
    isEnabled = enabled;
    if (enabled) {
        injectStyle();
        tagAncestors();
        startObserver();
    } else {
        stopObserver();
        removeStyle();
        clearTags();
    }
}

chrome.storage.local.get("enabled", (result) => {
    apply(result.enabled !== undefined ? result.enabled : true);
});

chrome.storage.onChanged.addListener((changes) => {
    if ("enabled" in changes) {
        apply(changes.enabled.newValue);
    }
});
