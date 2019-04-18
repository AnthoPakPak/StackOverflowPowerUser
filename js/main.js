/**
 * Post IDs
 */
const questionId = 0;
const acceptedAnswerId = 1; //it could also be the first answer if there isn't any accepted answer
const nextAnswerId = 2;

let userPrefs = {};


/**
 * Get the user preferences then execute the code to enable each feature individually.
 */
getUserPrefs(function() {
    //Avoid executing code on other SE pages, such as profile, Questions lists, etc
    if (!currentStackOverflowPageIsAQuestionAnswerPage()) {
        return;
    }


    if (userPrefs.noAnswerEnabled) {
        showNoAnswerImageOnQuestionIfNeeded();
    }

    if (userPrefs.betterAnswerEnabled) {
        showBetterAnswerImageOnAcceptedAnswerIfNeeded();
    }

    if (userPrefs.autoScrollFirstAnswerEnabled) {
        scrollToFirstAnswerOnLoad();
    }

    if (userPrefs.showSidebarEnabled) {
        setupSidebarWithVotesCounts();
    }

    if (userPrefs.autoExpandVotesCountEnabled) {
        autoExpandVotesCounts();
    }

    if (!userPrefs.hideStackOverflowLeftSidebar) {
        unhideLeftSidebar();
    }

    if (userPrefs.navigationArrowKeysEnabled) {
        setupArrowsKeystrokesListeners();
    }

    if (userPrefs.expandAllCommentsOnCtrlfEnabled) {
        document.addEventListener("keydown", expandAllCommentsOnCtrlF, false); //TODO create the setting
    }

    if (userPrefs.stickyScrollOnUpvoteButtons) {
        addStickyScrollToUpvoteButtons();
    }
});



//region UserPrefs

/**
 * Fetch extension settings from Chrome storage.
 * @param callback called when preferences are fetched
 */
function getUserPrefs(callback) {
    chrome.storage.sync.get({
        betterAnswerEnabled: true,
        noAnswerEnabled: true,
        autoScrollFirstAnswerEnabled: false,
        showSidebarEnabled: true,
        navigationArrowKeysEnabled: true,
        autoExpandVotesCountEnabled: true,
        hideStackOverflowLeftSidebar: true,
        stickyScrollOnUpvoteButtons: true,
        expandAllCommentsOnCtrlfEnabled: true
    }, function(items) {
        userPrefs = items;
        callback();
    });
}

//endregion