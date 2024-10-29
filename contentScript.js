let isEnabled;
let html = document.getElementsByTagName("html")[0];
let placeholderDiv = document.createElement("div");
placeholderDiv.setAttribute("id", "placeholder");

function createLoadingPlaceholder() {
    let newContent = document.createTextNode("Removing User and Critic Ratings...");

    placeholderDiv.style.height = "100%";
    placeholderDiv.style.width = "100%";
    placeholderDiv.style.position = "absolute";
    placeholderDiv.style.zIndex = "100";
    placeholderDiv.style.backgroundColor = "black";
    placeholderDiv.style.display = "flex";
    placeholderDiv.style.alignItems = "center";
    placeholderDiv.style.justifyContent = "center";
    placeholderDiv.style.color = "white";

    html.style.overflowY = 'hidden';

    placeholderDiv.appendChild(newContent);
    
    html.appendChild(placeholderDiv);

    // In case it doesn't remove on it's own
    setTimeout(() => removePlaceholder(), 7000);
}

function removePlaceholder() {
    let elem = document.getElementById('placeholder');
    elem && elem.parentNode.removeChild(elem);
    html.style.overflowY = 'inherit';
}

function init() {
    createLoadingPlaceholder();

    window.addEventListener('load', function() {
        chrome.storage.local.get("enabled", (result) => {
            isEnabled = result.enabled !== undefined ? result.enabled : true;
            
            if (isEnabled) {
                runScripts();
            }
        });

        chrome.storage.onChanged.addListener((changes) => {
            changes.enabled
                ? runScripts(changes.enabled.newValue)
                : runScripts(isEnabled);
        });
    }, false);
}

function runScripts(extensionEnabled = true) {
    if (window.location.host.includes("imdb")) {
        const classNamesToRemove = [
            '[class^="RatingBar"]',
            '[class*="rating"]',
            '[class*="ReviewContent"]',
            '[data-testid="awards"]',
            '[data-testid*="hero-rating-bar"]',
            '[data-testid*="reviewContent"]',
            '[data-testid="UserReviews"]',
        ];

        for (let className of classNamesToRemove) {
            let elems = document.querySelectorAll(className);

            if (elems.length) {
                for (elem of elems) {
                    elem.style.display = extensionEnabled ? "none" : "block";
                }
            }
        }

        removePlaceholder();
    }
}

init(html);
