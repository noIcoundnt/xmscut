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
    } 
  }

});