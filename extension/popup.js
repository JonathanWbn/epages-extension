"use strict";

import { getTab, uppercaseFirst } from "./helpers.js";

const themes = {
  neutral: ["basic", "light", "solid"],
  vision: ["elegant", "young", "glossy"],
  spotlight: ["classic", "pure", "fresh"],
  limelight: ["bold", "harmonic", "current"],
  editorial: ["modern", "vintage", "vivid"],
  uptown: ["cool", "deep", "sweet"],
  structure: ["contemporary", "individual", "prime"],
};

window.browser = window.browser || window.chrome;

(async () => {
  const tab = await getTab();
  const themeSelect = document.getElementById("theme-select");
  const styleSelect = document.getElementById("style-select");
  const styleHeading = document.getElementById("style-heading");
  const submitButton = document.getElementById("open");

  initializeThemes();

  let { theme: selectedTheme, style: selectedStyle } = getStyle(tab);

  if (themes[selectedTheme]) selectTheme(selectedTheme);
  if (selectedStyle) selectStyle(selectedStyle);

  submitButton.onclick = async () => {
    const tab = await getTab();

    setTheme(tab, selectedTheme, selectedStyle);
    window.close();
  };

  function initializeThemes() {
    Object.keys(themes).forEach((theme) => {
      const option = document.createElement("div");
      option.setAttribute("id", theme);
      option.innerText = uppercaseFirst(theme);
      option.onclick = () => selectTheme(theme);
      themeSelect.appendChild(option);
    });
  }

  function selectTheme(theme) {
    if (
      [...themeSelect.childNodes].find(
        (child) =>
          child.getAttribute("id") === theme &&
          child.classList.contains("selected")
      )
    ) {
      return;
    }
    themeSelect.childNodes.forEach((child) => {
      if (child.getAttribute("id") === theme) {
        selectedTheme = theme;
        child.classList.add("selected");
      } else {
        child.classList.remove("selected");
      }
    });

    styleSelect.style.display = "flex";
    styleHeading.style.display = "block";
    submitButton.style.display = "none";

    styleSelect.innerHTML = "";
    themes[theme].forEach((style) => {
      const option = document.createElement("div");
      option.setAttribute("id", style);
      option.innerText = uppercaseFirst(style);
      option.onclick = () => selectStyle(style);
      styleSelect.appendChild(option);
    });
  }

  function selectStyle(style) {
    styleSelect.childNodes.forEach((child) => {
      if (child.getAttribute("id") === style) {
        child.classList.add("selected");
        selectedStyle = style;
        submitButton.style.display = "block";
      } else {
        child.classList.remove("selected");
      }
    });
  }
})();

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
