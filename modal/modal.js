const toggle = document.getElementById('toggleExtension');
chrome.storage.local.get('enabled', function(result) {
    let isEnabled = !!result ? !!result.enabled : true;
    document.getElementById('toggleExtension').checked = isEnabled;
});

toggle.addEventListener("change", function () {
    toggle.checked = !!toggle.checked;
    chrome.storage.local.set({'enabled': toggle.checked}, () => {});
});

const appVersion = chrome.runtime.getManifest().version;
document.getElementById('appVersion').innerHTML = appVersion;