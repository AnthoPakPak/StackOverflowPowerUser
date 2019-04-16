let currentViewedPost = 0; //par défaut la question
let isHoldingModifierKey = false;


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

function scrollToPreviousAnswer(smooth) {
    if (currentViewedPost > 0) {
        currentViewedPost--;
        scrollToAnswerAtIndex(currentViewedPost, smooth);
    }
}

function scrollToNextAnswer(smooth) {
    if (currentViewedPost < document.getElementsByClassName("answer").length) {
        currentViewedPost++;
        scrollToAnswerAtIndex(currentViewedPost, smooth);
    }
}

function scrollToBetterAnswer() {
    scrollToAnswerAtIndex(nextAnswerId, true);
}

function scrollToFirstAnswerOnLoad() {
    if(window.location.href.indexOf("#") > -1) { //si on essayait de scroll vers une réponse (passée dans l'url)
        return;
    }

    //Only scroll if page hasn't been reloaded (refreshed), if not it scrolls weirdly
    if (performance.navigation.type !== 1) {
        currentViewedPost = 1;

        //I'm not using scrollToAnswerAtIndex() as I don't want to expand votesCounts on page load
        let nextAnswerDiv = document.getElementsByClassName("answer")[acceptedAnswerId - 1];

        window.scroll({
            top: nextAnswerDiv.offsetTop,
            left: 0
        });
    }
}


//region Keystrokes

function setupArrowsKeystrokesListeners() {
    document.addEventListener("keydown", clickArrowsToScrollAroundPosts, false);
    document.addEventListener("keyup", hasReleasedKey, false);

    //détecte si l'user change de tab, car sinon quand on change avec les raccourcis clavier, isHoldingModifierKey reste vrai
    document.addEventListener('visibilitychange', function(){
        if (document.hidden) {
            isHoldingModifierKey = false;
        }
    });
}

/**
 * Méthode qui détecte les arrows key left/right pour passer d'un post à l'autre
 * @param event
 */
function clickArrowsToScrollAroundPosts(event) {
    // console.log("key : " + event.keyCode);

    //si on est en train de mettre un commentaire
    let textAreaArray = document.getElementsByTagName("textarea");
    for (let i = 0; i < textAreaArray.length; i++) {
        if (textAreaArray[i] === document.activeElement)
            return;
    }

    if (isHoldingModifierKey)
        return;

    if (event.keyCode === 37 || event.keyCode === 39) {
        if (event.keyCode === 37) { // left arrow
            scrollToPreviousAnswer(false);
        }
        else if (event.keyCode === 39) { // right arrow
            scrollToNextAnswer(false);
        }
    } else { //différent de gauche/droite
        isHoldingModifierKey = true;
    }
}

/**
 * Méthode qui détecte les releases de touches. Cela permet de checker si le user a fait une combinaison de touches plutot qu'un simple appui sur droite/gauche (comme ça on peut faire alt + droite, etc)
 * @param event
 */
function hasReleasedKey(event) {
    if (event.keyCode !== 37 && event.keyCode !== 39) {
        isHoldingModifierKey = false;
    }
}

//endregion