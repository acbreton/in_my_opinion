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
    let reportLink = document.getElementById("reportLink");
    webStoreLink.addEventListener("click", openStoreLink);
    rateLink.addEventListener("click", openRateLink);
    reportLink.addEventListener("click", openReportLink);
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

// Opens a prefilled GitHub issue form so users can suggest a rating/review
// element to hide. The active tab's URL and hostname are captured to give the
// report context. These labeled issues are the running list of suggestions.
const REPO = "acbreton/in_my_opinion";

function openReportLink() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        const pageUrl = tab && tab.url ? tab.url : "";
        let host = "";
        try {
            host = pageUrl ? new URL(pageUrl).hostname : "";
        } catch (e) {
            host = "";
        }

        const params = new URLSearchParams({
            template: "selector-request.yml",
            labels: "selector-request",
        });
        if (host) params.set("title", `Hide ratings on ${host}`);
        if (host) params.set("site", host);
        if (pageUrl) params.set("page_url", pageUrl);

        chrome.tabs.create({
            active: true,
            url: `https://github.com/${REPO}/issues/new?${params.toString()}`,
        });
    });
}
