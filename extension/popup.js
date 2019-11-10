"use strict";

import {
  getCurrentUrl,
  getEpagesVersion,
  looksLikeABaseShop
} from "./helpers.js";

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

(async () => {
  const url = await getCurrentUrl();
  if (!url) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("not-epages").style.display = "block";
    return;
  }

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

    if (beyondShop) {
      browser.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (false) {
          // if (tab) {
          browser.tabs.sendMessage(
            tab.id,
            { text: "check_if_checkout" },
            async () => {
              const wait = ms =>
                new Promise(resolve => setTimeout(resolve, ms));
              await wait(1000);

              const fastCheckout = document.getElementById("fast-checkout");
              fastCheckout.style.display = "block";
              const checkoutButton = document.getElementById("checkout-button");
              checkoutButton.onclick = () =>
                browser.tabs.sendMessage(tab.id, {
                  text: "fast_checkout",
                  profile: "jane_doe"
                });
            }
          );
        }
      });
    }
  } else if (await looksLikeABaseShop(baseUrl)) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("product").innerText = "BASE";
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("not-epages").style.display = "block";
  }
})();
