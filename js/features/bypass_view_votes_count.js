
function setupBypassVotesCount() {

    var script = document.createElement('script');
    script.src = chrome.runtime.getURL("js/features/bypass_view_votes_count_script.js");
    script.onload = function () {
        this.remove();
    };

    document.head.appendChild(script);
    script.parentNode.removeChild(script);
}