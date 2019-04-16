function currentStackOverflowPageIsAQuestionAnswerPage() {
    return document.getElementsByClassName("question-page").length === 1;
}

function questionHasAlmostOneAnswer() {
    return document.getElementsByClassName("answer").length !== 0;
}

function questionHasAccepedAnswer() {
    return document.getElementsByClassName("js-accepted-answer-indicator d-none").length > 0; //depuis update SO il y a plusieurs elements avec cette classe, mais un seul n'a pas la classe "d-none" (qui permet de cacher)
}