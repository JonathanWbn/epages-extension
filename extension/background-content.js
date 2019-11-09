"use strict";

chrome.runtime.onMessage.addListener(async function(msg, sender, cb) {
  if (msg.text === "is_epages_shop") {
    const head = document.getElementsByTagName("head")[0];
    const occurenceOfEpages = head.innerHTML.match(/epages/g).length;

    if (occurenceOfEpages > 5) cb(true);
    else cb(false);
  }
});
