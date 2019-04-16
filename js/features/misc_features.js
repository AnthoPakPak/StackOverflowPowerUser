function addStickyScrollToUpvoteButtons() {
    let allUpvoteButtons = document.getElementsByClassName("js-voting-container");
    for (let i = 0; i < allUpvoteButtons.length; i++) {
        allUpvoteButtons[i].style.position = "sticky";
        allUpvoteButtons[i].style.top = "50px";
    }
}

function expandAllCommentsOnCtrlF(event) {
    // console.log("key : " + event.keyCode);
    // console.log("cmd ? : " + event.metaKey);

    //TODO verify detecting on windows&linux
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 70) { //catch CMD + F (metaKey = cmd & ctrlKey = control)
        // console.log("CMD+F detected");
        let allShowMoreCommentsLinksArray = document.getElementsByClassName("js-show-link comments-link");
        for (let i = 0; i < allShowMoreCommentsLinksArray.length; i++) {
            let showMoreCommentsLink = allShowMoreCommentsLinksArray[i];
            showMoreCommentsLink.click();
        }
    }
}