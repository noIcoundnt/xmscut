document.addEventListener('keydown', (event) => {
    if (event.key === '\\') {
      chrome.runtime.sendMessage({ command: "fastForward" });
    }
});