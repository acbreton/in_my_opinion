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
        movies: [
            '[data-attrid="kc:/film/film:reviews"]',
            '[data-attrid="kc:/film/film:critic_reviews"]',
        ],
        tv: ['[data-attrid="kc:/tv/tv_program:reviews"]'],
        books: ['[data-attrid="kc:/book/book:reviews"]'],
        games: ['[data-attrid="kc:/cvg/computer_videogame:reviews"]'],
        google_users: [
            '[data-attrid="kc:/ugc:top_thumbs_up"]',
            '[data-attrid="kc:/ugc:thumbs_up"]',
            '[data-attrid="kc:/ugc:user_reviews"]',
            '[data-starbar-class="rating-list"]',
        ],
    };

    chrome.storage.local.get((result) => {
        const disabledCategories = Object.keys(result).filter(
            (key) => !result[key]
        );
        return _omitCategories(
            disabledCategories,
            dataAttributesToRemove,
            extensionEnabled
        );
    });

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

_omitCategories = (
    disabledCategories,
    dataAttributesToRemove,
    extensionEnabled
) => {
    if (!disabledCategories.includes("review_sites")) {
        _manageReviewResults(extensionEnabled);
    }

    Object.keys(dataAttributesToRemove).forEach((category) => {
        dataAttributesToRemove[category].forEach((item) => {
            let elem = document.querySelector(item);

            if (elem) {
                elem.style.display = disabledCategories.includes(category)
                    ? "block"
                    : "none";
            }
        });
    });
};

_manageReviewResults = (extensionEnabled) => {
    let cites = document.getElementsByTagName("cite");

    for (let item of cites) {
        if (item.innerHTML.toLowerCase().match(/(review)/g)) {
            item.closest(".g").style.display = extensionEnabled ? "none" : "block";
        }
    }
};
