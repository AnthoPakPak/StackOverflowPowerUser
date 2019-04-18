/**
 * Add CSS rules to all Vote buttons so that they scroll next to the answer while scrolling.
 */
function addStickyScrollToUpvoteButtons() {
    let allUpvoteButtons = document.getElementsByClassName("js-voting-container");
    for (let i = 0; i < allUpvoteButtons.length; i++) {
        allUpvoteButtons[i].style.position = "sticky";
        allUpvoteButtons[i].style.top = "50px";
    }
}


/**
 * Automatically "click" on all "show X more comments" when user use CMD/Ctrl + F to search in page.
 * This way the user will also search for text hidden in comments.
 *
 * Keypress detection :
 * metaKey refers to CMD on Mac
 * ctrlKey refers to Control on Windows
 * keyCode 70 refers to F and keyCode 102 refers to f
 *
 * @param event
 */
function expandAllCommentsOnCtrlF(event) {
    // console.log("key : " + event.keyCode);
    // console.log("cmd ? : " + event.metaKey);

    if ((event.metaKey || event.ctrlKey) && (event.keyCode === 70 || event.keyCode === 102)) {
        // console.log("CMD+F detected");
        let allShowMoreCommentsLinksArray = document.getElementsByClassName("js-show-link comments-link");
        for (let i = 0; i < allShowMoreCommentsLinksArray.length; i++) {
            let showMoreCommentsLink = allShowMoreCommentsLinksArray[i];
            showMoreCommentsLink.click();
        }
    }
}