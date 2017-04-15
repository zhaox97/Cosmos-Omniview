module.exports = toggleFullscreen;

function toggleFullscreen() {
    if (isFullscreen()) exitFullscreen();
    else enterFullscreen();
}

function isFullscreen(){
    return document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
}

function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement,
        requestMethod = (element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen);

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null)
            wscript.SendKeys("{F11}");
    }
}
