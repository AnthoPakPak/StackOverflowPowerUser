function showNoAnswerImageOnQuestion() {
    let questionVoteDiv = document.getElementsByClassName("js-voting-container")[questionId];

    let noAnswerImg = document.createElement("IMG");
    //goDownImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Human-go-down.svg/2000px-Human-go-down.svg.png";
    noAnswerImg.src = chrome.extension.getURL('/images/worrying-emoji.png');
    noAnswerImg.width = 40;

    questionVoteDiv.appendChild(noAnswerImg);
}