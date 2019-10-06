"use strict";

import { getCurrentUrl, getEpagesVersion } from "./helpers.js";

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
    document.getElementById("not-epages").style.display = "block";
    return;
  }

  const [baseUrl] = url.match(
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
  );
  const ePagesVersion = await getEpagesVersion(baseUrl);

  if (ePagesVersion) {
    document.getElementById("epages-details").style.display = "block";
    document.getElementById("product").innerText = (await isBeyondShop(baseUrl))
      ? "BEYOND"
      : "NOW";
    document.getElementById("version").innerText = `${
      ePagesVersion.describe
    } (${window.moment(ePagesVersion.authorDate).fromNow()})`;
  } else {
    document.getElementById("not-epages").style.display = "block";
  }
})();
