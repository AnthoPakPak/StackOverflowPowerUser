/**
 * Check if there are answers, and if so, check if there is a better answer than the accepted one.
 *
 * Fun fact : this feature is the one that lead me to create this extension, that has now far more features ! Initially, the extension was named StackOverflow Better Answer :D
 */
function showBetterAnswerImageOnAcceptedAnswerIfNeeded() {
    if (questionHasAlmostOneAnswer()) {
        if (questionHasAcceptedAnswer()) {
            checkForBetterAnswer();
        }
    }
}


/**
 * Check if the answer below the accepted answer has more votes than the accepted one.
 * If so, it will add an arrow-down image to indicate that the answer below can be better than the accepted one.
 */
function checkForBetterAnswer() {
    if (getNbAnswers() >= 2) { //if there's at least 2 answers
        let nbVotesAcceptedAnswer = getNbVotesForAnswerAtIndex(acceptedAnswerId);
        let nbVotesNextAnswer = getNbVotesForAnswerAtIndex(nextAnswerId);

        if (nbVotesNextAnswer > nbVotesAcceptedAnswer) {
            //console.log("There's a better answer !");
            showArrowDownImageOnAcceptedAnswer();
        } else {
            //console.log("No better answer…");
        }
    }
}


/**
 * Add the arrow-down image next to the accepted answer to indicate that the answer below can be better than this one.
 * Clicking the arrow will scroll to the potentially-better answer.
 */
function showArrowDownImageOnAcceptedAnswer() {
    let acceptedAnswerVoteDiv = document.getElementsByClassName("js-voting-container")[acceptedAnswerId];

    let goDownLink = document.createElement("A");
    goDownLink.addEventListener("click", scrollToBetterAnswer);

    let goDownImg = document.createElement("IMG");
    goDownImg.src = chrome.extension.getURL('/img/arrow_down.png');
    goDownImg.width = 40;
    goDownLink.appendChild(goDownImg);

    acceptedAnswerVoteDiv.appendChild(goDownLink);
}