function checkForBetterAnswer() {
    if (document.getElementsByClassName("answer").length >= 2) { //s'il y a au moins 2 réponses
        let nbVotesAcceptedAnswer = parseInt((document.getElementsByClassName("js-vote-count")[acceptedAnswerId]).innerHTML);
        let nbVotesNextAnswer = parseInt((document.getElementsByClassName("js-vote-count")[nextAnswerId]).innerHTML);

        //console.log(nbVotesAcceptedAnswer);
        //console.log(nbVotesNextAnswer);

        if (nbVotesNextAnswer > nbVotesAcceptedAnswer) {
            //console.log("There's a better answer !");

            showArrowDownImageOnAcceptedAnswer();
        } else {
            //console.log("No better answer…");
        }
    } else {
        //console.log("pas assez de réponses")
    }
}

function showArrowDownImageOnAcceptedAnswer() {
    let acceptedAnswerVoteDiv = document.getElementsByClassName("js-voting-container")[acceptedAnswerId];

    let goDownLink = document.createElement("A");
    //goDownLink.src ="#";
    goDownLink.onclick = scrollToNextAnswer;

    let goDownImg = document.createElement("IMG");
    //goDownImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Human-go-down.svg/2000px-Human-go-down.svg.png";
    goDownImg.src = chrome.extension.getURL('/images/arrow_down_200.png');
    goDownImg.width = 40;
    goDownLink.appendChild(goDownImg);

    acceptedAnswerVoteDiv.appendChild(goDownLink);
}