/**
 * Adjust SO page. Full screen.
 */
function adjustPageWidth() {
    let container = document.getElementsByClassName("container")[0]
    container.style.maxWidth = "100%";
    container.style.padding = "0 0 0 70px"; // correlate with width social class in css
    document.getElementById("content").style.maxWidth = "100%";
}
