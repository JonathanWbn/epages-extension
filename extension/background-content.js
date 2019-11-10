"use strict";

window.browser = window.browser || window.chrome;

browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.text === "is_epages_shop") {
    const head = document.getElementsByTagName("head")[0];
    const occurencesOfEpages = head.innerHTML.match(/epages/g).length;

    if (occurencesOfEpages > 5) sendResponse(true);
    else sendResponse(false);
  }
});
