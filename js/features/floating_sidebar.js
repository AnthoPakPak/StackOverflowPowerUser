const nbAnswersInSidebar = 5; //the number of answers to show in floating sidebar


/**
 * Setup the votes counts sidebar.
 */
function setupSidebarWithVotesCounts() {
    showSidebarWithVotesCounts();
    checkIfIHaveAlreadyUpvotedAnAnswer();
    addListenerOnUpvoteButtons();
}


//region Sidebar vote counts

/**
 * Generates a floating sidebar with votes counts. Clicking on cells will scroll to the answer.
 * This html generation is not so great, it could be improved... It uses CSS rules from `floating_sidebar.css`.
 *
 * Original sidebar taken from : https://codepen.io/anon/pen/KodazE
 */
function showSidebarWithVotesCounts() {
    let votesCountArray = document.getElementsByClassName("js-vote-count");

    let ul = document.createElement("UL");
    ul.className = "social noselect";

    addNbAnswersInSidebar(ul, votesCountArray.length - 1);

    for (let i = 1; i < votesCountArray.length;i++) { //start to 1 to avoid question
        let li = document.createElement("LI");
        let a = document.createElement("A");
        //let span = document.createElement("SPAN"); // re-add if we want details (reAddForDetails)
        //a.href = "#";
        li.addEventListener("click", function() {
            let targetElement = event.target || event.srcElement;
            console.log(targetElement);
            scrollToAnswerAtIndex(i, true);
        });

        let nbVotesAnswerI = (document.getElementsByClassName("js-vote-count")[i]).innerHTML;
        a.innerHTML = nbVotesAnswerI;

        //span.innerHTML = "100%"; // re-add if we want details (search reAddForDetails in CSS file)
        //a.appendChild(span);

        li.appendChild(a);
        ul.appendChild(li);

        if (i === nbAnswersInSidebar) //nb cells in sidebar
            break;
    }

    addLeftRightArrowsToUl(ul);

    document.body.appendChild(ul);
}


/**
 * Add the nbAnswers cell into sidebar, by adding an li to the passed ul. It uses CSS rules from `floating_sidebar.css`.
 * This html generation is not so great, it could be improved...
 * @param ul the list in which the li will be added
 * @param nbAnswers nbAnswers to showcase in this li
 */
function addNbAnswersInSidebar(ul, nbAnswers) {
    let li = document.createElement("LI");
    let a = document.createElement("A");

    a.id = "nbAnswers";
    a.innerHTML = nbAnswers + "<br><div style=\"font-size:10px\">answers</div>";


    //add additional informations in popover
    let nbUpvotesOnQuestion = parseInt(document.getElementsByClassName("js-vote-count")[0].innerText);

    let nbFavorites = document.getElementsByClassName("js-bookmark-count")[0].innerHTML;
    if (nbFavorites === '') {
        nbFavorites = '0';
    }

    //dates and views information
    if (document.getElementsByClassName("d-flex fw-wrap pb8 mb16 bb").length !== 0) {
        let qInfoMainDiv = document.getElementsByClassName("d-flex fw-wrap pb8 mb16 bb")[0];
        let qInfoDivsArray = qInfoMainDiv.getElementsByClassName("flex--item ws-nowrap mb8");

        let lastActiveIsPresent = qInfoDivsArray.length > 2;

        let nbViews = qInfoDivsArray[lastActiveIsPresent ? 2 : 1].innerText.replace('Viewed ', '').replace(' times', '');
        let asked = qInfoDivsArray[0].innerText.replace('Asked ', '');

        let lastActive = lastActiveIsPresent ? qInfoDivsArray[1].innerText.replace('Active ', '') : "N/A";

        a.innerHTML += "<span>\n" +
            "&#9679; <b>Question votes :</b> " + nbUpvotesOnQuestion + "<br>\n" +
            "&#9679; <b>Favorites :</b> " + nbFavorites + "<br>\n" +
            "&#9679; <b>Views :</b> " + nbViews + "<br>\n" +
            "&#9679; <b>Asked :</b> " + asked + "<br>\n" +
            "&#9679; <b>Active :</b> " + lastActive + "\n" +
            "<br/><center><button id='upvoteQuestionButton' class='ws-nowrap s-btn s-btn__primary'>Upvote question</button></center>" +
            "</span>";
    }
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


/**
 * Add the <- and -> arrows on sidebar bottom. It uses CSS rules from `floating_sidebar.css`.
 * This html generation is not so great, it could be improved...
 * @param ul the list in which the arrows will be added
 */
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

//endregion



//region Answer already upvoted

/**
 * Check if you have already upvoted an answer on this page and color the cell(s) of the upvoted answer(s).
 * If the answer you've upvoted isn't in the first 5 answers, it will show you an alert to inform you that there's a upvoted answer below.
 */
function checkIfIHaveAlreadyUpvotedAnAnswer() {
    setTimeout(function () {
        let myUpvotesArray = document.getElementsByClassName("js-vote-up-btn fc-theme-primary");
        let allVotesArray = document.getElementsByClassName("js-voting-container");

        if (myUpvotesArray.length > 0) {
            //we add upvotedAnswer css class to the cell in sidebar
            for (let i = 0; i < myUpvotesArray.length; i++) {
                let myUpvote = myUpvotesArray[i];

                for (let j = 0; j < allVotesArray.length; j++) {
                    if (allVotesArray[j] === myUpvote.parentNode) {
                        if (j > nbAnswersInSidebar) {
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


/**
 * Add listeners on native SO upvote buttons so that we can `addUpvotedClassToCellAtIndex` when clicking on them.
 */
function addListenerOnUpvoteButtons() {
    let upvoteArray = document.getElementsByClassName("js-vote-up-btn");

    for (let i = 0; i < upvoteArray.length;i++) { //question and answers
        let upvoteButton = upvoteArray[i];
        upvoteButton.addEventListener("click", function() {
            setTimeout(function () {
                if (upvoteButton.classList.contains("fc-theme-primary")) {
                    addUpvotedClassToCellAtIndex(i, true);
                } else {
                    addUpvotedClassToCellAtIndex(i, false);
                }
            }, 1); //this very very small delay is necessary so that fc-theme-primary class is set
        });
    }
}


/**
 * Add the `upvotedAnswer` class to the cell at passed index, to indicate that this answer is upvoted by you.
 * The `upvotedAnswer` can also be removed if you cancel your upvote.
 * @param index the index of the cell to colorize
 * @param addUpvoted whether we have to add or remove the class
 */
function addUpvotedClassToCellAtIndex(index, addUpvoted) {
    let sideBar = document.getElementsByClassName("social")[0];
    let upvotedAnswerA = sideBar.getElementsByTagName("A")[index];
    if (upvotedAnswerA) {
        if (addUpvoted) {
            upvotedAnswerA.className = "upvotedAnswer";
        } else {
            upvotedAnswerA.className = "";
        }

        if (index === 0) { //for question, also change button text according to status
            if (addUpvoted) {
                document.getElementById("upvoteQuestionButton").innerText = "Undo upvote";
            } else {
                document.getElementById("upvoteQuestionButton").innerText = "Upvote question";
            }
        }
    }
}

//endregion



//region Upvote posts

/**
 * Upvote the question.
 */
function upvoteQuestion() {
    upvotePostAtIndex(0);
}


/**
 * Upvote a post at passed index, regardless it is the question or an answer.
 * Can also be used to cancel an upvote.
 * @param index index of the post
 */
function upvotePostAtIndex(index) {
    let allUpvoteButtons = document.getElementsByClassName("js-vote-up-btn");
    if (index < allUpvoteButtons.length) {
        allUpvoteButtons[index].click();
    }
}

//endregion