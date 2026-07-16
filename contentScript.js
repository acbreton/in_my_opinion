const blockStyleElement = document.createElement('style');
const isProdMode = 'update_url' in chrome.runtime.getManifest()

const SITE_DETECTION = {
    imdb: /imdb\.com/,
    goodreads: /goodreads\.com/,
};

const CLASSNAMES_TO_REMOVE = {
    goodreads: [
        '[class*="AverageRating"]',
        '[class*="BookPageMetadataSection__ratingStats"]',
        '[class*="ReviewContent"]',
        '[id*="ReviewsSection"]',
    ],
    imdb: [
        '[class^="RatingBar"]',
        '[class*="rating"]',
        '[class*="ipc-reaction-summary"]',
        '[data-testid="awards"]',
        '[data-testid*="hero-rating-bar"]',
        '[data-testid*="reviewContent"]',
        '[data-testid="UserReviews"]',
    ],
}

function getSiteKey() {
    for (const [key, regex] of Object.entries(SITE_DETECTION)) {
        if (regex.test(window.location.host)) {
            return key;
        }
    }
    return null;
}

// Counts each hidden rating element once for the "hidden today" badge and
// reports the delta to the background worker.
const counted = new WeakSet();

function reportHiddenForSite(site) {
    const selectors = CLASSNAMES_TO_REMOVE[site].join(', ');
    let n = 0;
    document.querySelectorAll(selectors).forEach((el) => {
        if (!counted.has(el)) {
            counted.add(el);
            n++;
        }
    });
    if (n > 0) {
        try {
            chrome.runtime.sendMessage({ type: "imo-hidden", count: n });
        } catch (e) {
            /* worker unavailable; badge is best-effort */
        }
    }
}


function log(message) {
    if (!isProdMode) {
        console.log(message);
    }
}

function hideElementsForSite() {
    if (!document.head) {
        log('Head not available yet, waiting...');
        return;
    }

    const site = getSiteKey();
    if (!site) return;

    blockStyleElement.textContent = `${CLASSNAMES_TO_REMOVE[site].join(', ')} { display: none !important; }`;

    log(`Injected CSS to hide elements with class: ${CLASSNAMES_TO_REMOVE[site]}`);

    document.head.appendChild(blockStyleElement);

    reportHiddenForSite(site);
}

function showElementsForSite() {
    blockStyleElement.remove();
}

function toggleElementsForSite(isEnabled) {
    if (isEnabled) {
        hideElementsForSite();
    } else {
        showElementsForSite();
    }
}

function observeHead() {
    const observer = new MutationObserver(() => {
        if (document.head) {
            hideElementsForSite();
            observer.disconnect();
        }
    });

    // Start observing the document for added elements in the <html> tag
    observer.observe(document.documentElement, {
        childList: true, // Look for added child nodes
        subtree: false // Observe all descendants
    });

}

function init() {
    chrome.storage.local.get("enabled", (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        if (isEnabled) observeHead();
    });

    chrome.storage.onChanged.addListener((changes) => {
        if ('enabled' in changes) {
            toggleElementsForSite(changes.enabled.newValue);
        }
    });
}

init();
