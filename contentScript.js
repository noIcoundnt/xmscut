document.addEventListener('keydown', (event) => {
  if (event.key === '\\') {
    try {
      chrome.runtime.sendMessage({ command: "fastForward" });
    } catch (error) {
      console.error("发送消息时出现错误:", error);
    }
  }
});