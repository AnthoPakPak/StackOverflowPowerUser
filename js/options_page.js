window.onload = function() {
    restoreSettings();
    document.getElementById('saveButton').addEventListener('click', saveSettings);
};


/**
 * Saves settings to `chrome.storage`
 */
function saveSettings() {
    let betterAnswerEnabled = document.getElementById('betterAnswerEnabled').checked;
    let noAnswerEnabled = document.getElementById('noAnswerEnabled').checked;
    let autoScrollFirstAnswerEnabled = document.getElementById('autoScrollFirstAnswerEnabled').checked;
    let showSidebarEnabled = document.getElementById('showSidebarEnabled').checked;
    let navigationArrowKeysEnabled = document.getElementById('navigationArrowKeysEnabled').checked;
    let autoExpandVotesCountEnabled = document.getElementById('autoExpandVotesCountEnabled').checked;
    let hideStackOverflowLeftSidebar = document.getElementById('hideStackOverflowLeftSidebar').checked;
    let stickyScrollOnUpvoteButtons = document.getElementById('stickyScrollOnUpvoteButtons').checked;
    let expandAllCommentsOnCtrlfEnabled = document.getElementById('expandAllCommentsOnCtrlfEnabled').checked;
    let hideHotNetworkQuestions = document.getElementById('hideHotNetworkQuestions').checked;
    let hideMetaPosts = document.getElementById('hideMetaPosts').checked;
    chrome.storage.sync.set({
        betterAnswerEnabled: betterAnswerEnabled,
        noAnswerEnabled: noAnswerEnabled,
        autoScrollFirstAnswerEnabled: autoScrollFirstAnswerEnabled,
        showSidebarEnabled: showSidebarEnabled,
        navigationArrowKeysEnabled: navigationArrowKeysEnabled,
        autoExpandVotesCountEnabled: autoExpandVotesCountEnabled,
        hideStackOverflowLeftSidebar: hideStackOverflowLeftSidebar,
        stickyScrollOnUpvoteButtons: stickyScrollOnUpvoteButtons,
        expandAllCommentsOnCtrlfEnabled: expandAllCommentsOnCtrlfEnabled,
        hideHotNetworkQuestions: hideHotNetworkQuestions,
        hideMetaPosts: hideMetaPosts
    }, function() {
        showSaveConfirmation();
        return false;
    });
}


/**
 * Restore previous settings that are stored in `chrome.storage`
 */
function restoreSettings() {
    chrome.storage.sync.get({
        betterAnswerEnabled: true,
        noAnswerEnabled: true,
        autoScrollFirstAnswerEnabled: false,
        showSidebarEnabled: true,
        navigationArrowKeysEnabled: true,
        autoExpandVotesCountEnabled: true,
        hideStackOverflowLeftSidebar: true,
        stickyScrollOnUpvoteButtons: true,
        expandAllCommentsOnCtrlfEnabled: true,
        hideHotNetworkQuestions: false,
        hideMetaPosts: false
    }, function(items) {
        document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
        document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
        document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
        document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
        document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
        document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
        document.getElementById('hideStackOverflowLeftSidebar').checked = items.hideStackOverflowLeftSidebar;
        document.getElementById('stickyScrollOnUpvoteButtons').checked = items.stickyScrollOnUpvoteButtons;
        document.getElementById('expandAllCommentsOnCtrlfEnabled').checked = items.expandAllCommentsOnCtrlfEnabled;
        document.getElementById('hideHotNetworkQuestions').checked = items.hideHotNetworkQuestions;
        document.getElementById('hideMetaPosts').checked = items.hideMetaPosts;
    });
}


/**
 * Quickly show a Saved confirmation text
 */
function showSaveConfirmation() {
    document.getElementById('confirmation').innerHTML = "Options saved !";
    let x = setInterval(function() {
        document.getElementById('confirmation').innerHTML = "";
        clearInterval(x);
    }, 2000);
}