/**
 *
 * NOTE : Code is ugly, it will be updated when I'll have time. Please be nice :)
 *
 * When I have time :
 * - Show last visited page date using https://developers.chrome.com/extensions/history#method-search & https://stackoverflow.com/a/14211874/4894980
 *
 */


const questionId = 0;
const acceptedAnswerId = 1;
const nextAnswerId = 2;

//CONFIG
var userPrefs = {};
const nbVotesCountsToAutoExpand = 4;
//const scrollToBestAnswerEnabled = true;
//const scrollAroundPostsWithArrowKeys = true;
const nbCellsInSidebar = 5;


var noAnswerOnQuestion = false;
var currentViewedPost = 0; //par défaut la question
var isHoldingModifierKey = false;

var lastExpandedVotesCountDateTime = 0; //TODO improve this to avoid reaching fetch vote counts limit


//get userPrefs then execute the code
getUserPrefs(function() {
    if (document.getElementsByClassName("question-page").length === 1) { //si on est bien sur une question
        if (userPrefs.noAnswerEnabled) {
            if (document.getElementsByClassName("answer").length === 0) { //pas de réponse
                noAnswerOnQuestion = true;
                showNoAnswerImageOnQuestion();
            }
        }

        if (userPrefs.betterAnswerEnabled) {
            if (!noAnswerOnQuestion) { //s'il y a des réponses
                if (document.getElementsByClassName("js-accepted-answer-indicator d-none").length > 0) { //si on a une réponse acceptée (depuis update SO il y a plusieurs elements avec cette classe, mais un seul n'a pas la classe "d-none" (qui permet de cacher)
                    //console.log("There's an accepted answer");
                    checkForBetterAnswer();
                } else {
                    //console.log("No accepted answer…");
                }
            }
        }

        if (userPrefs.autoScrollFirstAnswerEnabled && !noAnswerOnQuestion) {
            //currently it just scrolls to first answer (not the best one)
            scrollToFirstAnswer();
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
            document.getElementById("left-sidebar").style.display = 'block'; //we hide it by default, as to not see it blink
        }
    }

    if (userPrefs.navigationArrowKeysEnabled) {
        document.addEventListener("keydown", clickArrowsToScrollAroundPosts, false);
        document.addEventListener("keydown", expandAllCommentsOnCtrlF, false); //TODO move this in its own userPref

        document.addEventListener("keyup", hasReleasedKey, false);

        //détecte si l'user change de tab, car sinon quand on change avec les raccourcis clavier, isHoldingModifierKey reste vrai
        document.addEventListener('visibilitychange', function(){
            if (document.hidden) {
                isHoldingModifierKey = false;
            }
        });
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
        stickyScrollOnUpvoteButtons: true
    }, function(items) {
        userPrefs = items;
        callback();
        // document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
        // document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
        // document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
        // document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
        // document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
        // document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
    });
}

//endregion