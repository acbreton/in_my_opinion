const toggle = document.getElementById('toggleExtension');

toggle.addEventListener("change", function () {
    toggle.checked = !!toggle.checked;

    chrome.storage.local.set({'enabled': toggle.checked}, () => {});
});