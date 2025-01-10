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
        if (result.enabled) observeHead();
    });

    chrome.storage.onChanged.addListener((changes) => {
        if ('enabled' in changes) {
            toggleElementsForSite(changes.enabled.newValue);
        }
    });
}

init();
