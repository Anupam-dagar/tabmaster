export function getOpenedTabs() {
  let tabData = [];
  let url;
  chrome.tabs.query({}, function(tabs) {
    tabs.map(val => {
      url = new URL(val.url);
      tabData.push({
        hostname: url.hostname,
        url: url.href
      });
    });

    return tabData;
  });
}
