chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "fastForward") {
    console.log("[FastForwardExtension] Fast forwarding videos by 90 seconds.");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var tabId = tab.id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function () {
          var videos = document.querySelectorAll("video");
          videos.forEach((video) => {
            if (video) {
              video.currentTime += 90;
            }
          });
        },
      });
    });
  }
});
