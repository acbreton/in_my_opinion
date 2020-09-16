const appVersion = chrome.runtime.getManifest().version;
document.getElementById("appVersion").innerHTML = appVersion;

const toggle = document.getElementById("toggleExtension");

chrome.storage.local.get("enabled", (result) => {
    let isEnabled = (result.enabled !== undefined) ? result.enabled : true;
    toggle.checked = isEnabled;

    if (isEnabled) populateChecks();
});

toggle.addEventListener("change", () => {
    toggle.checked = !!toggle.checked;
    chrome.storage.local.set({"enabled": toggle.checked}, () => toggle.checked && populateChecks());

    let extensionOptions = document.getElementById("extensionOptions");
    extensionOptions.style.display = toggle.checked ? "block" : "none";
});

const categories = ["movies", "tv", "books", "games", "review_sites", "google_users"];

categories.forEach((category) => {
    document.querySelector(`#${category}`).addEventListener("change", changeHandler);
});

function changeHandler(event) {
    chrome.storage.local.set({ [event.target.id]: event.target.checked })
}

function populateChecks() {
    chrome.storage.local.get((result) => {
        for (let category of categories) {
            if (result[category] !== undefined) {
                document.getElementById(category).checked = result[category];
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let webStoreLink = document.getElementById("webStoreLink");
    let rateLink = document.getElementById("reviewLink");
    webStoreLink.addEventListener("click", openStoreLink);
    rateLink.addEventListener("click", openRateLink);
});

function openStoreLink() {
    chrome.tabs.create({
        active: true, url: "https://chrome.google.com/webstore/detail/in-my-opinion/lkopodamggoocbopennlkmhbmhohlkdc"
    });
}

function openRateLink() {
    chrome.tabs.create({
        active: true, url: "https://chrome.google.com/webstore/detail/in-my-opinion/lkopodamggoocbopennlkmhbmhohlkdc/reviews"
    })
}