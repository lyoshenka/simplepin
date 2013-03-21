getOptions = function() {
  var _options = {
    'auth_token': false
  };

  for (var option in _options) {
    if (localStorage.getItem(option) !== null) {
      _options[option] = localStorage[option] === 'true' ? true : (localStorage[option] === 'false' ? false : localStorage[option]);
    }
  }

  _options['_uid'] = localStorage['_uid'];
  if (!_options['_uid'])
  {
    _options['_uid'] = 1e9 + Math.floor(Math.random() * (-(1<<31) - 1e9)); // random number from 100000000 and 2147483647
    localStorage['_uid'] = _options['_uid'];
  }

  return _options;
};

function doInCurrentTab(tabCallback) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) { tabCallback(tabArray[0]); }
  );
}

var pinboardListener = function (tabId, changeInfo, tab) {
  if(changeInfo.status == "loading") {
    if(tab.url == "http://pinboard.in/add") {
      chrome.tabs.remove(tabId);
    }
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
// see also: http://stackoverflow.com/questions/3767429/button-in-popup-that-get-selected-text-chrome-extension
  chrome.tabs.onUpdated.removeListener(pinboardListener);
  chrome.tabs.executeScript(tab.id, {file: "selection.js"}, function () {
    chrome.tabs.sendMessage(tab.id, {method: "getSelection"}, function (response) {
      var description = response.data;
      window.open(
        'http://pinboard.in/add?url=' + encodeURIComponent(tab.url) + 
          '&description=' + encodeURIComponent(description) + 
          '&title=' + encodeURIComponent(tab.title),
        '_blank', 
        'toolbar=no,width=700,height=350'
      );
      chrome.tabs.onUpdated.addListener(pinboardListener);
    });
  });
});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getOptions")
  {
    sendResponse({ options: getOptions() });
  }
  else if (request.method == "badge")
  {
    doInCurrentTab(function(tab) {      
      if (request.visited)
      {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#00FF00', tabId: tab.id });
        chrome.browserAction.setBadgeText({text: 'PIN', tabId: tab.id});
      }
      else
      {
        chrome.browserAction.setBadgeText({ text : "", tabId: tab.id});
      }
    });
  }
  else
  {
    sendResponse({});
  }
});


//  if (chrome.i18n.getMessage('@@extension_id') == 'lkihgbnjeomjkfgdkimldpipggffikjo')
//  {
//    var _gaq = _gaq || [];
//    _gaq.push(['_setAccount', 'UA-28704123-1']);
//    _gaq.push(['_trackPageview']);
//
//    (function() {
//      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//      ga.src = 'https://ssl.google-analytics.com/ga.js';
//      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//    })();
//  }
