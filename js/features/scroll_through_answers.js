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
    // console.log("key : " + event.keyCode);
    // console.log("cmd ? : " + event.metaKey);

    //si on est en train de mettre un commentaire
    let textAreaArray = document.getElementsByTagName("textarea");
    for (var i = 0; i < textAreaArray.length; i++) {
        if (textAreaArray[i] === document.activeElement)
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