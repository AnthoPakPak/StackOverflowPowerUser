window.onload = function() {
    restoreSettings();
    document.getElementById('saveButton').addEventListener('click', saveSettings);
};

// Saves options to chrome.storage
function saveSettings() {
    let betterAnswerEnabled = document.getElementById('betterAnswerEnabled').checked;
    let noAnswerEnabled = document.getElementById('noAnswerEnabled').checked;
    let autoScrollFirstAnswerEnabled = document.getElementById('autoScrollFirstAnswerEnabled').checked;
    let showSidebarEnabled = document.getElementById('showSidebarEnabled').checked;
    let navigationArrowKeysEnabled = document.getElementById('navigationArrowKeysEnabled').checked;
    let autoExpandVotesCountEnabled = document.getElementById('autoExpandVotesCountEnabled').checked;
    let hideStackOverflowLeftSidebar = document.getElementById('hideStackOverflowLeftSidebar').checked;
    let stickyScrollOnUpvoteButtons = document.getElementById('stickyScrollOnUpvoteButtons').checked;
    chrome.storage.sync.set({
        betterAnswerEnabled: betterAnswerEnabled,
        noAnswerEnabled: noAnswerEnabled,
        autoScrollFirstAnswerEnabled: autoScrollFirstAnswerEnabled,
        showSidebarEnabled: showSidebarEnabled,
        navigationArrowKeysEnabled: navigationArrowKeysEnabled,
        autoExpandVotesCountEnabled: autoExpandVotesCountEnabled,
        hideStackOverflowLeftSidebar: hideStackOverflowLeftSidebar,
        stickyScrollOnUpvoteButtons: stickyScrollOnUpvoteButtons
    }, function() {
        showSaveConfirmation();
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreSettings() {
    chrome.storage.sync.get({
        betterAnswerEnabled: true,
        noAnswerEnabled: true,
        autoScrollFirstAnswerEnabled: false,
        showSidebarEnabled: true,
        navigationArrowKeysEnabled: true,
        autoExpandVotesCountEnabled: true,
        hideStackOverflowLeftSidebar: true,
        stickyScrollOnUpvoteButtons: true
    }, function(items) {
        document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
        document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
        document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
        document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
        document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
        document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
        document.getElementById('hideStackOverflowLeftSidebar').checked = items.hideStackOverflowLeftSidebar;
        document.getElementById('stickyScrollOnUpvoteButtons').checked = items.stickyScrollOnUpvoteButtons;
    });
}

function showSaveConfirmation() {
    document.getElementById('confirmation').innerHTML = "Options saved !";
    let x = setInterval(function() {
        document.getElementById('confirmation').innerHTML = "";
        clearInterval(x);
    }, 2000);
    return false;
}