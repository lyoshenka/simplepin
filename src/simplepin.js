simplePin = function(options) {
  var //extensionId = 'lkihgbnjeomjkfgdkimldpipggffikjo',
      //dev = chrome.i18n.getMessage('@@extension_id') != extensionId, // true if developing, false if installed for real
      //analyticsId = dev ? 'UA-28704123-2' : 'UA-28704123-1',
      //ga = function(page) { tiny_ga(analyticsId,'none',page,options['_uid'], 'xhr'); },
      token = options['auth_token']
      ;

  if (token)
  {
    $.getJSON('https://api.pinboard.in/v1/posts/get', {
      auth_token: token,
      url: window.location.href,
      format: 'json'
    }, function(data) {
      chrome.extension.sendMessage({ method: "badge", visited: !!data.posts.length });
    });

    //ga('/popup_open'); // analytics
  }
};

chrome.extension.sendMessage({method: "getOptions"}, function(response) {
  simplePin(response.options);
});
