/**
 * Unhide the SO native left sidebar, which doesn't provide value to the user (in my opinion).
 * I've decided to hide it by default in CSS, so that we don't see it blink. If user disabled this feature, it will restore the initial display property.
 */
function unhideLeftSidebar() {
    document.getElementById("left-sidebar").style.display = 'block'; //I've hidden it by default in CSS, to not see it blink. If feature is disabled, we set it display property back to block
}