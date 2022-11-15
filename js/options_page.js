let confirmationTimer;

window.onload = function() {
    restoreSettings();

    //Save settings on each input click
    let settingsForm = document.getElementById('settingsForm');
    let allInputs = settingsForm.getElementsByTagName("input");

    for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].addEventListener('click', saveSettings);
    }
};


/**
 * Saves settings to `chrome.storage`
 */
function saveSettings() {
    let adjustPageWidth = document.getElementById('adjustPageWidth').checked;
    let betterAnswerEnabled = document.getElementById('betterAnswerEnabled').checked;
    let noAnswerEnabled = document.getElementById('noAnswerEnabled').checked;
    let autoScrollFirstAnswerEnabled = document.getElementById('autoScrollFirstAnswerEnabled').checked;
    let showSidebarEnabled = document.getElementById('showSidebarEnabled').checked;
    let navigationArrowKeysEnabled = document.getElementById('navigationArrowKeysEnabled').checked;
    let bypassMinRepToViewVoteCountsEnabled = document.getElementById('bypassMinRepToViewVoteCountsEnabled').checked;
    let autoExpandVotesCountEnabled = document.getElementById('autoExpandVotesCountEnabled').checked;
    let stickyScrollOnUpvoteButtons = document.getElementById('stickyScrollOnUpvoteButtons').checked;
    let expandAllCommentsOnCtrlfEnabled = document.getElementById('expandAllCommentsOnCtrlfEnabled').checked;
    let hideHotNetworkQuestions = document.getElementById('hideHotNetworkQuestions').checked;
    let hideMetaPosts = document.getElementById('hideMetaPosts').checked;
    chrome.storage.sync.set({
        adjustPageWidth: adjustPageWidth,
        betterAnswerEnabled: betterAnswerEnabled,
        noAnswerEnabled: noAnswerEnabled,
        autoScrollFirstAnswerEnabled: autoScrollFirstAnswerEnabled,
        showSidebarEnabled: showSidebarEnabled,
        navigationArrowKeysEnabled: navigationArrowKeysEnabled,
        bypassMinRepToViewVoteCountsEnabled: bypassMinRepToViewVoteCountsEnabled,
        autoExpandVotesCountEnabled: autoExpandVotesCountEnabled,
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
        adjustPageWidth: true,
        betterAnswerEnabled: true,
        noAnswerEnabled: true,
        autoScrollFirstAnswerEnabled: false,
        showSidebarEnabled: true,
        navigationArrowKeysEnabled: true,
        bypassMinRepToViewVoteCountsEnabled: true,
        autoExpandVotesCountEnabled: true,
        stickyScrollOnUpvoteButtons: true,
        expandAllCommentsOnCtrlfEnabled: true,
        hideHotNetworkQuestions: false,
        hideMetaPosts: false
    }, function(items) {
        document.getElementById('adjustPageWidth').checked = items.adjustPageWidth;
        document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
        document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
        document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
        document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
        document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
        document.getElementById('bypassMinRepToViewVoteCountsEnabled').checked = items.bypassMinRepToViewVoteCountsEnabled;
        document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
        document.getElementById('stickyScrollOnUpvoteButtons').checked = items.stickyScrollOnUpvoteButtons;
        document.getElementById('expandAllCommentsOnCtrlfEnabled').checked = items.expandAllCommentsOnCtrlfEnabled;
        document.getElementById('hideHotNetworkQuestions').checked = items.hideHotNetworkQuestions;
        document.getElementById('hideMetaPosts').checked = items.hideMetaPosts;
    });
}


/**
 * Quickly show a Saved confirmation bottom bar
 */
function showSaveConfirmation() {
    clearTimeout(confirmationTimer); //clear any previous timer

    document.getElementById('saveConfirmationBottomBar').style.display = "block";
    confirmationTimer = setTimeout(function() {
        document.getElementById('saveConfirmationBottomBar').style.display = "none";
    }, 2000);
}
