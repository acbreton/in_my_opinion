let isEnabled;
let html = document.getElementsByTagName("html")[0];
let placeholderDiv = document.createElement("div");

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
}

function removePlaceholder() {
    html.removeChild(placeholderDiv);
    html.style.overflowY = 'inherit';
}

function init() {
    createLoadingPlaceholder();
    window.onload = function() {
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
    };
}

function runScripts(extensionEnabled = true) {
    if (window.location.host.includes("imdb")) {
        const classNamesToRemove = [
            '[class^="RatingBar"]',
            '[class*="rating-star-group"]',
            '[class*="ReviewContent"]',
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