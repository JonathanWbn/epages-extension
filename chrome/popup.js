"use strict";

const looksLikeAnEpagesVersion = version =>
  Boolean(
    version &&
      version.author &&
      version.authorDate &&
      version.commit &&
      version.committer &&
      version.committerDate &&
      version.describe &&
      version.refs &&
      version.tag
  );

const getUrl = () =>
  new Promise(resolve => {
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab.url) resolve(null);
      else resolve(tab.url);
    });
  });

const getEpagesVersion = async url => {
  try {
    const response = await fetch(`${url}/version.json`);
    const version = await response.json();

    return looksLikeAnEpagesVersion(version) ? version : null;
  } catch {
    return null;
  }
};

const getIsBeyondShop = async url => {
  try {
    const response = await fetch(`${url}/api/v2/shop`);
    const shop = await response.json();

    return Boolean(shop.beyond);
  } catch {
    return false;
  }
};

(async () => {
  const url = await getUrl();
  if (!url) return;

  const [baseUrl] = url.match(
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
  );
  const ePagesVersion = await getEpagesVersion(baseUrl);

  if (ePagesVersion) {
    const isBeyondShop = await getIsBeyondShop(baseUrl);
    document.getElementById("epages-details").style.display = "block";
    document.getElementById("product").innerText = isBeyondShop
      ? "BEYOND"
      : "NOW";
    document.getElementById("version").innerText = `${
      ePagesVersion.describe
    } (${window.moment(ePagesVersion.authorDate).fromNow()})`;
  } else {
    document.getElementById("not-epages").style.display = "block";
  }
})();
