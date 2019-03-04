/**
 *
 * NOTE : Code is ugly, it will be updated when I'll have time. Please be nice :)
 *
 */



const questionId = 0;
const acceptedAnswerId = 1;
const nextAnswerId = 2;

//CONFIG
var userPrefs = {};
const nbVotesCountsToAutoExpand = 4;
//const scrollToBestAnswerEnabled = true;
//const scrollAroundPostsWithArrowKeys = true;
const nbCellsInSidebar = 5;


var noAnswerOnQuestion = false;
var currentViewedPost = 0; //par défaut la question
var isHoldingModifierKey = false;


//get userPrefs then execute the code
getUserPrefs(function() {
    if (document.getElementsByClassName("question-page").length === 1) { //si on est bien sur une question
        if (userPrefs.noAnswerEnabled) {
            if (document.getElementsByClassName("answer").length === 0) { //pas de réponse
                noAnswerOnQuestion = true;
                showNoAnswerImageOnQuestion();
            }
        }

        if (userPrefs.betterAnswerEnabled) {
            if (!noAnswerOnQuestion) { //s'il y a des réponses
                if (document.getElementsByClassName("js-accepted-answer-indicator d-none").length > 0) { //si on a une réponse acceptée (depuis update SO il y a plusieurs elements avec cette classe, mais un seul n'a pas la classe "d-none" (qui permet de cacher)
                    //console.log("There's an accepted answer");
                    checkForBetterAnswer();
                } else {
                    //console.log("No accepted answer…");
                }
            }
        }

        if (userPrefs.autoScrollFirstAnswerEnabled && !noAnswerOnQuestion) {
            //currently it just scrolls to first answer (not the best one)
            scrollToFirstAnswer();
        }

        if (userPrefs.showSidebarEnabled) {
            showSidebarWithVotesCount();
            checkIfIHaveAlreadyUpvotedAnAnswer();
            addListenerOnUpvoteButtons();
        }

        if (userPrefs.autoExpandVotesCountEnabled) {
            autoExpandVotesCounts();
        }

        if (!userPrefs.hideStackOverflowLeftSidebar) {
            document.getElementById("left-sidebar").style.display = 'block'; //we hide it by default, as to not see it blink
        }
    }

    if (userPrefs.navigationArrowKeysEnabled) {
        document.onkeydown = clickArrowsToScrollAroundPosts;
        document.onkeyup = hasReleasedKey;

        //détecte si l'user change de tab, car sinon quand on change avec les raccourcis clavier, isHoldingModifierKey reste vrai
        document.addEventListener('visibilitychange', function(){
            if (document.hidden) {
                isHoldingModifierKey = false;
            }
        });
    }
});




//region Check for better answer

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

//endregion



//region No answer image

function showNoAnswerImageOnQuestion() {
    let questionVoteDiv = document.getElementsByClassName("js-voting-container")[questionId];

    let noAnswerImg = document.createElement("IMG");
    //goDownImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Human-go-down.svg/2000px-Human-go-down.svg.png";
    noAnswerImg.src = chrome.extension.getURL('/images/worrying-emoji.png');
    noAnswerImg.width = 40;

    questionVoteDiv.appendChild(noAnswerImg);
}

//endregion








function autoExpandVotesCounts() {
    if (userHasEnoughReputation()) { //avoid simulated clicks if user has less than 1000 rep
        // console.log("user has enough rep");
        setTimeout(function () {
            addListenerOnVoteCounts();

            expandVotesCountOnIndex(0, true);
        }, 1000);
    } else {
        // console.log("user hasn't got enough rep or isn't logged in");
    }
}


/**
 * Verify that user has more than 1000 reputation points
 */
function userHasEnoughReputation() {
    if (document.getElementsByClassName("-rep js-header-rep").length > 0) { //user is logged in
        let reputationString = document.getElementsByClassName("-rep js-header-rep")[0].innerHTML; //will have this kind of format, 342 | 1,872 | 13k
        console.log("rep string " + reputationString);
        if (reputationString.indexOf(",") !== -1 || reputationString.indexOf("k") !== -1) {
            return true;
        }
    }

    return false;
}



function addListenerOnVoteCounts() {
    let votesCountArray = document.getElementsByClassName("js-vote-count");

    for (let i = 0; i <votesCountArray.length;i++) {
        //wait until finish before launching the next fetch
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new MutationObserver(function(mutations, observer) {
            //ICI on a reçu les votes details
            //console.log(mutations, observer);
            if (!votesCountArray[i].getElementsByTagName("DIV")[2]) //pour éviter les undefined
                return;

            votesCountArray[i].getElementsByTagName("DIV")[2].style.color = "#CC0000"; //change la color du downvote

            setPourcentageForIndex(i);

            if (i+1 < nbVotesCountsToAutoExpand)
                expandVotesCountOnIndex(i + 1, true);

            //observer.disconnect();
        });

        observer.observe(votesCountArray[i], {
            attributes: true
        });
    }
}


/**
 * Méthode récursive, dès qu'on a fetch le détail des votes de tel index,
 * on fait l'index suivant.
 * Obligé de faire ça car SO n'autorise pas les batchs requests sur le vote count
 * @param index
 * @param withDelay
 */
function expandVotesCountOnIndex(index, withDelay) {
    let delay = withDelay ? 1000 : 0;
    setTimeout(function () {
        let votesCountArray = document.getElementsByClassName("js-vote-count");

        if (index < votesCountArray.length)
            votesCountArray[index].click();

    }, delay);
}


/**
 * Méthode appelée après que le détail de votes ait été obtenu, qui donne le % de positif
 * @param index
 */
function setPourcentageForIndex(index) {
    //console.log("index : " + index);

    let votesCountArray = document.getElementsByClassName("js-vote-count");
    let voteDiv = document.getElementsByClassName("js-voting-container")[index];

    let upVotes = parseInt(votesCountArray[index].getElementsByTagName("DIV")[0].innerHTML);
    let downVotes = Math.abs(parseInt(votesCountArray[index].getElementsByTagName("DIV")[2].innerHTML)); //turn it to positive number (remove -)

    let totalVotes = upVotes + downVotes;

    let pourcentPositive = 0;
    if (totalVotes > 0) pourcentPositive = Math.round(upVotes/totalVotes * 100);

    //console.log(upVotes, downVotes, pourcentPositive);

    if (voteDiv.getElementsByClassName("circlePercent").length > 0) { //si l'élément existe déjà on l'update
        if (upVotes === 0 && downVotes === 0) { //s'il n'y a actuellement aucun votes
            voteDiv.getElementsByClassName("circlePercent")[0].textContent = "?";
            voteDiv.getElementsByClassName("circlePercent")[0].style.backgroundColor = "#3399ff"; //blue color
        } else {
            voteDiv.getElementsByClassName("circlePercent")[0].textContent = pourcentPositive + "%";
            voteDiv.getElementsByClassName("circlePercent")[0].style.backgroundColor = getColorAccordingToPourcent(pourcentPositive);
        }
    } else { //sinon on le crée
        let pourcentDiv = document.createElement("DIV");
        pourcentDiv.className = "circlePercent";

        if (upVotes === 0 && downVotes === 0) { //s'il n'y a actuellement aucun votes
            pourcentDiv.textContent = "?";
            pourcentDiv.style.backgroundColor = "#3399ff"; //blue color
        } else {
            pourcentDiv.textContent = pourcentPositive + "%";
            pourcentDiv.style.backgroundColor = getColorAccordingToPourcent(pourcentPositive);
        }

        voteDiv.appendChild(pourcentDiv);
    }

}


/**
 * Méthode qui retourne du vert jusqu'au rouge. Les valeurs actuelles retournent vert pour 100 et rouge pour 90
 * Fiddle : http://jsfiddle.net/jongobar/sNKWK/
 * @param pourcentValue
 * @returns {string}
 */
function getColorAccordingToPourcent(pourcentValue){
    //version 90% min
    // if (pourcentValue < 90)  //car à 90 c'est déjà rouge
    //     pourcentValue = 90;
    //
    // //value from 100 to 90
    // var hue=((0.1-(1-(pourcentValue/100)))*1000).toString(10);
    // return ["hsl(",hue,",100%,50%)"].join("");

    //version 80% min
    if (pourcentValue < 80)  //car à 80 c'est déjà rouge
        pourcentValue = 80;

    //value from 100 to 90
    var hue=((0.2-(1-(pourcentValue/100)))*500).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}





//region SCROLL / SWITCH BETWEEN ANSWERS

function scrollToNextAnswer() {
    currentViewedPost = 2;
    //scroll to next answer
    let nextAnswerDiv = document.getElementsByClassName("answer")[nextAnswerId - 1]; //-1 parce que c'est que dans les réponses

    window.scroll({
        top: nextAnswerDiv.offsetTop,
        left: 0,
        behavior: 'smooth'
    });
}



function scrollToFirstAnswer() {
    if(window.location.href.indexOf("#") > -1) { //si on essayait de scroll vers une réponse (passée dans l'url)
        return;
    }

    //only scroll if page hasn't been reloaded (refresh), sinon ça scroll bizaremment
    if (performance.navigation.type !== 1) {
        currentViewedPost = 1;
        //scroll to first answer
        let nextAnswerDiv = document.getElementsByClassName("answer")[acceptedAnswerId - 1];

        window.scroll({
            top: nextAnswerDiv.offsetTop,
            left: 0
        });
    }
}



/**
 * Méthode qui détecte les arrows key left/right pour passer d'un post à l'autre
 * @param e
 */
function clickArrowsToScrollAroundPosts(e) {
    var event = window.event ? window.event : e;
    //console.log("key : " + e.keyCode);
    
    //si on est en train de mettre un commentaire
    let textAreaArray = document.getElementsByTagName("textarea");
    for (var i = 0; i < textAreaArray.length; i++) {
        if (textAreaArray[i] == document.activeElement)
            return;
    }
    
    if (isHoldingModifierKey)
        return;

    if (e.keyCode === 37 || e.keyCode === 39) {
        if (e.keyCode === 37) { // left arrow
            if (currentViewedPost > 0)
                currentViewedPost--;
        }
        else if (e.keyCode === 39) { // right arrow
            if (currentViewedPost < document.getElementsByClassName("answer").length)
                currentViewedPost++;
        }

        //console.log("currentViewedPost " + currentViewedPost);
        scrollToAnswerAtIndex(currentViewedPost, false);
    } else { //différent de gauche/droite
        isHoldingModifierKey = true;
    }
}


function scrollToAnswerAtIndex(index, smooth) {
    //console.log("called! " + index);
    let scrollToDiv = document.getElementsByClassName("answer")[index-1];

    if (index <= 0) { //on scroll en haut de la question

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
 * Méthode qui détecte les releases de touches. Cela permet de checker si le user a fait une combinaison de touches plutot qu'un simple appui sur droite/gauche (comme ça on peut faire alt + droite, etc)
 * @param e
 */
function hasReleasedKey(e) {
    var event = window.event ? window.event : e;
    if (e.keyCode !== 37 && e.keyCode !== 39) {
        isHoldingModifierKey = false;
    }
}

//endregion



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
                            alert("Il y a une réponse déjà upvotée vers le bas !");
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
            var targetElement = event.target || event.srcElement;
            console.log(targetElement);
            scrollToAnswerAtIndex(i, true);
        });

        let nbVotesAnswerI = parseInt((document.getElementsByClassName("js-vote-count")[i]).innerHTML);

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
        if (currentViewedPost > 0) {
           currentViewedPost--;
           scrollToAnswerAtIndex(currentViewedPost, true);
        }
    });

    let rightArrow = ul.getElementsByClassName("arrow")[1];
    rightArrow.addEventListener("click", function() {
        if (currentViewedPost < document.getElementsByClassName("answer").length) {
            currentViewedPost++;
            scrollToAnswerAtIndex(currentViewedPost, true);
        }
    });
}


function addNbAnswersInSidebar(ul, nbAnswers) {
    let li = document.createElement("LI");
    let a = document.createElement("A");

    a.id = "nbAnswers";
    a.innerHTML = nbAnswers + "<br><div style=\"font-size:10px\">answers</div>";


    //add additional informations in popover
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
        "&#9679; <b>Favorites :</b> " + nbFavorites + "<br>\n" +
        "&#9679; <b>Views :</b> " + nbViews + "<br>\n" +
        "&#9679; <b>Asked :</b> " + asked + "<br>\n" +
        "&#9679; <b>Active :</b> " + lastActive + "\n" +
        "<br/><center><button id='upvoteQuestionButton'>Upvote question</button></center>" +
        "</span>";
    //end popover


    li.addEventListener("click", function() {
        var targetElement = event.target || event.srcElement;

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
    let allUpvoteButtons = document.getElementsByClassName("js-vote-up-btn grid--cell s-btn s-btn__unset c-pointer sox-better-css");
    if (index < allUpvoteButtons.length) {
        allUpvoteButtons[index].click();
    }
}

//endregion


//region UserPrefs

function getUserPrefs(callback) {
    chrome.storage.sync.get({
        betterAnswerEnabled: true,
        noAnswerEnabled: true,
        autoScrollFirstAnswerEnabled: false,
        showSidebarEnabled: true,
        navigationArrowKeysEnabled: true,
        autoExpandVotesCountEnabled: true,
        hideStackOverflowLeftSidebar: true
    }, function(items) {
        userPrefs = items;
        callback();
        // document.getElementById('betterAnswerEnabled').checked = items.betterAnswerEnabled;
        // document.getElementById('noAnswerEnabled').checked = items.noAnswerEnabled;
        // document.getElementById('autoScrollFirstAnswerEnabled').checked = items.autoScrollFirstAnswerEnabled;
        // document.getElementById('showSidebarEnabled').checked = items.showSidebarEnabled;
        // document.getElementById('navigationArrowKeysEnabled').checked = items.navigationArrowKeysEnabled;
        // document.getElementById('autoExpandVotesCountEnabled').checked = items.autoExpandVotesCountEnabled;
    });
}

//endregion