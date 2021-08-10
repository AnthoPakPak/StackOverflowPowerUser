const nbVotesCountsToAutoExpand = 4; //the number of votes counts that will be automatically expanded on page load. Do not set a high value here to not overload SO servers.
const timeBetweenTwoExpands = 2000; //the delay we need to wait between each expand to avoid reaching SO limit

let expandVotesCountsTimer;
let lastExpandedVotesCountDateTime = 0;


function autoExpandVotesCounts() {
    if (!userHasEnoughReputation()) { //don't run this if user has less than 1000 rep
        //console.log("user hasn't got enough rep or isn't logged in");
        return;
    }

    //wait 1sec after page load, then start auto expanding
    setTimeout(function () {
        addListenerOnVoteCounts();

        expandVotesCountOnIndex(0, true);
    }, 1000);
}


/**
 * Verify that user has more than 1000 reputation points
 */
function userHasEnoughReputation() {
    if (userIsLoggedIn()) { //user is logged in
        let reputationString = getReputationString(); //will have this kind of format : 342 | 1,872 | 13k
        //console.log("rep string " + reputationString);
        if (reputationString.indexOf(",") !== -1 || reputationString.indexOf("k") !== -1) {
            return true;
        }
    }

    return false;
}


/**
 * Add a listener on each votes counts so that it observe the end of the ajax call that is made to fetch the votes details.
 * Every time a votes details is fetch (basically after clicking a vote number or with auto-expand votes counts feature), the following will be done :
 *      - Show the percentage badge of the answer
 *      - Expand the next votes count if current expanded answer is below `nbVotesCountsToAutoExpand`
 *      - Change color of downvote text as I find it a bit dark
 */
function addListenerOnVoteCounts() {
    let votesCountArray = document.getElementsByClassName("js-vote-count");

    for (let i = 0; i < votesCountArray.length; i++) {
        //wait until finish before launching the next fetch
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new MutationObserver(function(mutations, observer) {
            //here, the votes details are available
            if (!votesCountArray[i].getElementsByTagName("DIV")[2]) //to avoid undefined
                return;

            votesCountArray[i].getElementsByTagName("DIV")[2].style.color = "#CC0000"; //change downvotes count text color for a brighter red (I find the stock one a bit dark)

            setPercentageForIndex(i);

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
 * Expand votes count on an answer. This is normally done clicking the vote number on SO (you will need more than 1000 reputation to have the privilege to do this).
 * There must be 1 second before each expand to avoid reaching SO limit. That's why listeners are set on votes counts (see `addListenerOnVoteCounts`) so that it will wait the end of the fetch before fetching the next one.
 * @param index index of the votes count to expand
 * @param withDelay should it be expanded waiting 1sec or immediately ?
 */
function expandVotesCountOnIndex(index, withDelay) {
    let delay = withDelay ? timeBetweenTwoExpands : 0;

    if (!withDelay) { //even if we want no delay, ensure that last request has been made more than 1second ago
        cancelCurrentVotesCountsExpandationIfNeeded();
        let timeSinceLastExpandedVotesCount = new Date().getTime() - lastExpandedVotesCountDateTime;
        delay = timeSinceLastExpandedVotesCount > (timeBetweenTwoExpands+200) ? 0 : (timeBetweenTwoExpands+200) - timeSinceLastExpandedVotesCount; //add 0.2s to be sure to avoid limit
    }

    expandVotesCountsTimer = setTimeout(function () {
        let votesCountArray = document.getElementsByClassName("js-vote-count");

        if (index < votesCountArray.length) {
            votesCountArray[index].click();

            lastExpandedVotesCountDateTime = new Date().getTime();
        }
    }, delay);
}


/**
 * Once the votes count detail is fetch, this method is called to add the percentage badge on the answer.
 * It will inform on the validity of an answer by giving the % of positive votes.
 * If an answer has too much downvotes, the badge color will be red.
 * @param index index of the vote count
 */
function setPercentageForIndex(index) {
    let votesCountArray = document.getElementsByClassName("js-vote-count");
    let voteDiv = document.getElementsByClassName("js-voting-container")[index];

    let upVotes = parseInt(votesCountArray[index].getElementsByTagName("DIV")[0].innerHTML);
    let downVotes = Math.abs(parseInt(votesCountArray[index].getElementsByTagName("DIV")[2].innerHTML)); //turn it to positive number (remove -)

    let totalVotes = upVotes + downVotes;

    let percentPositive = 0;
    if (totalVotes > 0) percentPositive = Math.round(upVotes/totalVotes * 100);

    //console.log(upVotes, downVotes, percentPositive);

    if (voteDiv.getElementsByClassName("votesPercent").length > 0) { //if the badge is already created we update it
        if (upVotes === 0 && downVotes === 0) { //if there are currently no votes (this is different from having +1/-1)
            return; //we don't show unknown percent values
        } else {
            voteDiv.getElementsByClassName("votesPercent")[0].innerHTML = percentPositive + "<span class=\"percentSymbol\">%</span>";
            voteDiv.getElementsByClassName("votesPercent")[0].style.color = getColorAccordingToPercent(percentPositive);
        }
    } else { //instead we create the badge
        let percentDiv = document.createElement("DIV");
        percentDiv.className = "votesPercent";

        if (upVotes === 0 && downVotes === 0) { //if there are currently no votes (this is different from having +1/-1)
            return; //we don't show unknown percent values
        } else {
            percentDiv.innerHTML = percentPositive + "<span class=\"percentSymbol\">%</span>";
            percentDiv.style.color = getColorAccordingToPercent(percentPositive);
        }

        voteDiv.appendChild(percentDiv);
    }
}


/**
 * Return a color going from green to red from a percentage value.
 * 100% is green, 80% is red.
 * I've arbitrary chosen 80% to be red as I think an answer having 20% of downvotes is a bad one.
 * @param percentValue
 * @returns {string}
 */
function getColorAccordingToPercent(percentValue){
    if (percentValue < 80) //we don't want to be below 80 as 80 is already red
        percentValue = 80;

    //New method color between SO green/red colors
    let adaptedPercentValue = percentValue / 100;
    adaptedPercentValue = 1 - ((1 - adaptedPercentValue) * 5); //We want to convert a value between 0.8 and 1, to a value between 0 and 1. 1 / (1 - 0.8) = 5
    return getColorOnGradient(adaptedPercentValue);

    //value from 100 to 80
    //Old method between plain green/red (Inspired by this Fiddle: http://jsfiddle.net/jongobar/sNKWK/)
    // let hue=((0.2-(1-(percentValue/100)))*500).toString(10);
    // return ["hsl(",hue,",100%,50%)"].join("");
}

/**
 * Get a color on a gradient between two colors, for a specific value
 * 
 * Inspired by this answer: https://stackoverflow.com/a/30144587/4894980
 * @param {float} value value between 0 and 1 on the gradient
 * @returns color for this value
 */
function getColorOnGradient(value) {
    let greenColor = getCSSColorOfClass('.fc-green-600');
    let redColor = getCSSColorOfClass('.fc-red-600');

    var w1 = value;
    var w2 = 1 - w1;
    var rgb = [Math.round(greenColor[0] * w1 + redColor[0] * w2),
        Math.round(greenColor[1] * w1 + redColor[1] * w2),
        Math.round(greenColor[2] * w1 + redColor[2] * w2)];
    return 'rgb('+rgb.join()+')';
}

/**
 * Returns the color property of a CSS class.
 * We use this to fetch up/down votes colors, since they're different on light/dark SO, and other SE websites
 * @param className the name of the class we want to fetch color
 * @returns {string[]} [r, g, b]
 */
function getCSSColorOfClass(className) {
    var elem, style;
    elem = document.querySelector(className);
    style = getComputedStyle(elem);
    return style.color.replace(/[^\d,]/g, '').split(',');
}

/**
 * It will cancel currently queued votes counts expand. Useful when navigating through answers with arrow keys quickly.
 * Without it we often reach the SO limit of one fetch every 1sec.
 */
function cancelCurrentVotesCountsExpandationIfNeeded() {
    clearTimeout(expandVotesCountsTimer);
}