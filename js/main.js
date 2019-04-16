//Posts IDs
const questionId = 0;
const acceptedAnswerId = 1; //it could also be the first answer if there isn't any accepted answer
const nextAnswerId = 2;

let userPrefs = {};


//get userPrefs then execute the code
getUserPrefs(function() {
    //Avoid executing code on other SE pages, such as profile, Questions lists, etc
    if (!currentStackOverflowPageIsAQuestionAnswerPage()) {
        return;
    }


    if (userPrefs.noAnswerEnabled) {
        if (!questionHasAlmostOneAnswer()) {
            showNoAnswerImageOnQuestion();
        }
    }

    if (userPrefs.betterAnswerEnabled) {
        if (questionHasAlmostOneAnswer()) {
            if (questionHasAccepedAnswer()) {
                checkForBetterAnswer();
            }
        }
    }

    if (userPrefs.autoScrollFirstAnswerEnabled && questionHasAlmostOneAnswer()) {
        //currently it just scrolls to first answer (not the best one)
        scrollToFirstAnswerOnLoad();
    }

    if (userPrefs.showSidebarEnabled) {
        showSidebarWithVotesCount();
        checkIfIHaveAlreadyUpvotedAnAnswer();
        addListenerOnUpvoteButtons();
    }

    if (userPrefs.autoExpandVotesCountEnabled) {
        autoExpandVotesCounts();
    }

    if (!userPrefs.hideStackOverflowLeftSidebar) {
        document.getElementById("left-sidebar").style.display = 'block'; //I've hidden it by default in CSS, to not see it blink. If feature is disabled, we set it display property back to block
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