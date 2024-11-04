
let contentnode = new contentNode();
contentnode.indicators = []; // 用于存储所有小红点元素的数组
contentnode.selected = [];

async function initialize() {
  try {
    // 获取存储中的所有绑定数据

    const currentUrl = window.location.href;

    // 解析URL以匹配特定的网站
    const urlPattern = new URL(currentUrl);
    contentnode.host = urlPattern.hostname;
    console.log('当前网页的host:', contentnode.host);


    const dataKey = 'bindings_' + contentnode.host; // 为每个网站创建唯一的存储键
    const URLdata = (await chrome.storage.local.get(dataKey))[dataKey] || {};
    contentnode.URLdata = URLdata;
    // const bindings = storedData[dataKey] || {}; // 如果没有找到，使用空对象
    const data = URLdata['bindings'] || {};


    Object.keys(data).forEach(xpath => {
      const key = data[xpath];
      if (/^[0-9a-zA-Z,.]+$/.test(key)) {

        console.log(`找到XPath为 ${xpath} 的元素`);

        bindKeyToElement(xpath, key); 
      }
    });

    console.log('初始化时获取存储数据:', data);
    showMessageBubble(data);
    showMessageBubble('Content script initialized');
  } catch (error) {
    console.error('初始化时获取存储数据出错:', error);
    // 可以选择显示错误消息
    showMessageBubble('Error during initialization');
  }
}

// 当内容脚本加载时立即执行初始化
if (document.readyState === "loading") {  // 如果文档仍在加载
  document.addEventListener('DOMContentLoaded', initialize);
  createPersistentButtons();
  console.log('DOMContentLoaded');
} else {  // `DOMContentLoaded` 已经触发
  initialize();
  createPersistentButtons();
}

//last

//last

// new upload code // contentScript.js
document.addEventListener('keydown', function (event) {
  if (event.key === 'q') {
    if (isInInputMode()) {
      showMessageBubble('当前处于输入模式，无法触发点击事件');
      return;
    }
    event.preventDefault(); // 阻止元素的默认点击行为
    const clickableElements = document.querySelectorAll('a, button, input, select, textarea');
    if (contentnode.model === 0) { // 检查是否是Q键
      clickableElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        const indicator = document.createElement('div');
        indicator.classList.add('visual-indicator');
        indicator.style.position = 'absolute';
        indicator.style.width = '15px';
        indicator.style.height = '15px';
        indicator.style.borderRadius = '50%';
        indicator.style.backgroundColor = 'red';
        // 使用getBoundingClientRect和window的滚动偏移来计算正确的位置
        indicator.style.top = (rect.top + window.scrollY - 5) + 'px'; // 调整为所需
        indicator.style.left = (rect.left + window.scrollX - 5) + 'px';
        indicator.style.zIndex = '10000000';

        indicator.dataset.indicatorId = `indicator-${index}`;
        element.dataset.indicatorId = `indicator-${index}`;
        element.classList.add('selected')
        
        document.body.appendChild(indicator);
        contentnode.indicators.push(indicator);
        contentnode.selected.push(element);
        indicator.addEventListener('click', preventDefaultClick, { once: true });

      });
      contentnode.model = 1;
      console.log('model 1 activated');
      showMessageBubble('model 1 activated');
    }
    else {
      clickableElements.forEach(element => {
        element.removeEventListener('click', preventDefaultClick); // 如果需要，移除之前添加的点击事件监听
      });
      contentnode.model = 0;
      console.log('model 0 activated');
      showMessageBubble('model 0 activated');
      clearIndicators(); // 清除所有小红点
      clearSelected();
    }
  }
  else if (event.key === 'esc') {
    if (contentnode.model === 1) {
      contentnode.model = 0;
      clearIndicators(); // 清除所有小红点
      clearSelected();
      showMessageBubble('model 0 activated');
    }
    else if (contentnode.model === 2) {
      contentnode.model = 0;
      document.removeEventListener('keydown', bindElementToKey); // 移除键盘事件监听
      clearIndicators(); // 清除所有小红点
      clearSelected();
      showMessageBubble('model 0 activated');
    }
  }
});


function preventDefaultClick(event) {
  event.preventDefault(); // 阻止元素的默认点击行为
  const indicatorId = event.target.dataset.indicatorId;
  const selectedElement = document.querySelector(`[data-indicator-id="${indicatorId}"]:not(.visual-indicator)`);
  const elementXPath = generateXPath(selectedElement); // 生成元素的XPath

  if (event.target) {
    event.target.style.backgroundColor = 'green'; // 将指示球的颜色改为绿色或其他标示选中的颜色
  }
  else {
    showMessageBubble('未找到指示器');
    return;
  }

  const dataKey = 'bindings_' + contentnode.host; // 为每个网站创建唯一的存储键

  document.addEventListener('keydown', async function bindElementToKey(e) {
    contentnode.model = 2;
    showMessageBubble('model 2 activated');

    if (/^[0-9a-zA-Z,.]+$/.test(e.key)) {
      // 使用elementXPath作为键，将按键与元素绑定
      contentnode.model = 0;

      const URLdata = (await chrome.storage.local.get(dataKey))[dataKey] || {};
      if (!URLdata['bindings']) URLdata['bindings'] = {};
      URLdata['bindings'][elementXPath] = e.key; // 更新绑定信息

      await chrome.storage.local.set({ [dataKey]: URLdata });
      console.log('元素与键绑定成功');
      showMessageBubble(`键: ${e.key}与元素: ${elementXPath} 绑定成功`);
      
      bindKeyToElement(elementXPath,e.key); // 使用新抽象的函数绑定事件
      
      selectedElement.removeEventListener('click', preventDefaultClick); // 移除点击事件监听
      document.removeEventListener('keydown', bindElementToKey); // 移除键盘事件监听
      clearIndicators(); // 清除所有小红点
      clearSelected();


    }
  }, { once: true });
}

function generateXPath(element) {
  if (element.id !== '') {
    return 'id("' + element.id + '")';
  }
  if (element === document.body) {
    return element.tagName;
  }

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element) {
      return generateXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}
// 通过XPath获取元素的函数
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
let bubbleTimeout;

function showMessageBubble(message) {
  let bubble = document.getElementById('customMessageBubble');

  // 清除之前的计时器
  clearTimeout(bubbleTimeout);

  if (bubble) {
    bubble.innerHTML += '<br><pre>' + (typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message)) + '</pre>';
  } else {
    bubble = document.createElement('div');
    bubble.setAttribute('id', 'customMessageBubble');
    bubble.style.position = 'fixed';
    bubble.style.bottom = '20px';
    bubble.style.right = '20px';
    bubble.style.padding = '10px';
    bubble.style.background = 'rgba(0, 0, 0, 0.7)';
    bubble.style.color = 'white';
    bubble.style.borderRadius = '8px';
    bubble.style.zIndex = '10000';
    bubble.style.maxWidth = '600px';
    bubble.style.wordWrap = 'break-word';
    bubble.style.overflowY = 'auto';
    bubble.style.maxHeight = '700px';

    bubble.innerHTML = '<pre>' + (typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message)) + '</pre>';

    document.body.appendChild(bubble);

    // 鼠标悬停时暂停消失计时器
    bubble.addEventListener('mouseenter', () => {
      clearTimeout(bubbleTimeout);
    });

    // 鼠标离开时重启消失计时器
    bubble.addEventListener('mouseleave', () => {
      bubbleTimeout = setTimeout(() => {
        bubble.remove();
      }, 5000);
    });
  }

  // 设置定时器使消息在一定时间后消失
  bubbleTimeout = setTimeout(() => {
    bubble.remove();
  }, 5000);
}

function createPersistentButtons() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.left = '20px';
  container.style.zIndex = '10000';

  // 创建显示存储内容的按钮
  const showStorageBtn = document.createElement('button');
  showStorageBtn.textContent = '显示存储';
  showStorageBtn.style.marginRight = '10px';
  applyButtonStyles(showStorageBtn);
  showStorageBtn.onclick = async () => {
    const storageData = await chrome.storage.local.get(null);
    showMessageBubble(JSON.stringify(storageData, null, 2));
  };

  // 创建清除存储的按钮
  const clearStorageBtn = document.createElement('button');
  clearStorageBtn.textContent = '清除存储';
  applyButtonStyles(clearStorageBtn);
  clearStorageBtn.onclick = () => {
    chrome.storage.local.clear(() => {
      showMessageBubble('存储已清除');
    });
  };

  // 将按钮添加到容器，然后容器添加到body
  container.appendChild(showStorageBtn);
  container.appendChild(clearStorageBtn);
  document.body.appendChild(container);
}
// 应用按钮样式的函数
function applyButtonStyles(button) {
  button.style.padding = '5px 10px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.background = 'lightgrey';
}

function clearIndicators() {
  contentnode.indicators.forEach(indicator => indicator.remove()); // 移除所有小红点
  contentnode.indicators = []; // 清空数组
}

function clearSelected(){
  contentnode.selected.forEach(element => element.classList.remove('selected'));
  contentnode.selected = [];

}

function isInInputMode() {
  const tagName = document.activeElement.tagName.toLowerCase();
  const isEditable = document.activeElement.isContentEditable;

  return tagName === 'input' || tagName === 'textarea' || isEditable;
}

function bindKeyToElement(xpath, key) {
  document.addEventListener('keydown', async (e) => {
    if (e.key === key) {
      e.preventDefault(); // 阻止默认行为
      if (isInInputMode()) {
        showMessageBubble('当前处于输入模式，无法触发点击事件');
        return;
      }
      const element = getElementByXPath(xpath);
      if (!element) {
        console.log(`未找到XPath为 ${xpath} 的元素`);
        showMessageBubble(`未找到XPath为 ${xpath} 的元素`);
        return;
      }

      // 根据元素类型选择触发click还是focus
      if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select') {
        element.focus();
      } else {
        element.click();
      }
      console.log(`触发了元素: ${xpath} 的点击事件`);
      showMessageBubble(`触发了元素: ${xpath} 的点击事件`);
    }
  }, { once: false }); // 根据需求决定是否只监听一次
}


