const appVersion = chrome.runtime.getManifest().version;
document.getElementById('appVersion').innerHTML = appVersion;

const toggle = document.getElementById('toggleExtension');
chrome.storage.local.get('enabled', (result) => {
    let isEnabled = !!result ? !!result.enabled : true;
    toggle.checked = isEnabled;
});

document.querySelector('#movies').addEventListener('change', changeHandler);
document.querySelector('#tv').addEventListener('change', changeHandler);
document.querySelector('#books').addEventListener('change', changeHandler);
document.querySelector('#games').addEventListener('change', changeHandler);
document.querySelector('#general').addEventListener('change', changeHandler);

toggle.addEventListener("change", () => {
    toggle.checked = !!toggle.checked;
    chrome.storage.local.set({'enabled': toggle.checked}, () => {});

    let extensionSettings = document.getElementById('extensionSettings');
    extensionSettings.style.display = toggle.checked ? 'block' : 'none';
});

function changeHandler(event) {
    chrome.storage.local.set({ [event.target.id]: event.target.checked })
}

