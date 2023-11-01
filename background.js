
let originalPlaybackRate = 1;
//


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
  else if (message.command === "switchLeftTab") {
    switchTabLeft();
  }
  else if (message.command === "switchRightTab") {
    switchTabRight();
  }
  else if (message.command === "sannpeiicecream") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var url = tabs[0].url;

      if (url && url.includes("www.youtube.com")) {
        if (message.keyState === "keydown") {
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
                  if(video.playbackRate != 3){
                    originalPlaybackRate = video.playbackRate;
                    video.playbackRate = 3;    
                  }        
                }
              });
            },
          });
        } else if (message.keyState === "keyup") {
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
                  video.playbackRate = originalPlaybackRate ; 
                 }
              });
            },
          });
        }
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

function switchTabLeft() {
  // chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
  //   if (tabs.length > 1) {
  //     // const currentIndex = tabs[0].index;
  //     // const newIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
  //     await chrome.tabs.update(tabs[tabs.length-1].id, { active: true });
  //     await chrome.windows.update(tabs[tabs.length-1].windowId, { focused: true });

  //   }
  // });
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
      var activeTab = activeTabs[0];
      var currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
      var newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = tabs.length - 1;
      }
      chrome.tabs.update(tabs[newIndex].id, { active: true });
    });
  });
}

function switchTabRight() {
  // chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
  //   if (tabs.length > 1) {
  //     // const currentIndex = tabs[0].index;
  //     // const newIndex = (currentIndex + 1) % tabs.length;
  //     await chrome.tabs.update(tabs[1].id, { active: true });
  //     await chrome.windows.update(tabs[1].windowId, { focused: true });

  //   }
  // });
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
      var activeTab = activeTabs[0];
      var currentIndex = tabs.findIndex(tab => tab.id === activeTab.id);
      var newIndex = currentIndex + 1;
      if (newIndex >= tabs.length) {
        newIndex = 0;
      }
      chrome.tabs.update(tabs[newIndex].id, { active: true });
    });
  });
}
