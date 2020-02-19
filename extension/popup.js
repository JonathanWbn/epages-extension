"use strict";

import {
  getEpagesVersion,
  getTab,
  looksLikeABaseShop,
  uppercaseFirst
} from "./helpers.js";

const themes = {
  neutral: ["basic", "light", "solid"],
  vision: ["elegant", "young", "glossy"],
  spotlight: ["classic", "pure", "fresh"],
  limelight: ["bold", "harmonic", "current"],
  editorial: ["modern", "vintage", "vivid"],
  uptown: ["cool", "deep", "sweet"],
  structure: ["contemporary", "individual", "prime"]
};

window.browser = window.browser || window.chrome;

async function isBeyondShop(url) {
  try {
    const response = await fetch(`${url}/api/v2/shop`);
    const shop = await response.json();

    return Boolean(shop.beyond);
  } catch {
    return false;
  }
}

function markAsNotEpages() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("not-epages").style.display = "block";
}

function initializeThemesDropdown() {
  const themeSelect = document.getElementById("theme-select");

  Object.keys(themes).forEach(theme => {
    const option = document.createElement("option");
    option.setAttribute("value", theme);
    option.innerText = `Theme ${uppercaseFirst(theme)}`;
    themeSelect.appendChild(option);
  });
}

function selectTheme(theme) {
  const themeSelect = document.getElementById("theme-select");
  const styleSelect = document.getElementById("style-select");
  const emptyOption = document.getElementById("empty-option");

  if (emptyOption) themeSelect.removeChild(emptyOption);
  themeSelect.value = theme;

  styleSelect.style.display = "block";
  styleSelect.innerHTML = "";
  themes[theme].forEach(style => {
    const option = document.createElement("option");
    option.setAttribute("value", style);
    option.innerText = `Style ${style.charAt(0).toUpperCase()}${style.slice(
      1
    )}`;
    styleSelect.appendChild(option);
  });
}

function selectStyle(style) {}

function getStyle(tab) {
  const res = {};
  const url = new URL(tab.url);
  const previewTheme = url.searchParams.get("previewTheme");
  const themeStyle = url.searchParams.get("themeStyle");

  if (previewTheme) {
    const [, theme] = /epages\.(.*?)@dev/.exec(previewTheme);
    if (theme) {
      res.theme = theme;
      if (themeStyle) res.style = themeStyle;
    }
  }
  return res;
}

function setTheme(tab, theme, style) {
  const url = new URL(tab.url);

  url.searchParams.set("ViewAction", "UnityMBO-ViewSFThemePreview");
  url.searchParams.set("previewTheme", `epages.${theme}@dev`);
  url.searchParams.set("themeStyle", style);
  chrome.tabs.update(tab.id, { url: decodeURIComponent(url.toJSON()) });
}

(async () => {
  const tab = await getTab();
  const themeSelect = document.getElementById("theme-select");
  const themeButton = document.getElementById("theme-button");

  initializeThemesDropdown();
  const { theme, style } = getStyle(tab);

  if (theme) selectTheme(theme);
  if (style) selectStyle(style);

  themeButton.onclick = async () => {
    const tab = await getTab();
    const theme = themeSelect.value;
    const style = document.getElementById("style-select").value;

    setTheme(tab, theme, style);
  };

  themeSelect.onchange = () => {
    selectTheme(document.getElementById("theme-select").value);
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
