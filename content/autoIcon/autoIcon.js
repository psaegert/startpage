chrome.storage.local.get("startpage_autoIcon", function(a){
    let aI = a.startpage_autoIcon;
    if(aI.active){
        if($("link[rel='shortcut icon']") != undefined){
            let href = $("link[rel='icon']").eq(0).attr("href");
            href[0] == "/" ? href = window.location.origin +  $("link[rel='icon']").eq(0).attr("href") : href =  $("link[rel='icon']").eq(0).attr("href")
            aI.active = false;
    
            chrome.storage.local.get("startpage_settings", function(s){
                settings = s.startpage_settings;
                websites = settings.sidebar_websites;
    
                if(href.replace(/\s/g, '') != "" && aI.name.replace(/\s/g, '') != "" && websites.filter(website => website.name == aI.name).length == 1 && href.indexOf("://") > 0){
    
                    websites.filter(website => website.name == aI.name)[0].img = href;
                    
                    chrome.storage.local.set({startpage_autoIcon: aI})
    
                    settings.sidebar_websites = websites;
                    chrome.storage.local.set({startpage_settings: settings})

                    chrome.storage.local.set({startpage_autoIcon: {active:false, href:"", name:""}})
                    chrome.runtime.sendMessage({action: "closeCurrent"})
                }
            })
        } else {
            chrome.storage.local.set({startpage_autoIcon: {active:false, href:"", name:""}})
            chrome.runtime.sendMessage({action: "closeCurrent"})
        }
    }
})