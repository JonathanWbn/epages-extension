export function uppercaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getTab() {
  if (chrome) {
    return new Promise((resolve) => {
      browser.tabs.query({ active: true, currentWindow: true }, ([tab]) =>
        resolve(tab)
      );
    });
  } else {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  }
}
