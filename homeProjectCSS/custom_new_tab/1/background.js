var redir = ['opera://startpage/', 'browser://startpage/', 'chrome://startpage/'];

chrome.tabs.onCreated.addListener(function(tab){
	
	for (var i = 0; i < redir.length; i++) {
		if(tab.url === redir[i])
			break;
		if(i == redir.length - 1)
			return;
	};

	chrome.storage.local.get('custom_startpage',function(e){

		if((typeof e.custom_startpage) !== 'undefined'){

			for (var i = 0; i < redir.length; i++) 
				if(e.custom_startpage.startsWith(redir[i].substr(0, redir[i].length - 1))) return;
	
			if(e.custom_startpage.indexOf(':') == -1){
				e.custom_startpage = 'http://' + e.custom_startpage;
			}

			chrome.tabs.create({url:e.custom_startpage});
		
		} else {
			chrome.tabs.create({
				url:"settings.htm"
			});
		}
		
		chrome.tabs.remove(tab.id);
	});
	
});
