"use strict";

// Maintains an adblock-style "hidden today" counter and renders it as the
// integer badge on the extension icon. Content scripts report how many rating
// elements they hid; this worker accumulates the total for the current day.
//
// The count resets at local midnight and is cleared whenever the extension is
// toggled off. Badge state lives in the browser UI, so it survives the MV3
// service worker being suspended between messages.

const action = chrome.action || chrome.browserAction;

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function renderBadge(count, enabled) {
    if (!action || !action.setBadgeText) return;
    const text = enabled && count > 0 ? String(count) : "";
    action.setBadgeText({ text });
}

function refreshBadge() {
    chrome.storage.local.get(["enabled", "hiddenCount", "hiddenDate"], (r) => {
        const enabled = r.enabled !== undefined ? r.enabled : true;
        const count = r.hiddenDate === todayKey() ? (r.hiddenCount || 0) : 0;
        renderBadge(count, enabled);
    });
}

function addHidden(delta) {
    if (!delta || delta < 0) return;
    chrome.storage.local.get(["enabled", "hiddenCount", "hiddenDate"], (r) => {
        const enabled = r.enabled !== undefined ? r.enabled : true;
        if (!enabled) return;
        const today = todayKey();
        const base = r.hiddenDate === today ? (r.hiddenCount || 0) : 0;
        const count = base + delta;
        chrome.storage.local.set({ hiddenCount: count, hiddenDate: today }, () => {
            renderBadge(count, enabled);
        });
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "imo-hidden" && typeof msg.count === "number") {
        addHidden(msg.count);
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "enabled" in changes) {
        refreshBadge();
    }
});

if (action && action.setBadgeBackgroundColor) {
    action.setBadgeBackgroundColor({ color: "#555555" });
}

if (chrome.runtime.onStartup) chrome.runtime.onStartup.addListener(refreshBadge);
if (chrome.runtime.onInstalled) chrome.runtime.onInstalled.addListener(refreshBadge);

refreshBadge();
