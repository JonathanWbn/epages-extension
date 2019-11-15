"use strict";

window.browser = window.browser || window.chrome;

browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.text === "is_epages_shop") {
    const head = document.getElementsByTagName("head")[0];

    const looksLikeNowOrBeyondShop =
      head.innerHTML.match(/epages\.base/g) &&
      head.innerHTML.match(/epages\.base/g).length > 4;
    const looksLikeBaseShop = head.innerHTML.includes("epages.js");

    if (looksLikeNowOrBeyondShop || looksLikeBaseShop) sendResponse(true);
    else sendResponse(false);
  }
});
