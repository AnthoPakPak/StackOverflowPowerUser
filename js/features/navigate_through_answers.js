let currentViewedPost = 0; //by default currentViewedPost is the question, so 0. If `autoScrollFirstAnswerEnabled` feature is enabled, it will be 1.
let isHoldingModifierKey = false; //made to avoid conflict with modifiers keys such as cmd, ctrl, alt, shift…


/**
 * Scroll to answer at passed index.
 * @param index index of the answer to scroll to
 * @param smooth whether we want to scroll to the answer smoothly or not
 */
function scrollToAnswerAtIndex(index, smooth) {
    let scrollToDiv = document.getElementsByClassName("answer")[index-1];

    if (index <= 0) { //let's scroll to the top of the question
        scrollToDiv = document.getElementById("question-header");
    }

    if (scrollToDiv) {
        if (smooth) {
            window.scroll({
                top: scrollToDiv.offsetTop,
                left: 0,
                behavior: 'smooth'
            });
        } else {
            window.scroll({
                top: scrollToDiv.offsetTop,
                left: 0
            });
        }

        currentViewedPost = index;

        expandVotesCountOnIndex(index, false);
    }
}


/**
 * Scroll to previous answer.
 * Note that `currentViewedPost` isn't updated when you scroll manually between answers.
 * @param smooth scroll smoothly or not
 */
function scrollToPreviousAnswer(smooth) {
    if (currentViewedPost > 0) {
        currentViewedPost--;
        scrollToAnswerAtIndex(currentViewedPost, smooth);
    }
}


/**
 * Scroll to next answer.
 * Note that `currentViewedPost` isn't updated when you scroll manually between answers.
 * @param smooth scroll smoothly or not
 */
function scrollToNextAnswer(smooth) {
    if (currentViewedPost < document.getElementsByClassName("answer").length) {
        currentViewedPost++;
        scrollToAnswerAtIndex(currentViewedPost, smooth);
    }
}


/**
 * Scroll to the better answer than the accepted one.
 */
function scrollToBetterAnswer() {
    scrollToAnswerAtIndex(nextAnswerId, true);
}


/**
 * Will scroll to the first answer immediately after page load.
 *
 * It will not scroll to the first answer in following cases :
 *      - Question doesn't have answers
 *      - URL was meant to directly lead to a specific answer, for example https://stackoverflow.com/a/11303693/4894980
 *      - Page has been refreshed, and thus we don't want to interfere with Chrome restoring the same scroll location
 */
function scrollToFirstAnswerOnLoad() {
    if (!questionHasAlmostOneAnswer()) { //doesn't try to scroll if question hasn't got answers
        return;
    }

    if(window.location.href.indexOf("#") > -1) { //if an answer id was passed in the URL, don't interfere with it
        return;
    }

    //Only scroll if page hasn't been reloaded (refreshed), if not it scrolls weirdly
    if (performance.navigation.type !== 1) {
        currentViewedPost = 1;

        //I'm not using scrollToAnswerAtIndex() as I don't want to expand votesCounts on page load
        let nextAnswerDiv = document.getElementsByClassName("answer")[acceptedAnswerId - 1];

        window.scroll({
            top: nextAnswerDiv.offsetTop,
            left: 0
        });
    }
}



//region Keystrokes

/**
 * Add key listeners so that we can recognize left/right arrows.
 */
function setupArrowsKeystrokesListeners() {
    document.addEventListener("keydown", clickArrowsToScrollAroundPosts, false);
    document.addEventListener("keyup", hasReleasedKey, false);

    //when user change tab, it will restore `isHoldingModifierKey`. Because if we change tab with keyboard shortcut, `isHoldingModifierKey` stays true.
    document.addEventListener('visibilitychange', function(){
        if (document.hidden) {
            isHoldingModifierKey = false;
        }
    });
}


/**
 * Detect left/right arrows keys to navigate through posts.
 * Note that smooth scroll cannot be used when using arrow keys (Chrome restriction).
 *
 * Keypress detection :
 * keyCode 37 refers to <- and keyCode 39 refers to ->
 *
 * @param event event
 */
function clickArrowsToScrollAroundPosts(event) {
    // console.log("key : " + event.keyCode);

    //If we are currently writing text in comment box or answer box, don't scroll answers with left/right arrows
    let textAreaArray = document.getElementsByTagName("textarea");
    for (let i = 0; i < textAreaArray.length; i++) {
        if (textAreaArray[i] === document.activeElement)
            return;
    }

    if (isHoldingModifierKey)
        return;

    if (event.keyCode === 37 || event.keyCode === 39) {
        if (event.keyCode === 37) { // left arrow
            scrollToPreviousAnswer(false);
        }
        else if (event.keyCode === 39) { // right arrow
            scrollToNextAnswer(false);
        }
    } else { //different from left/right arrows
        isHoldingModifierKey = true;
    }
}


/**
 * Called when releasing a key. It allow to check if user has made a key presses combination instead of just left/right arrow. (for example alt + left/right, etc).
 * @param event event
 */
function hasReleasedKey(event) {
    if (event.keyCode !== 37 && event.keyCode !== 39) {
        isHoldingModifierKey = false;
    }
}

//endregion