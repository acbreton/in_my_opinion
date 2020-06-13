const appVersion = chrome.runtime.getManifest().version;
document.getElementById('appVersion').innerHTML = appVersion;

const toggle = document.getElementById('toggleExtension');

chrome.storage.local.get('enabled', (result) => {
    let isEnabled = (result.enabled !== undefined) ? result.enabled : true;
    toggle.checked = isEnabled;

    if (isEnabled) populateChecks();
});

toggle.addEventListener('change', () => {
    toggle.checked = !!toggle.checked;
    chrome.storage.local.set({'enabled': toggle.checked}, () => toggle.checked && populateChecks());

    let extensionSettings = document.getElementById('extensionSettings');
    extensionSettings.style.display = toggle.checked ? 'block' : 'none';
});

const categories = ["movies", "tv", "books", "games", "google_users"];

categories.forEach((category) => {
    document.querySelector(`#${category}`).addEventListener('change', changeHandler);
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

document.addEventListener('DOMContentLoaded', () => {
    let webStoreLink = document.getElementById("webStoreLink");
    webStoreLink.addEventListener("click", openLink);
});

function openLink() {
    chrome.tabs.create({
        active: true, url: "https://chrome.google.com/webstore/detail/in-my-opinion/lkopodamggoocbopennlkmhbmhohlkdc"
    });
}