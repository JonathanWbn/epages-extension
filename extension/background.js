import {
  getCurrentUrl,
  getEpagesVersion,
  looksLikeABaseShop
} from "./helpers.js";

window.browser = window.browser || window.chrome;

const updateIcon = async () => {
  const url = await getCurrentUrl();
  if (url) {
    const [baseUrl] = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
    );

    if (await getEpagesVersion(baseUrl)) {
      browser.browserAction.setIcon({ path: "images/enabled.png" });
      return;
    } else if (await looksLikeABaseShop(baseUrl)) {
      browser.browserAction.setIcon({ path: "images/enabled.png" });
      return;
    }
  }
  browser.browserAction.setIcon({ path: "images/disabled.png" });
};

browser.tabs.onUpdated.addListener(updateIcon);
browser.tabs.onActivated.addListener(updateIcon);
browser.runtime.onInstalled.addListener(updateIcon);
