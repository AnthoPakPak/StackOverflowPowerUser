/**
 * Allow users to expand vote counts without having more than 1000 reputation points.
 * 
 * Integrated by @thedemons (https://github.com/AnthoPakPak/StackOverflowPowerUser/pull/6), based on a script written by Rob Wu, published under the Creative Commons 3.0 SA license. Website: http://stackapps.com/q/3082/9699.
 */
function setupBypassMinRepToViewVoteCounts() {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL("js/externals/bypass_min_rep_view_vote_counts_script.js");
    script.onload = function () {
        this.remove();
    };

    document.head.appendChild(script);
    script.parentNode.removeChild(script);
}