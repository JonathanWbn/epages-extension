export const looksLikeAnEpagesVersion = version =>
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
      if (!tab.url) resolve(null);
      else resolve(tab.url);
    });
  });

export const getEpagesVersion = async url => {
  try {
    const response = await fetch(`${url}/version.json`);
    const version = await response.json();

    return looksLikeAnEpagesVersion(version) ? version : null;
  } catch {
    return null;
  }
};
