
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "fastForward") {
    console.log("[FastForwardExtension] Fast forwarding videos by 90 seconds.");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) { // 确保至少有一个 tab 选项卡
        console.log(tabs.length);
        var tab = tabs[0];
        console.log(tab);
        var tabId = tab.id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function () {
            var videos = document.querySelectorAll("video");
            // console.log(tabId);
            videos.forEach((video) => {
              if (video) {
                video.currentTime += 90;
              }
            });
          },
        });
      } else {
        console.error("[FastForwardExtension] 没有当前选项卡");
      }
    });
  }
  else if (message.command === "fastBackward") {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) { // 确保至少有一个 tab 选项卡
        console.log(tabs.length);
        
        var tab = tabs[0];
        console.log(tab);
        
        var tabId = tab.id;

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function () {
            var videos = document.querySelectorAll("video");
            // console.log(tabId);
            videos.forEach((video) => {
              if (video) {
                video.currentTime -= 90;
              }
            });
          },
        });
      } else {
        console.error("[FastForwardExtension] 没有当前选项卡");
      }
    });
  }
  else if (message.command === "fastSpeed") {
  
    console.log("[FastForwardExtension] Fast backwarding videos by 90 seconds.");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) { // 确保至少有一个 tab 选项卡
        console.log(tabs.length);
        
        var tab = tabs[0];
        console.log(tab);
        
        var tabId = tab.id;

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function () {
            var videos = document.querySelectorAll("video");
            // console.log(tabId);
            videos.forEach((video) => {
              if (video) {
                video.playbackRate += 0.25;              }
            });
          },
        });
      } else {
        console.error("[FastForwardExtension] 没有当前选项卡");
      }
    });
  }
  else if (message.command === "slowSpeed") {
    console.log("slow speed ");
  

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) { // 确保至少有一个 tab 选项卡
        console.log(tabs.length);
        
        var tab = tabs[0];
        console.log(tab);
        
        var tabId = tab.id;

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function () {
            var videos = document.querySelectorAll("video");
            // console.log(tabId);
            videos.forEach((video) => {
              if (video) {
                video.playbackRate -= 0.25;
              }
            });
          },
        });
      } else {
        console.error("[FastForwardExtension] 没有当前选项卡");
      }
    });
  }
  else if (message.command === "showSth") {
    console.log("slow speed ");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) { // 确保至少有一个 tab 选项卡
        console.log(tabs.length);
        
        var tab = tabs[0];
        console.log(tab);
        
        var tabId = tab.id;

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function () {
            var videos = document.querySelectorAll("video");
            // console.log(tabId);
            videos.forEach((video) => {
              if (video) {
                video.playbackRate -= 0.25;
              }
            });
          },
        });
      } else {
        console.error("[FastForwardExtension] 没有当前选项卡");
      }
    });
  }
  
});

function isFocusedOnInput() {
  //焦点检测
  const focusedElement = document.activeElement;
  return (
    focusedElement && (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA')
  );
}