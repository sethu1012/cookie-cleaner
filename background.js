chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
    const currentDomain = currentTab.url
      .replace('http://', '')
      .replace('https://', '')
      .split(/[/?#]/)[0];
    console.log(currentDomain);
    const subDomains = currentDomain.split('.');
    const subDomainsLength = subDomains.length;
    for (let i = subDomainsLength - 1; i >= 1; i--) {
      const subDomain = '.'.concat(
        subDomains.slice(subDomainsLength - 1 - i).join('.')
      );
      chrome.cookies.getAll({ domain: subDomain }, function (cookies) {
        cookies.map(function (cookie) {
          chrome.cookies.remove(
            {
              name: cookie.name,
              url: currentTab.url,
            },
            function (removedCookie) {
              console.log('Removed: ', removedCookie);
            }
          );
        });
      });
    }
    chrome.tabs.executeScript(currentTab.id, {
      code: 'window.location.reload()',
    });
  });
});
