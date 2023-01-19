/**
 * Adjust SO page width for large screens.
 */
function adjustPageWidth(pageWidthPercent) {
    let container = document.getElementsByClassName("container")[0]
    container.style.maxWidth = "100%";
    container.style.padding = "0 70px"; // correlate with width social class in css
    pageWidthPercent = Math.min(100, Math.max(50, pageWidthPercent)); //restrict to 50-100 range
    document.getElementById("content").style.maxWidth = pageWidthPercent + "%";
}
