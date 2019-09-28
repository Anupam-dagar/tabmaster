import * as $ from "jquery";
import * as JsSearch from "js-search";
import "../img/icon.png";
import "../css/popup.css";
import "../css/bootstrap.min.css";

$(document).ready(function() {
  $("#searchBox").focus();
  let tabData = [];
  let url;
  var search;
  var aTags;
  var aTagSelected;
  var next;

  chrome.tabs.query({}, function(tabs) {
    tabs.map(val => {
      url = new URL(val.url);
      tabData.push({
        id: val.id,
        hostname: url.hostname,
        url: url.href,
        title: val.title
      });
    });
    search = new JsSearch.Search("url");
    search.addIndex("url");
    search.addDocuments(tabData);
  });

  $("#searchBox").on("keyup", function(e) {
    let results = search.search(e.target.value);
    let resultHtml = "";
    results.map((val, index) => {
      resultHtml += `<a href="#" class="search_results list-group-item list-group-item-action small" id="${val.id}">${val.title}</a>`;
    });
    $("#results").empty();
    $("#results").append(resultHtml);
    aTags = $("a.search_results");
  });

  $("body").on("click", "a.search_results", function(e) {
    let tabId = parseInt(e.target.id);
    chrome.tabs.update(tabId, { active: true });
  });

  $(window).keydown(function(e) {
    if (e.which === 40) {
      if (aTagSelected) {
        aTagSelected.removeClass("selected");
        next = aTagSelected.next();
        if (next.length > 0) {
          aTagSelected = next.addClass("selected");
          aTagSelected.focus();
        } else {
          aTagSelected = aTags.eq(0).addClass("selected");
          aTagSelected.focus();
        }
      } else {
        aTagSelected = aTags.eq(0).addClass("selected");
        aTagSelected.focus();
      }
    } else if (e.which === 38) {
      if (aTagSelected) {
        aTagSelected.removeClass("selected");
        next = aTagSelected.prev();
        if (next.length > 0) {
          aTagSelected = next.addClass("selected");
          aTagSelected.focus();
        } else {
          aTagSelected = aTags.last().addClass("selected");
          aTagSelected.focus();
        }
      } else {
        aTagSelected = aTags.last().addClass("selected");
        aTagSelected.focus();
      }
    }
  });
});
