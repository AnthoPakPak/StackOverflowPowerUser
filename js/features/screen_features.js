/**
 * Adjust SO page for FullHD resolution.
 */
function adjustPageForFullHD() {
    let container = document.getElementsByClassName("container")[0]
    container.style.maxWidth = "1843px";
    container.style.margin = "0 60px";
    document.getElementById("content").style.maxWidth = "100%";
}
