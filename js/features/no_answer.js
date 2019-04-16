function showNoAnswerImageOnQuestion() {
    let questionVoteDiv = document.getElementsByClassName("js-voting-container")[questionId];

    let noAnswerImg = document.createElement("IMG");
    noAnswerImg.src = chrome.extension.getURL('/images/worrying-emoji.png');
    noAnswerImg.width = 40;

    questionVoteDiv.appendChild(noAnswerImg);
}