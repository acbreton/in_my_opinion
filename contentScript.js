let isEnabled;

chrome.storage.local.get('enabled', (result) => {
    isEnabled = !!result ? !!result.enabled : true;
    runScripts(isEnabled);
});

chrome.storage.onChanged.addListener((changes) => {
    changes.enabled ? runScripts(changes.enabled.newValue) : runScripts(isEnabled);
});

function runScripts(takeThemAway) {
    const dataAttributesToRemove = {
        "movies": [
            '[data-attrid="kc:/film/film:reviews"]',
            '[data-attrid="kc:/film/film:critic_reviews"]'
        ],
        "tv": [
            '[data-attrid="kc:/tv/tv_program:reviews"]'
        ],
        "books": [
            '[data-attrid="kc:/book/book:reviews"]'
        ],
        "games": [
            '[data-attrid="kc:/cvg/computer_videogame:reviews"]'
        ],
        "google_users": [
            '[data-attrid="kc:/ugc:thumbs_up"]',
            '[data-attrid="kc:/ugc:user_reviews"]',
            '[data-starbar-class="rating-list"]'
        ]
    }

    chrome.storage.local.get((result) => {
        const disabledCategories = Object.keys(result).filter((key) => !result[key])
        return _omitCategories(disabledCategories, dataAttributesToRemove, takeThemAway);
    });

    if(window.location.host === 'www.google.com') {
        // Get the star ratings for the individual search results.
        const titleStars = document.getElementsByTagName('g-review-stars');

        // Hide the star ratings.
        for(let title of titleStars) {
            title.parentElement.style.display = takeThemAway ? 'none' : 'block';
        }

    } else if(window.location.host === 'www.imdb.com') {
        const classNamesToRemove = ['titleReviewBar', 'ratings_wrapper']

        for(let className of classNamesToRemove) {
            let elems = document.getElementsByClassName(className);

            if(elems.length) {
                for(let elem of elems) {
                    elem.style.display = takeThemAway ? 'none' : 'block';
                }
            }
        }

        const idsToRemove = ['titleUserReviewsTeaser','ratingWidget']
        for(let id of idsToRemove) {
            let elem = document.getElementById(id);
            if (elem && elem.parentNode) {
                elem.style.display = takeThemAway ? 'none' : 'block';
            }
        }
    }
}


_omitCategories = (disabledCategories, dataAttributesToRemove, takeThemAway) => {
    Object.keys(dataAttributesToRemove).forEach((category) => {
        dataAttributesToRemove[category].forEach((item) => {
            let elem = document.querySelector(item);

            if(elem) {
                if(disabledCategories.includes(category)) {
                    elem.style.display = 'block';
                } else {
                    elem.style.display = takeThemAway ? 'none' : 'block';
                }
            }
        })
    })
}
