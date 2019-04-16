const nbCellsInSidebar = 5;

//region Answer already upvoted

function checkIfIHaveAlreadyUpvotedAnAnswer() {
    setTimeout(function () {
        let myUpvotesArray = document.getElementsByClassName("js-vote-up-btn fc-theme-primary");
        let allVotesArray = document.getElementsByClassName("js-voting-container");

        if (myUpvotesArray.length > 0) {
            //alert("Il y a une réponse déjà upvotée !");

            //on ajoute la classe upvotedAnswer à la cellule concernée dans la sidebar
            for (var i = 0; i < myUpvotesArray.length; i++) {
                let myUpvote = myUpvotesArray[i];

                for (var j = 0; j < allVotesArray.length; j++) {
                    if (allVotesArray[j] === myUpvote.parentNode) {
                        if (j > nbCellsInSidebar) {
                            alert("You have already upvoted an answer below, check it out.");
                            return;
                        }
                        addUpvotedClassToCellAtIndex(j, true);
                    }
                }
            }
        }
    }, 1000);

}

//endregion




//region Sidebar vote counts

//génére une sidebar reprise d'ici https://codepen.io/anon/pen/KodazE
function showSidebarWithVotesCount() {
    let votesCountArray = document.getElementsByClassName("js-vote-count");

    let ul = document.createElement("UL");
    ul.className = "social noselect";

    addNbAnswersInSidebar(ul, votesCountArray.length - 1);

    for (let i = 1; i < votesCountArray.length;i++) { //on commence à 1 car sinon c'est la question
        let li = document.createElement("LI");
        let a = document.createElement("A");
        //let span = document.createElement("SPAN"); // remettreForDetail
        //a.href = "#";
        li.addEventListener("click", function() {
            let targetElement = event.target || event.srcElement;
            console.log(targetElement);
            scrollToAnswerAtIndex(i, true);
        });

        let nbVotesAnswerI = (document.getElementsByClassName("js-vote-count")[i]).innerHTML;
        a.innerHTML = nbVotesAnswerI;

        //span.innerHTML = "100%"; //A remettre pour avoir le détail (remettreForDetail dans la fiche css)
        //a.appendChild(span);

        li.appendChild(a);
        ul.appendChild(li);

        if (i === nbCellsInSidebar) //nb cases dans la sidebar
            break;
    }

    //fleche droite gauches
    addLeftRightArrowsToUl(ul);

    document.body.appendChild(ul);
}

function addLeftRightArrowsToUl(ul) {
    let divForArrows = document.createElement("DIV");
    divForArrows.innerHTML = "<li style=\"margin-top:6px\">\n" +
        "    <a class=\"arrow\">⬅︎</a>\n" +
        "    <a class=\"arrow\"><div>⬅</div>︎</a>\n" +
        "</li>";

    ul.appendChild(divForArrows);

    let leftArrow = ul.getElementsByClassName("arrow")[0];
    leftArrow.addEventListener("click", function() {
        scrollToPreviousAnswer(true);
    });

    let rightArrow = ul.getElementsByClassName("arrow")[1];
    rightArrow.addEventListener("click", function() {
        scrollToNextAnswer(true);
    });
}


function addNbAnswersInSidebar(ul, nbAnswers) {
    let li = document.createElement("LI");
    let a = document.createElement("A");

    a.id = "nbAnswers";
    a.innerHTML = nbAnswers + "<br><div style=\"font-size:10px\">answers</div>";


    //add additional informations in popover
    let nbUpvotesOnQuestion = parseInt(document.getElementsByClassName("js-vote-count")[0].innerText);

    let nbFavorites = document.getElementsByClassName("js-favorite-count mt8")[0].innerHTML;
    if (nbFavorites === '') {
        nbFavorites = '0';
    }
    let nbViews = document.getElementById("qinfo").getElementsByTagName("b")[1].innerHTML.replace(' times', '');
    let asked = document.getElementById("qinfo").getElementsByTagName("b")[0].getElementsByTagName("time")[0].innerHTML;

    let lastActive;
    if (document.getElementById("qinfo").getElementsByTagName("b").length > 2) {
        lastActive = document.getElementById("qinfo").getElementsByTagName("b")[2].getElementsByTagName("a")[0].innerHTML;
    } else {
        lastActive = "N/A";
    }

    a.innerHTML += "<span>\n" +
        "&#9679; <b>Question votes :</b> " + nbUpvotesOnQuestion + "<br>\n" +
        "&#9679; <b>Favorites :</b> " + nbFavorites + "<br>\n" +
        "&#9679; <b>Views :</b> " + nbViews + "<br>\n" +
        "&#9679; <b>Asked :</b> " + asked + "<br>\n" +
        "&#9679; <b>Active :</b> " + lastActive + "\n" +
        "<br/><center><button id='upvoteQuestionButton'>Upvote question</button></center>" +
        "</span>";
    //end popover


    li.addEventListener("click", function() {
        let targetElement = event.target || event.srcElement;

        if (targetElement.id === 'upvoteQuestionButton') {
            upvoteQuestion();
        } else {
            scrollToAnswerAtIndex(0, true);
        }
    });

    li.appendChild(a);
    ul.appendChild(li);
}


function addUpvotedClassToCellAtIndex(index, addUpvoted) {
    console.log("add log to cell " + index);
    let sideBar = document.getElementsByClassName("social")[0];
    let upvotedAnswerA = sideBar.getElementsByTagName("A")[index];
    if (upvotedAnswerA) {
        if (addUpvoted) {
            upvotedAnswerA.className = "upvotedAnswer";
        } else {
            upvotedAnswerA.className = "";
        }

        if (index === 0) { //for question, change button text according to status
            if (addUpvoted) {
                document.getElementById("upvoteQuestionButton").innerText = "Undo upvote";
            } else {
                document.getElementById("upvoteQuestionButton").innerText = "Upvote question";
            }
        }
    }
}


//add listeners on native stackoverflow upvote buttons
function addListenerOnUpvoteButtons() {
    let upvoteArray = document.getElementsByClassName("js-vote-up-btn");

    for (let i = 0; i < upvoteArray.length;i++) { //on commence à 1 pour avoir que les rep (maintenant on a aussi la question donc 0)
        let upvoteButton = upvoteArray[i];
        upvoteButton.addEventListener("click", function() {
            setTimeout(function () {
                if (upvoteButton.classList.contains("fc-theme-primary")) { //on inverse la condition meme si ca n'a pas de sens car la modif est faite juste après le upvote
                    addUpvotedClassToCellAtIndex(i, true);
                } else {
                    addUpvotedClassToCellAtIndex(i, false);
                }
            }, 1); //this very very small delay is necessary so that fc-theme-primary class is set


        });
    }
}

//endregion


//region Upvote posts

function upvoteQuestion() {
    upvotePostAtIndex(0);
}

function upvotePostAtIndex(index) {
    let allUpvoteButtons = document.getElementsByClassName("js-vote-up-btn");
    if (index < allUpvoteButtons.length) {
        allUpvoteButtons[index].click();
    }
}

//endregion