import { BiliInfo } from './biliInfo.js';

let originalPlaybackRate = 1;
// let fast = false;

var allowedDomains = ["www.youtube.com", "gamer.com.tw"];


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'get_folders') {
    console.log(message);
    get_folders(sendResponse, message.bid);
    return true;


  } else if (message.action === 'change_folders') {
    let addList = [];
    let delList = [];
    if (message.isAdd) {
      addList.push(message.folderId);
    } else {
      delList.push(message.folderId);
    }
    change_folders(sendResponse, message.aid, delList, addList);
    //todo

  }
});
async function change_folders(sendResponse, aid, delList,addList ) {
  const bili = new BiliInfo();
  await bili.init();
  const res = await bili.changefav(aid, delList, addList);
  console.log(res);
  if (res.data.code === 0) {
    sendResponse({ status: 'success', message: '操作成功' });
  } else {
    sendResponse({ status: 'error', message: res.data.message });
  }

}


async function get_folders(sendResponse, bid) {

  const bili = new BiliInfo();
  await bili.init();
  const res = await bili.fetchOneVideo(bid);
  console.log(res);
  const aid = res.data.aid;
  const result = await bili.fetchAllFoldersWithVideo(aid);
  result.aid = aid;
  console.log(result);
  // sendResponse(result);

  sendResponse(result);

}


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
                video.playbackRate += 0.25;
              }
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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url;

      if (url && allowedDomains.some(domain => url.includes(domain))) {
        if (message.keyState === "keydown") {
          var tab = tabs[0];
          console.log("keydown");
          var tabId = tab.id;
          // fast = !fast;
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function () {
              console.log('before exe');
              var videos = document.querySelectorAll("video");
              videos.forEach((video) => {
                if (video) {
                  if (video.playbackRate === 1) {
                    // originalPlaybackRate = video.playbackRate;
                    video.playbackRate = 3;
                  }
                  else {
                    // originalPlaybackRate = video.playbackRate;
                    video.playbackRate = 1;
                  }
                }
              });

            },
          });
        }
        else if (message.keyState === "keyup") {
          var tab = tabs[0];
          console.log(tab);

          var tabId = tab.id;
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: function () {

              var videos = document.querySelectorAll("video");
              console.log("keyup");
              videos.forEach((video) => {
                if (video) {
                  video.playbackRate = 1;
                }
              });
            },
          });
        }
        // else if (message.keyState === "keyup") {
        //   var tab = tabs[0];
        //   console.log(tab);

        //   var tabId = tab.id;
        //   chrome.scripting.executeScript({
        //     target: { tabId: tabId },
        //     func: function () {
        //       var videos = document.querySelectorAll("video");
        //       // console.log(tabId);
        //       videos.forEach((video) => {
        //         if (video) {
        //           video.playbackRate = 1;
        //         }
        //       });
        //     },
        //   });
        // }
      }
    });
  }
  else if (message.command === "selectTab") {
    switchTab(message.index);
  }
  else if (message.command === "switchLastTab") {
    switchToLastTab();
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
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (activeTabs) {
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
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (activeTabs) {
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

function switchTab(index) {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    // 确保 index 在有效范围内
    if (index < 1 || index > tabs.length) {
      console.error('Index out of range');
      return;
    }

    // 获取要切换到的标签页的索引
    var newIndex = index - 1; // 将用户输入的 1-9 转换为 0-8 索引

    // 切换到指定的标签页
    chrome.tabs.update(tabs[newIndex].id, { active: true });
  });

}
let lastActiveTabs = [];

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab) {
      lastActiveTabs = lastActiveTabs.filter(t => t.id !== tab.id); // 移除已关闭的标签
      lastActiveTabs.unshift(tab); // 将当前标签添加到前面
      if (lastActiveTabs.length > 100) { // 保持最近的10个标签
        lastActiveTabs.pop();
      }
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  // 移除已关闭的标签
  lastActiveTabs = lastActiveTabs.filter(t => t.id !== tabId);
});

function switchToLastTab() {
  if (lastActiveTabs.length > 1) {
    const currentTab = lastActiveTabs.shift(); // 获取当前标签
    const nextTab = lastActiveTabs[0]; // 获取下一个标签

    if (nextTab) {
      // 检查目标标签是否仍然存在
      chrome.tabs.get(nextTab.id, (tab) => {
        if (chrome.runtime.lastError || !tab) {
          // 如果标签已关闭，移除它
          lastActiveTabs.shift(); // 移除已关闭的标签
          switchToLastTab(); // 递归调用，尝试下一个标签
        } else {
          // 切换到下一个标签
          chrome.tabs.update(nextTab.id, { active: true });
          lastActiveTabs.unshift(currentTab); // 将当前标签放回
        }
      });
    }
  }
}


//添加两个右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchGithub",
    title: "Search GitHub for '%s'",
    contexts: ["selection"]

  });

  chrome.contextMenus.create({
    id: "searchBing",
    title: "Search Bing for '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url = "";
  if (info.menuItemId === "searchGithub") {
    url = `https://github.com/search?q=${encodeURIComponent(info.selectionText)}`;
  } else if (info.menuItemId === "searchBing") {
    url = `https://www.bing.com/search?q=${encodeURIComponent(info.selectionText)}`;
  }
  if (url) {
    chrome.tabs.create({ url });
  }
});
