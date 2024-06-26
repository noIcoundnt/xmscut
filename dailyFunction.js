document.addEventListener('keydown', (event) => {
    if (event.key === '\\') {
      try {
        chrome.runtime.sendMessage({ command: "fastForward" });
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
  });