// Create context menu item on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanPhishing",
    title: "Scan selection for Phishing",
    contexts: ["selection"]
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanPhishing" && info.selectionText) {
    // Save the selected text to local storage
    chrome.storage.local.set({ 
      selectedText: info.selectionText,
      autoScan: true 
    }, () => {
      // Set badge text to notify the user
      chrome.action.setBadgeText({ text: "SCAN" });
      chrome.action.setBadgeBackgroundColor({ color: "#00f2fe" });
    });
  }
});
