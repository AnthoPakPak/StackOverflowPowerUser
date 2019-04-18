//region Booleans

/**
 * Check if current page is a question and not a profile page, questions list, etc.
 * @returns {boolean} true if current page is a question, false instead
 */
function currentStackOverflowPageIsAQuestionAnswerPage() {
    return document.getElementsByClassName("question-page").length === 1;
}


/**
 * Check if question has almost one answer.
 * @returns {boolean} true if question has one answer or more
 */
function questionHasAlmostOneAnswer() {
    return getNbAnswers() !== 0;
}


/**
 * Check if question has an accepted answer.
 * @returns {boolean} true if question has an accepted answer
 */
function questionHasAcceptedAnswer() {
    return document.getElementsByClassName("js-accepted-answer-indicator d-none").length > 0; //depuis update SO il y a plusieurs elements avec cette classe, mais un seul n'a pas la classe "d-none" (qui permet de cacher)
}


/**
 * Check if user is logged into its SO account.
 * @returns {boolean} true if user is logged in
 */
function userIsLoggedIn() {
    return document.getElementsByClassName("-rep js-header-rep").length > 0;
}

//endregion



//region Values

/**
 * Get the question number of answers.
 * @returns {number} number of answers
 */
function getNbAnswers() {
    return document.getElementsByClassName("answer").length;
}


/**
 * Get the number of votes for answer at passed index.
 * @param index index of the answer
 * @returns {number} number of votes
 */
function getNbVotesForAnswerAtIndex(index) {
    return parseInt((document.getElementsByClassName("js-vote-count")[index]).innerHTML);
}


/**
 * Get the reputation of the user, as a string.
 * It has this kind of format : 342 | 1,872 | 13k
 * @returns {string} reputation of user
 */
function getReputationString() {
    return document.getElementsByClassName("-rep js-header-rep")[0].innerHTML;
}

//endregion