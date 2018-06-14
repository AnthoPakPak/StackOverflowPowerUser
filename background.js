//open options_page on extension install
chrome.runtime.onInstalled.addListener(function (details){
    if (details.reason === "install" || details.reason === "update") {
        chrome.tabs.create({url:chrome.extension.getURL("options_page.html")},function(){})
    }
});