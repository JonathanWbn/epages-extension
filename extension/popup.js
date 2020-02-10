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

const themes = {
  neutral: ['basic', 'light', 'solid'],
  vision: ['elegant', 'young', 'glossy'],
  essence: ['classic', 'pure', 'fresh'],
  limelight: ['bold', 'harmonic', 'current'],
  editorial: ['modern', 'vintage', 'vivid'],
  uptown: ['cool', 'deep', 'sweet'],
  structure: ['contemporary', 'individual', 'prime'],
}



const markAsNotEpages = () => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("not-epages").style.display = "block";
};

(async () => {
  const tab = await getTab();
  const themeSelect = document.getElementById("theme-select")
  const themeButton = document.getElementById("theme-button")
  const styleSelect = document.getElementById("style-select")
  const emptyOption = document.getElementById("empty-option")

  Object.keys(themes).forEach((theme) => {
    const option = document.createElement("option")
    option.setAttribute("value", theme);
    option.innerText = `Theme ${theme.charAt(0).toUpperCase()}${theme.slice(1)}`;
    themeSelect.appendChild(option)
  })

  themeButton.onclick = () => {
    const theme = themeSelect.value
    const style = styleSelect.value
    chrome.tabs.update(tab.id, { url: `${tab.url}?ViewAction=UnityMBO-ViewSFThemePreview&previewTheme=epages.${theme}@dev&themeStyle=${style}` });
  };

  themeSelect.onchange = () => {
    if (emptyOption) themeSelect.removeChild(emptyOption)
    styleSelect.style.display = "block";
    styleSelect.innerHTML = '';
    themes[themeSelect.value].forEach(style => {
      const option = document.createElement("option")
      option.setAttribute("value", style);
      option.innerText = `Style ${style.charAt(0).toUpperCase()}${style.slice(1)}`;
      styleSelect.appendChild(option);
    });
  };

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
