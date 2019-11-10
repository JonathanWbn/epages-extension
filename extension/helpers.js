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

export const getTab = async () => {
  if (chrome) {
    return new Promise(resolve => {
      browser.tabs.query({ active: true, currentWindow: true }, ([tab]) =>
        resolve(tab)
      );
    });
  } else {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });
    return tab;
  }
};

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
