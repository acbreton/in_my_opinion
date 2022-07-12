const appVersion = chrome.runtime.getManifest().version;
document.getElementById("appVersion").textContent = appVersion;

const toggle = document.getElementById("toggleExtension");

toggle.addEventListener("change", () => {
    toggle.checked = !!toggle.checked;
    chrome.storage.local.set({ "enabled": toggle.checked }, () => toggle.checked);
});

chrome.storage.local.get("enabled", (result) => {
    let isEnabled = (result.enabled !== undefined) ? result.enabled : true;
    toggle.checked = isEnabled;
});

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

function getBrowser() {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    }
}
