import * as $ from "jquery";
import * as JsSearch from "js-search";
import "../img/icon.png";
import '../css/popup.css';

$(document).ready(function() {
  let tabData = [];
  let url;
  var search;

  chrome.tabs.query({}, function(tabs) {
    tabs.map(val => {
      console.log(val);
      url = new URL(val.url);
      tabData.push({
        id: val.id,
        hostname: url.hostname,
        url: url.href,
        title: val.title
      });
    });
    search = new JsSearch.Search("hostname");
    search.addIndex("hostname");
    search.addDocuments(tabData);
  });

  $("#searchBox").on("keyup", function(e) {
    let results = search.search(e.target.value);
    let resultHtml = "";
    results.map((val, index) => {
      resultHtml += `<li><a href="${val.url}" class="tabResult" id="${val.id}">${val.title}</a></li>`;
    });
    $("#results").empty();
    $("#results").append(resultHtml);
  });

  $("body").on("click", "a", function(e) {
    let tabId = parseInt(e.target.id);
    chrome.tabs.update(tabId, {active:true});
  });
});
