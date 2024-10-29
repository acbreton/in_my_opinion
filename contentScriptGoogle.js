let isEnabled;

chrome.storage.local.get("enabled", (result) => {
    isEnabled = result.enabled !== undefined ? result.enabled : true;
    runScripts(isEnabled);
});

chrome.storage.onChanged.addListener((changes) => {
    changes.enabled
        ? runScripts(changes.enabled.newValue)
        : runScripts(isEnabled);
});

function runScripts(extensionEnabled) {
    const dataAttributesToRemove = {
        books: ['[data-attrid="kc:/book/book:reviews"]'],
        games: ['[data-attrid="kc:/cvg/computer_videogame:reviews"]'],
        google_users: [
            '[data-attrid="kc:/ugc:top_thumbs_up"]',
            '[data-attrid="kc:/ugc:thumbs_up"]',
            '[data-attrid="kc:/ugc:user_reviews"]',
            '[data-starbar-class="rating-list"]',
        ],
        movies: [
            '[data-attrid="kc:/film/film:reviews"]',
            '[data-attrid="kc:/film/film:critic_reviews"]',
            '[itemprop="starRating"]',
            '[itemprop="tomatoMeter"]',
            '[data-g-id="reviews"]',
            '[data-sncf="3"]',
            '[data-md="17"]'
        ],
        tv: ['[data-attrid="kc:/tv/tv_program:reviews"]'],
        aria: [
            '[aria-label^="Rated"]',
            '[aria-label^="Scored"]'
        ]
    };

    _removeItemsFromPage(
        dataAttributesToRemove,
        extensionEnabled
    );

    if (window.location.host === "www.google.com") {
        // Get the star ratings for the individual search results.
        const titleStars = document.getElementsByTagName("g-review-stars");

        // Hide the star ratings.
        for (let title of titleStars) {
            title.parentElement.style.display = extensionEnabled
                ? "none"
                : "block";
        }
    }
}

_removeItemsFromPage = (
    dataAttributesToRemove,
    extensionEnabled
) => {
    Object.keys(dataAttributesToRemove).forEach((mediaCategory) => {
        dataAttributesToRemove[mediaCategory].forEach((domId) => {
            let elems = document.querySelectorAll(domId);

            if (elems.length) {
                elems.forEach((elem) => {
                    if (mediaCategory == 'aria') {
                        elem = elem.closest('div');
                    }

                    elem.style.display = extensionEnabled ? 'none' : 'block';
                })
            }
        });
    });

    _manageReviewResults(extensionEnabled);
};

_manageReviewResults = (extensionEnabled) => {
    let cites = document.getElementsByTagName("cite");

    for (let item of cites) {
        if (item.innerHTML.toLowerCase().match(/(review)/g)) {
            item.closest(".g").style.display = extensionEnabled ? "none" : "block";
        }
    }
};
