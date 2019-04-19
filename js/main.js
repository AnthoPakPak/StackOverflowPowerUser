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

    //SIDEBAR

    if (userPrefs.showSidebarEnabled) {
        setupSidebarWithVotesCounts();
    }


    //INDICATORS

    if (userPrefs.betterAnswerEnabled) {
        showBetterAnswerImageOnAcceptedAnswerIfNeeded();
    }

    if (userPrefs.noAnswerEnabled) {
        showNoAnswerImageOnQuestionIfNeeded();
    }


    //NAVIGATION

    if (userPrefs.autoScrollFirstAnswerEnabled) {
        scrollToFirstAnswerOnLoad();
    }

    if (userPrefs.navigationArrowKeysEnabled) {
        setupArrowsKeystrokesListeners();
    }


    //MISCELLANEOUS

    if (userPrefs.autoExpandVotesCountEnabled) {
        autoExpandVotesCounts();
    }

    if (userPrefs.stickyScrollOnUpvoteButtons) {
        addStickyScrollToUpvoteButtons();
    }

    if (userPrefs.expandAllCommentsOnCtrlfEnabled) {
        document.addEventListener("keydown", expandAllCommentsOnCtrlF, false);
    }


    //HIDE ELEMENTS

    if (!userPrefs.hideStackOverflowLeftSidebar) {
        unhideLeftSidebar();
    }

    if (userPrefs.hideHotNetworkQuestions) {
        hideHotNetworkQuestions();
    }

    if (userPrefs.hideMetaPosts) {
        hideMetaPosts();
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
        expandAllCommentsOnCtrlfEnabled: true,
        hideHotNetworkQuestions: false,
        hideMetaPosts: false
    }, function(items) {
        userPrefs = items;
        callback();
    });
}

//endregion