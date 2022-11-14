/**
 * Adjust SO page for FullHD resolution.
 */
function adjustPageWidth(width) {
    let container = document.getElementsByClassName("container")[0]
    container.style.maxWidth = width.toString() + "px";
    container.style.margin = "0 70px"; // correlate with width social class in css
    document.getElementById("content").style.maxWidth = "100%";
}
