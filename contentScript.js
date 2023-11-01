document.addEventListener('keydown', (event) => {
  if (event.key === '\\') {
    try {
      chrome.runtime.sendMessage({ command: "fastForward" });
    } catch (error) {

    }
  }else if (event.key === '\|') {
    try {
      chrome.runtime.sendMessage({ command: "fastBackward" });
    } catch (error) {

    }
  }else if (event.ctrlKey) {
    if (event.key === 'ArrowUp') {
      // 增加视频倍速
      try {
        chrome.runtime.sendMessage({ command: "fastSpeed" });
      } catch (error) {
  
      } 
    }else  if (event.key === 'ArrowDown') {
      // 增加视频倍速
      try {
        chrome.runtime.sendMessage({ command: "slowSpeed" });
      } catch (error) {
  
      } 
      
    }else  if (event.key === 'ArrowLeft') { 
      try {
        event.preventDefault(); // 禁止默认行为

        chrome.runtime.sendMessage({command: "switchLeftTab"})

         } catch (error) {
  
      } 
      
    }else  if (event.key === 'ArrowRight') { 
      try {
        chrome.runtime.sendMessage({command: "switchRightTab"})

         } catch (error) {
  
      } 
      
    } 
  }
  else if (event.key === 'e') {
    event.stopPropagation();
    try {
      chrome.runtime.sendMessage({ command: "sannpeiicecream", keyState: "keydown" });
    } catch (error) {
      // 处理错误
    }
  }

});

document.addEventListener('keyup', (event) => {
  if(event.key === 'e') {
    event.preventDefault();
      try {

        chrome.runtime.sendMessage({ command: "sannpeiicecream", keyState: "keyup" });
      } catch (error) {
        // 处理错误
      }
    }
  }
);

window.addEventListener('beforeunload', function (event) {
  // 在页面关闭前执行你的清理操作
  // 例如，保存数据或执行其他清理任务
  console.log('Page is about to unload. Perform cleanup here.');
  // 如果需要，可以使用 event.preventDefault() 阻止页面的关闭
  event.preventDefault();
});