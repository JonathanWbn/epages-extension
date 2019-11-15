"use strict";

import { getEpagesVersion, getTab, looksLikeABaseShop } from "./helpers.js";

window.browser = window.browser || window.chrome;

const isBeyondShop = async url => {
  try {
    const response = await fetch(`${url}/api/v2/shop`);
    const shop = await response.json();

    return Boolean(shop.beyond);
  } catch {
    return false;
  }
};

const markAsNotEpages = () => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("not-epages").style.display = "block";
};

(async () => {
  const tab = await getTab();

  if (!tab) return markAsNotEpages();

  browser.tabs.executeScript({ file: "background-content.js" });
  const isEpagesShop = await new Promise(resolve => {
    browser.tabs.sendMessage(
      tab.id,
      { text: "is_epages_shop" },
      async isEpagesShop => {
        resolve(isEpagesShop);
      }
    );
  });

  const url = tab && tab.url;
  if (!url || !isEpagesShop) return markAsNotEpages();

  const [baseUrl] = url.match(
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
  );
  const ePagesVersion = await getEpagesVersion(baseUrl);

  if (ePagesVersion) {
    const beyondShop = await isBeyondShop(baseUrl);
    const product = beyondShop ? "BEYOND" : "NOW";
    document.getElementById("loading").style.display = "none";
    document.getElementById("product").innerText = product;
    document.getElementById("version").innerText = `${
      ePagesVersion.describe
    } (${window.moment(ePagesVersion.authorDate).fromNow()})`;
  } else if (await looksLikeABaseShop(baseUrl)) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("product").innerText = "BASE";
  } else {
    markAsNotEpages();
  }
})();
