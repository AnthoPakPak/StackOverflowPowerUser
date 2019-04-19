/**
 * Unhide the SO native left sidebar, which doesn't provide value to the user (in my opinion).
 * I've decided to hide it by default in CSS, so that we don't see it blink. If user disabled this feature, it will restore the initial display property.
 */
function unhideLeftSidebar() {
    document.getElementById("left-sidebar").style.display = 'block'; //I've hidden it by default in CSS, to not see it blink. If feature is disabled, we set it display property back to block
}


//region Right sidebar elements

/**
 * Hide the "Hot Network Questions" block from right sidebar to prevent distraction.
 */
function hideHotNetworkQuestions() {
    document.getElementById("hot-network-questions").style.display = 'none';
}


/**
 * Hide the "Featured on Meta" & "Hot Meta posts" block from right sidebar to prevent distraction.
 */
function hideMetaPosts() {
    document.getElementsByClassName("module community-bulletin")[0].style.display = 'none';
}

//endregion