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

export const getCurrentUrl = async () =>
  new Promise(resolve => {
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab || !tab.url) resolve(null);
      else resolve(tab.url);
    });
  });

export const getEpagesVersion = async url => {
  try {
    const version = await (await fetch(`${url}/version.json`)).json();

    return looksLikeAnEpagesVersion(version) ? version : null;
  } catch {
    return null;
  }
};

export const looksLikeABaseShop = async url => {
  try {
    const result = await fetch(`${url}/WebRoot/WebAdapterError.html`);
    const html = await result.text();
    if (html.includes("Your request couldn't be served. Please try again.")) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
