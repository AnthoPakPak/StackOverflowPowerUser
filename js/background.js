/**
 * Open `options_page.html` on extension install
 * Open `changelog.html` on extension update
 */
chrome.runtime.onInstalled.addListener(function (details){
    if (details.reason === "install") {
        chrome.tabs.create({url:chrome.runtime.getURL("options_page.html")},function(){})
    } else if (details.reason === "update") {
        chrome.tabs.create({url:chrome.runtime.getURL("changelog.html")},function(){})
    }
});