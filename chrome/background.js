"use strict";

import { getCurrentUrl, getEpagesVersion } from "./helpers.js";

const updateIcon = async () => {
  const url = await getCurrentUrl();
  if (url) {
    const [baseUrl] = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
    );

    const epagesVersion = await getEpagesVersion(baseUrl);

    if (epagesVersion) {
      window.chrome.browserAction.setIcon({ path: "images/enabled.png" });
      return;
    }
  }
  window.chrome.browserAction.setIcon({ path: "images/disabled.png" });
};

chrome.tabs.onUpdated.addListener(updateIcon);
chrome.tabs.onActivated.addListener(updateIcon);
chrome.runtime.onInstalled.addListener(updateIcon);
