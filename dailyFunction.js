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

// 仅在有 XPath 需要处理时设置观察者
if (xpaths.length > 0) {
  // 初始检查每个 XPath
  xpaths.forEach(xpath => {
    if (blockElementByXPath(xpath)) {
      processedXPaths.add(xpath);
    }
  });

  // 如果初始检查后仍有未处理的 XPath，则开始监听变化
  if (processedXPaths.size < xpaths.length) {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
      console.log('Observer has been attached: Waiting for changes to process remaining XPath elements.');
    });
  } else {
    console.log('All XPath elements were processed initially. No observer needed.');
  }
} else {
  console.log('No XPath elements specified for observation.');
}


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

    } else if (event.key === 'ArrowLeft') {
      try {
        event.preventDefault(); // 禁止默认行为

        chrome.runtime.sendMessage({ command: "switchLeftTab" })

      } catch (error) {

      }

    } else if (event.key === 'ArrowRight') {
      try {
        chrome.runtime.sendMessage({ command: "switchRightTab" })

      } catch (error) {

      }

    }
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
  else if(event.altKey && event.key === '`'){
    try {
      chrome.runtime.sendMessage({ command: "switchLastTab",  });
    } catch (error) {
      // 处理错误
    }
  }
});

