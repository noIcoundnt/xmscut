
const xpaths = [
  `//*[@id="a-powerful-web-span-stylecolor-var-chrome-primarymade-easierspan"]/span`,
  `//*[@id="mirror-vdcon"]/div[2]/div/div[7]/div[2]/div[2]/a/div[2]/picture/img`,
  `//*[@id="i_cecream"]/div[2]`
];

// 使用 Set 来跟踪已处理的 XPath
const processedXPaths = new Set();

function blockElementByXPath(xpath) {
  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (element) {
    element.style.display = 'none';
    console.log(`Element found and hidden by XPath: ${xpath}`);
    return true;
  } else {
    console.log(`No element found with the given XPath: ${xpath}`);
    return false;
  }
}

const observer = new MutationObserver(function (mutations, obs) {
  xpaths.forEach(xpath => {
    if (blockElementByXPath(xpath)) {
      processedXPaths.add(xpath);  // 添加到已处理集合
    }
  });

  // 检查是否所有的 XPath 都已处理
  if (processedXPaths.size === xpaths.length) {
    observer.disconnect();
    console.log('All specified XPath elements have been processed and observer has been disconnected.');
  }
});

// 仅在有 XPath 需要处理时设置观察者,目前功能尚不完善，先注释，之后再搞
// if (xpaths.length > 0) {
//   // 初始检查每个 XPath
//   xpaths.forEach(xpath => {
//     if (blockElementByXPath(xpath)) {
//       processedXPaths.add(xpath);
//     }
//   });

//   // 如果初始检查后仍有未处理的 XPath，则开始监听变化
//   if (processedXPaths.size < xpaths.length) {
//     document.addEventListener('DOMContentLoaded', () => {
//       observer.observe(document.body, { childList: true, subtree: true });
//       console.log('Observer has been attached: Waiting for changes to process remaining XPath elements.');
//     });
//   } else {
//     console.log('All XPath elements were processed initially. No observer needed.');
//   }
// } else {
//   console.log('No XPath elements specified for observation.');
// }



// 监听键盘事件
document.addEventListener('keydown', (event) => {
  if (event.key === '\\') {
    try {
      chrome.runtime.sendMessage({ command: "fastForward" });
      console.log(`读取\\ 完毕`);

    } catch (error) {

    }
  } else if (event.key === '\|') {
    try {
      chrome.runtime.sendMessage({ command: "fastBackward" });
    } catch (error) {

    }
  } else if (event.ctrlKey) {
    if (event.key === 'ArrowUp') {
      // 增加视频倍速
      try {
        chrome.runtime.sendMessage({ command: "fastSpeed" });
      } catch (error) {

      }
    } else if (event.key === 'ArrowDown') {
      // 增加视频倍速
      try {
        chrome.runtime.sendMessage({ command: "slowSpeed" });
      } catch (error) {

      }

    }
    // else if (event.key === 'ArrowLeft') {
    //   try {
    //     event.preventDefault(); // 禁止默认行为

    //     chrome.runtime.sendMessage({ command: "switchLeftTab" })

    //   } catch (error) {

    //   }

    // } else if (event.key === 'ArrowRight') {
    //   try {
    //     chrome.runtime.sendMessage({ command: "switchRightTab" })

    //   } catch (error) {

    //   }

    // }
  }
  else if (event.key === 'e') {
    try {
      chrome.runtime.sendMessage({ command: "sannpeiicecream", keyState: "keydown" });
    } catch (error) {
      // 处理错误
    }
  }
  else if (event.altKey && event.key >= '1' && event.key <= '9') {
    try {
      const index = event.key; // 获取按下的数字键（1-9）
      chrome.runtime.sendMessage({ command: "selectTab", index: index });
      console.log(`发送选择信息，索引: ${index}`);
    } catch (error) {
      // 处理错误
    }
  }
  else if (event.altKey && event.key === '`') {
    try {
      chrome.runtime.sendMessage({ command: "switchLastTab", });
    } catch (error) {
      // 处理错误
    }
  }
});


let aid = -1;
let panel = null;  // 用于记录当前面板 DOM 元素，方便清理

function createFolderPanel(folders) {
  // 先移除旧面板（如果存在）
  if (panel && panel.parentNode) {
    panel.parentNode.removeChild(panel);
  }

  // 创建新面板
  panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.left = '0px';
  panel.style.top = '100px';
  panel.style.zIndex = '9999';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '10px';

  folders.slice(0, 10).forEach(folder => {
    const item = document.createElement('div');
    item.textContent = folder.title;
    item.title = folder.title;
    item.className = 'bili-folder-item';
    if (folder.fav_state === 1) {
      item.classList.add('collected');
    }

    item.addEventListener('click', async () => {
      try {
        const raw = document.cookie;
        const cookieObj = Object.fromEntries(raw.split('; ').map(c => c.split('=')));
        const jct_csrf = cookieObj['bili_jct'];
        const isAdd = !folder.fav_state;
        const addList = isAdd ? [folder.id] : [];
        const delList = isAdd ? [] : [folder.id];

        const res = await fetch("https://api.bilibili.com/x/v3/fav/resource/deal", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            rid: aid,
            type: "2",
            add_media_ids: addList,
            del_media_ids: delList,
            platform: "web",
            csrf: jct_csrf,
            statistics: JSON.stringify({ appId: 100, platform: 5 })
          })
        }).then(r => r.json());

        if (res.code === 0) {
          folder.fav_state = isAdd ? 1 : 0;
          item.classList.toggle('collected', isAdd);
        }
      } catch (error) {
        console.error('请求出错:', error);
      }
    });

    panel.appendChild(item);
  });

  document.body.appendChild(panel);
}

function initPanel() {
  const currentUrl = window.location.href;
  if (currentUrl.includes("bilibili.com/video/")) {
    const match = currentUrl.match(/\/video\/(BV[0-9A-Za-z]+)/);
    const bvId = match ? match[1] : null;
    if (bvId) {
      chrome.runtime.sendMessage({ action: 'get_folders', bid: bvId }, function (response) {
        const folders = response.data?.list || [];
        aid = response.aid ? response.aid : -1;
        createFolderPanel(folders);
      });
    } else {
      console.warn("未能从 URL 中提取出 BV ID");
    }
  } else {
    // 页面跳转后不是视频页面也要清理面板
    if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
      panel = null;
    }
  }
}

// 初始执行一次
initPanel();

// 监听页面跳转事件（仅支持部分浏览器）
if (window.navigation && window.navigation.addEventListener) {
  window.navigation.addEventListener("navigate", (event) => {
    console.log('location changed!');
    setTimeout(initPanel, 200); // 异步确保 DOM 更新
  });
} 
// else {
//   // fallback：监听 popstate / pushState（兼容旧浏览器或非-WICG 实现）
//   window.addEventListener("popstate", () => setTimeout(initPanel, 200));
//   const _pushState = history.pushState;
//   history.pushState = function (...args) {
//     _pushState.apply(this, args);
//     setTimeout(initPanel, 200);
//   };
// }