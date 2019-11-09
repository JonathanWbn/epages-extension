import { getTab } from "./helpers.js";

window.browser = window.browser || window.chrome;

const updateIcon = async () => {
  chrome.tabs.executeScript({ file: "background-content.js" });

  const tab = await getTab();
  chrome.tabs.sendMessage(
    tab.id,
    { text: "is_epages_shop" },
    async isEpagesShop => {
      if (isEpagesShop) {
        browser.browserAction.setIcon({ path: "images/enabled.png" });
      } else {
        browser.browserAction.setIcon({ path: "images/disabled.png" });
      }
    }
  );
};

browser.tabs.onUpdated.addListener(updateIcon);
browser.tabs.onActivated.addListener(updateIcon);
browser.runtime.onInstalled.addListener(updateIcon);
