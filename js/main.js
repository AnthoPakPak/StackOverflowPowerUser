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

    // sandbox();

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

    if (userPrefs.hideHotNetworkQuestions) {
        hideHotNetworkQuestions();
    }

    if (userPrefs.hideMetaPosts) {
        hideMetaPosts();
    }






});

function sandbox() {
    //SANDBOX FOR CODE TESTING
    //TODO auto click on all upvoted question/answer + add result date in DOM

    //the date popup is shown when clicking again on a previously upvoted answer, and it looks like this:
    // <p class="m0 js-toast-body" id="js-notice-toast-message" role="status" tabindex="0">You last voted on this answer Oct 24 at 14:21. Your vote is now locked in unless this answer is edited.</p>

    console.log("Sandbox!");
    console.log("Get upvoted date");

    let body = document.getElementsByTagName("BODY")[0]; //alert direct parent is body (no chance…)
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer = new MutationObserver(function(mutations, observer) {
        console.log("layout changed!");

        let alertPopup = document.getElementById("js-notice-toast-message");
        if (alertPopup) {
            setTimeout(function () {
                if (alertPopup.innerText.indexOf("You last voted on this") !== -1) {

                    alertPopup.parentNode.parentNode.parentNode.style.display = 'none';

                    let startIndex = alertPopup.innerText.indexOf("answer") !== -1 ? "You last voted on this answer ".length : "You last voted on this question ".length;

                    let date = alertPopup.innerText;
                    date = date.substring(startIndex, date.indexOf("."));
                    console.log(date);

                    //HERE ADD to DOM
                }

            }, 10);
        }

        //observer.disconnect();
    });

    observer.observe(body, { childList:true });


    setTimeout(function () {
        let allUpvotedButtons = document.getElementsByClassName("js-vote-up-btn fc-theme-primary");
        console.log("allUpvotedButtons " + allUpvotedButtons.length);
        for (let i = 0; i < allUpvotedButtons.length; i++) {
            setTimeout(function () {
                allUpvotedButtons[i].click();
            }, 500 * (i + 1));
        }
    }, 200);
}


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