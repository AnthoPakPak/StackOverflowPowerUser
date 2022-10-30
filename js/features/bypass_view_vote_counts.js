
function setupBypassViewVoteCounts() {

    var script = document.createElement('script');
    script.src = chrome.runtime.getURL("js/externals/bypass_view_vote_counts_script.js");
    script.onload = function () {
        this.remove();
    };

    document.head.appendChild(script);
    script.parentNode.removeChild(script);
}