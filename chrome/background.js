"use strict";

import {
  getCurrentUrl,
  getEpagesVersion,
  looksLikeABaseShop
} from "./helpers.js";

const updateIcon = async () => {
  const url = await getCurrentUrl();
  if (url) {
    const [baseUrl] = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
    );

    if (await getEpagesVersion(baseUrl)) {
      window.chrome.browserAction.setIcon({ path: "images/enabled.png" });
      return;
    } else if (await looksLikeABaseShop(baseUrl)) {
      window.chrome.browserAction.setIcon({ path: "images/enabled.png" });
      return;
    }
  }
  window.chrome.browserAction.setIcon({ path: "images/disabled.png" });
};

chrome.tabs.onUpdated.addListener(updateIcon);
chrome.tabs.onActivated.addListener(updateIcon);
chrome.runtime.onInstalled.addListener(updateIcon);
