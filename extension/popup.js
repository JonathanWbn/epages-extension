"use strict";

import {
  getCurrentUrl,
  getEpagesVersion,
  looksLikeABaseShop
} from "./helpers.js";

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
    const product = (await isBeyondShop(baseUrl)) ? "BEYOND" : "NOW";
    document.getElementById("loading").style.display = "none";
    document.getElementById("product").innerText = product;
    document.getElementById("version").innerText = `${
      ePagesVersion.describe
    } (${window.moment(ePagesVersion.authorDate).fromNow()})`;
  } else if (await looksLikeABaseShop(baseUrl)) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("product").innerText = "BASE";
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("not-epages").style.display = "block";
  }
})();
