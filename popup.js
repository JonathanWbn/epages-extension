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

const getEpagesVersion = () =>
  new Promise(resolve => {
    window.chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab.url) resolve(null);

      const [baseUrl] = tab.url.match(
        /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
      );

      fetch(`${baseUrl}/version.json`)
        .then(res => res.json())
        .then(version =>
          resolve(looksLikeAnEpagesVersion(version) ? version : null)
        )
        .catch(() => resolve(null));
    });
  });

(async () => {
  const ePagesVersion = await getEpagesVersion();

  if (ePagesVersion) {
    document.getElementById("title").innerText = `${
      ePagesVersion.describe
    } (${window.moment(ePagesVersion.authorDate).fromNow()})`;
  }
})();
