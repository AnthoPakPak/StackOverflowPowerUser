/**
 * Check if question hasn't got answers, and show an indicator accordingly.
 */
function showNoAnswerImageOnQuestionIfNeeded() {
    if (!questionHasAlmostOneAnswer()) {
        showNoAnswerImageOnQuestion();
    }
}


/**
 * Show a really-disappointed image on the SO question that hasn't got any answers.
 */
function showNoAnswerImageOnQuestion() {
    let questionVoteDiv = document.getElementsByClassName("js-voting-container")[questionId];

    let noAnswerImg = document.createElement("IMG");
    noAnswerImg.src = chrome.extension.getURL('/img/worrying_emoji.png');
    noAnswerImg.width = 40;

    questionVoteDiv.appendChild(noAnswerImg);
}