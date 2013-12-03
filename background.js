var chrome = chrome;
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('/views/window.html', {
        'bounds': {
            'width': 500,
            'height': 282
        }
    });
});