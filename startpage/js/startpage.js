var weather = {},

dropdown_hovered = false,
clockoverflow = true,
exitPage = false,
keyDodge = false,
done = false,

engine_index = 0,
s_index = -1,
progress = 0,

hovered = -1,
engines = [],

showWeather,
darkmode,
sidebar,
last,
autocomplete,
display,
suggestionsHovered = false;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getWeather() {
    if(showWeather){
        chrome.storage.local.get("startpage_settings", function(e){
            let dkey = e.startpage_settings.darksky_key.replace(/\s/g, '');
            let lat = e.startpage_settings.darksky_loc.lat;
            let lon = e.startpage_settings.darksky_loc.lon;
            if(dkey != ""){
                $.ajax({
                    url: "https://api.darksky.net/forecast/" + dkey + "/" + lat + "," + lon + "?exclude=[minutely,hourly,alerts,flags]",
                    dataType: "jsonp",
                    success: function(data) {
                        weather.temp = ((data.currently.temperature.toFixed(2) - 32) * 5 / 9).toFixed(1);;
                        weather.icon = data.currently.icon.toUpperCase();
                        weather.descr = data.currently.summary;
            
                        weather.hum = data.currently.humidity;
                        weather.clcover = data.currently.cloudCover;
                        weather.uv = data.currently.uvIndex / 11;
                        data.currently.uvIndex / 11;
                    }
                });
            }
        })
    }
}

function startWeather(){
    if(showWeather){
        getWeather();
        updateWeatherDisplay();
    }
    var t = setTimeout(startWeather, 600000);
}

function updateWeatherDisplay(){
    if(!(weather.descr === undefined || weather.temp === undefined) && showWeather){
        $(".weather-description").html(weather.descr);
        $(".weather-degrees").html(weather.temp + " C");
        $(".weather-container").css("opacity", 1);
    } else {
        $(".weather-container").css("opacity", 0);
        $(".weather-description").html("asdf");
        $(".weather-degrees").html("asdf");
    }
}

function updateTimeDisplay(h, m){
    if(done){
        progress = (h * 3600 + m * 60) / (24 * 36);
        $(".time").css("transform", "translateX(" + progress + "%)")
        
        if($(".header").width() * (100- progress) / 100 > 75){
            $(".clock").css("transform", "translateX(" + progress + "%)");
            $(".clock").removeClass("shiftLeft");
        } else {
            $(".clock").css("transform", "translateX(100%)");
            $(".clock").addClass("shiftLeft");
        }

        if(h==0 && m== 0 ){
            done = false;
            $(".second").css("opacity", 0);
            setTimeout(function(){
                done = true;
                $(".second").css("opacity", 1);
            }, 2900);
            setTimeout(function(){
                $(".clock").removeClass("shiftLeft");
            }, 500);   //maybe tweak a bit
        }
    }
}

function startTime() {
    var today = new Date();
    var mt = today.getMonth(),
    d = today.getDate(),
    h = checkTime(today.getHours()),
    m = checkTime(today.getMinutes()),
    s = checkTime(today.getSeconds());

    if(s == 0) updateTimeDisplay(today.getHours(), today.getMinutes());

    if(done){
        $(".hour").html(h)
        $(".minute").html(":" + m)
        $(".second").html(":" + s)
        $(".date").html(d)
        $(".month").html(monthToStr(mt))

        $(".side-time").html(h + ":" + m)
        $(".side-date").html(d)
        $(".side-month").html(monthNames[mt])

        var t = setTimeout(startTime, 500);
    } else {
        $(".hour").html(checkTime(Math.floor((parseInt($('.time').css('transform').split(',')[4])) / $(".header").width() * (24))))
        $(".minute").html(
            ":" + checkTime(
                Math.floor(
                    (
                        (
                            parseInt($('.time').css('transform').split(',')[4]) / $(".header").width()
                        ) * (24) - 
                        
                        Math.floor(
                            (
                                parseInt($('.time').css('transform').split(',')[4]) / $(".header").width()
                            ) * (24)
                        )
                    ) * 60
                )
            )
        );
        $(".second").html(":" + s)
        $(".month").html(monthToStr(mt))
        $(".date").html(d)

        $(".side-time").html(h + ":" + m)
        $(".side-date").html(d)
        $(".side-month").html(monthNames[mt])
        
        if($(".header").width() - parseInt($('.time').css('transform').split(',')[4]) < 65 && clockoverflow){
            $(".clock").addClass("shiftLeft");
            clockoverflow = false;
        }

        var t = setTimeout(startTime, 10);
    }
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

function startDarkCheck(){
    chrome.runtime.sendMessage({action: "update_dark"}, function(response) {
		updateDarkMode();
    });
    var t = setTimeout(startDarkCheck, 30000)
}

function monthToStr(mt){
    switch(mt +1){
        case 1: return "JAN";
        case 2: return "FEB";
        case 3: return "MAR";
        case 4: return "APR";
        case 5: return "MAY";
        case 6: return "JUN";
        case 7: return "JUL";
        case 8: return "AUG";
        case 9: return "SEP";
        case 10: return "OCT";
        case 11: return "NOV";
        case 12: return "DEC";
    }
}

function nth_occurrence (string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;

    if (nth == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;  
        }
    }
}

function searchExit(query, save){
    url = enginePrefix(query);
    if(save){
        chrome.storage.local.get("startpage_autocomplete", function(a){
            let auto = a.startpage_autocomplete;
            let sugs = auto.suggestions;

            try{
                sugs.filter(sug => {
                    return (sug.query.toUpperCase() == query.toUpperCase() && sug.engine == engines[engine_index].name);
                })[0].p++;
                sugs.filter(sug => {
                    return (sug.query.toUpperCase() == query.toUpperCase() && sug.engine == engines[engine_index].name);
                })[0].time = new Date().getTime();
            } catch(e){
                sugs.push(
                    {
                        engine: engines[engine_index].name,
                        query: query,
                        p: 1,
                        time: new Date().getTime()
                    }
                )
            }
            
            sugs.sort(function (a, b) {
                return b.p - a.p;
            });

            auto.suggestions = sugs;

            chrome.storage.local.set({startpage_autocomplete:auto})
        })
    }
    $("#white").addClass("search-exit-fade");
    setTimeout(function(){
        window.location = url;
    }, 70)
}

function leave(h, url){
    exitPage = true;
    $("#big-" + h).addClass("preview-active-exit");
    $("#big-" + h + " .small-bar").addClass("small-bar-active-exit");
    
    $(".content").addClass("fade-out");
    $(".header").addClass("fade-out");
    $(".slider").addClass("display");

    setTimeout(function(){
        $(".triangle-colored").css("border-bottom-color", mains[h].cover)
        $(".triangle-colored").addClass("triangle-colored-exit");
        $(".triangle-white").addClass("triangle-white-exit");
        setTimeout(function(){
            
            if(url != undefined){
                chrome.runtime.sendMessage({navigate: url, newTab:false})       
            } else {
                chrome.runtime.sendMessage({navigate: mains[h].url, newTab:false})
            }
        }, 400)
    }, 350)

}

function hoverIn(i){
    hovered = i;

    $(".main-" + i + " .cover-container .cover").addClass("cover-active")
    $(".main-" + i + " .outer").addClass("outer-active")
    $(".main-" + i + " .inner").addClass("inner-active")

    $("#big-" + i).addClass("preview-active")
    $("#big-" + i + " .small-bar").addClass("small-bar-active");
    
    $("#text-" + i + " .text-site").addClass("text-site-active");
    $("#text-" + i + " .text-underline").addClass("text-underline-active");
    $("#text-" + i + " .text-site").addClass("text-opacity-active");
    $("#text-" + i + " .text-underline").addClass("text-opacity-active");
}

function hoverOut(i){
    if(!dropdown_hovered){
        hovered = -1
    }
    
    $(".main-" + i + " .cover-container .cover").removeClass("cover-active")
    $(".main-" + i + " .outer").removeClass("outer-active")
    $(".main-" + i + " .inner").removeClass("inner-active")

    $("#big-" + i).removeClass("preview-active")
    $("#big-" + i + " .small-bar").removeClass("small-bar-active");
    
    $("#text-" + i + " .text-site").removeClass("text-site-active");
    $("#text-" + i + " .text-underline").removeClass("text-underline-active");
    $("#text-" + i + " .text-site").removeClass("text-opacity-active");
    $("#text-" + i + " .text-underline").removeClass("text-opacity-active");

}

function startFocusOut(){
    $(document).on("click",function(){
        $(".dropdown").hide(); 
        $(document).off("click");
    });
} 

function manageHovered(){
    h = hovered;
    hovered = -1;
    $(".dropdown").hide();
    setTimeout(function(){
        if(hovered != h){
            hoverOut(h);
        }
        dropdown_hovered = false;
    }, 5)
}

function enginePrefix(query){
    if(engines[engine_index].url.replace(/\s/g, '') != ""){
        return engines[engine_index].url + query
    } else {
        return "www.google.com/search?q=" + query
    }
}

function searchSelect(j){
    for(let i = 0; i < $(".suggestions ul li").length; i++){
        i == j ? $(".suggestions ul li").eq(i).addClass("highlighted") : $(".suggestions ul li").eq(i).removeClass("highlighted")
    }
    $("#input").val($(".highlighted").text());
}

function updateDarkMode(){
    chrome.storage.local.get('startpage_settings', function(e){
        darkmode = e.startpage_settings.darkmode;
        $(".dark-mode input").prop("checked", e.startpage_settings.darkmode);
        
        if(darkmode){
            $("body").addClass("dark-light");
            $("#input").addClass("dark-light");
            $(".clock span").addClass("white-font");
            $(".text-underline").addClass("white-background");
            $(".white").addClass("dark-light");
            $(".triangle-white").css("border-bottom-color", "rgb(45, 45, 45)");
        } else {
            $("body").removeClass("dark-light");
            $("#input").removeClass("dark-light");
            $(".clock span").removeClass("white-font");
            $(".text-underline").removeClass("white-background");
            $(".white").removeClass("dark-light");
            $(".triangle-white").css("border-bottom-color", "white");
        }
    });
}

function loadMainImage(i){
    chrome.storage.local.get("startpage_settings", function(e){
        mains = e.startpage_settings.mains
        if(i < 5){
            main = mains[i];
            let src = ""
            if(main.img.indexOf("file:///") == 0 || main.img.indexOf("http://") == 0 || main.img.indexOf("https://") == 0){
                src = main.img;
            } else {
                src = "/startpage/img/main/" + main.img
            }

            if(src.replace(/\s/g, '') != "" && src.split(".").length > 1){
                $.get(src)
                .done(function() { 
            
                    $(".img-" + i).attr("src", src);
                    $("#big-" + i).find("img").attr("src", src);
                    loadMainImage(i+1)

                }).fail(function() { 
            
                    $(".img-" + i).remove();
                    $("#big-" + i).find("img").remove();
        
                    loadMainImage(i+1)
                })
            } else {
                $(".img-" + i).remove();
                $("#big-" + i).find("img").remove();

                loadMainImage(i+1)
            }
        }
    })
}

function loadSidebar(i){
    let src = ""
    chrome.storage.local.get("startpage_settings", function(e){
        if(i < e.startpage_settings.sidebar_websites.length){
            let website = e.startpage_settings.sidebar_websites[i];
            if(website.img.indexOf("file:///") == 0 || website.img.indexOf("http://") == 0 || website.img.indexOf("https://") == 0){
                src = website.img;
            } else {
                src = "/startpage/img/sidebar/" + website.img
            }
                    
            if(src.replace(/\s/g, '') != "" && src.split(".").length > 1){
                $.get(src)
                .done(function() { 
                    var li = document.createElement("li")
        
                        var img = document.createElement("img");
                        img.src = src;
                        
                        li.append(img)
        
                        var p = document.createElement("p")
                        p.innerText = website.name
                        li.append(p);
            
                    $(".more-websites-list").append(li);
        
                    loadSidebar(i+1)
                }).fail(function() { 
                    var li = document.createElement("li")
    
                        var big = document.createElement("span")
                        big.innerText = website.name[0].toUpperCase();
    
                        li.append(big)
        
                        var p = document.createElement("p")
                        p.innerText = website.name
                        li.append(p);
            
                    $(".more-websites-list").append(li);
        
                    loadSidebar(i+1)
                })
            } else {
                var li = document.createElement("li")
    
                var big = document.createElement("span")
                big.innerText = website.name[0].toUpperCase();

                li.append(big)

                var p = document.createElement("p")
                p.innerText = website.name
                li.append(p);
    
                $(".more-websites-list").append(li);

                loadSidebar(i+1)
            }
        } else {
            $.each($(".more-websites-list li"), function(index, element){
                $(".more-websites-list li").eq(index).on("click", function(){
                    name = $(this).find("p").text()
                    chrome.storage.local.get("startpage_settings", function(e){
                        if(e.startpage_settings.sidebar_websites.filter(website => website.name == name)[0].url.replace(/\s/g, '') != ""){
                            chrome.runtime.sendMessage({
                                navigate: e.startpage_settings.sidebar_websites.filter(website => website.name == name)[0].url,
                                newTab: "false"
                            });
                        }
                    });
                })
            })
        }
    })
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                        costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
        }
        }
        if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function getScoredDisplay(array, local, val){

    let display = [];

    // table = []
    // table.push(["response", "query", "match", "query", "pop", "last", "score"])

    array.forEach(response => {

        let score = 0;

        local.forEach(query => {

            querysim = Math.pow(similarity(response, query.query), 2) * 10 > 1 ? Math.pow(similarity(response, query.query), 2) * 10 : 0;

            popbias = query.p * 0.1;

            lastbias = (query.query == last ? 0.1 : 0);

            score += querysim + popbias + lastbias;

            // text = "";
            // for(let i = 0; i < (querysim + popbias + lastbias) * 10; i++){
            //     text += "|"
            // }

            // table.push([response, query.query, text, querysim, popbias, lastbias, score])

        });

        inputsim = Math.pow(similarity(val, response), 2) * 10;

        score += inputsim;
        
        // table.push([response, "-", "-", "-", "-", "-", inputsim, score])

        display.push({query: response, score: score})

    })

    display.sort(function (a, b) {
        if(a.score > b.score){
            return -1
        } else if (a.score < b.score){
            return 1;
        }
        return 0;
    });

    // console.table(table);

    // console.table(display);

    return display;
}

function boldString(str, find){

    var re = new RegExp(find, 'gi');
    str = str.replace(re, '<b>' + find + '</b>') // MeH

    return str;
}

function tabThroughSuggestions(i){
    
    let s_length = $(".suggestions ul li").length;

    if(s_length > 0){

        if($(".highlighted").length == 0){
            lastHumanInput = $("#input").val();
        }
    
        if(i > 0){
    
            s_index++;
            if(s_index > s_length) s_index = 0;
    
            if(s_index == s_length){
                searchSelect(-1);
                $("#input").val(lastHumanInput);
            } else {
                searchSelect(s_index);
            }
    
        } else if(i < 0){
    
            s_index--;
            if(s_index < 0) s_index = s_length;
    
            if(s_index == s_length){
                searchSelect(-1);
                $("#input").val(lastHumanInput);
            } else {
                searchSelect(s_index);
            }
    
        }
    }
}

function tabThroughEngines(i){
    chrome.storage.local.get("startpage_settings", function(s){
        engines = s.startpage_settings.search_engines;
        last_index = engine_index;
        s_index = -1;

        if(i > 0){

            engine_index++;
            if(engine_index >= engines.length) engine_index = 0;

        } else if(i < 0){

            engine_index--
            if(engine_index < 0) engine_index = engines.length - 1;

        }
        
        $("#input").attr("placeholder", "Search " + engines[engine_index].name)
        $("#input").css("border-color", engines[engine_index].color)
        $(".suggestions").css("border-color", engines[engine_index].color)
    })
}

chrome.storage.local.get('startpage_settings', function(e){
    engines = e.startpage_settings.search_engines;
    mains = e.startpage_settings.mains

startDarkCheck();

loadMainImage(0)

$(function() {

    chrome.storage.local.get('startpage_settings', function(e){
        showWeather = e.startpage_settings.weather;
        if(!e.startpage_settings.sidebar){
            $(".sidebar").hide();
        } else {
            loadSidebar(0);
        }
    
        getWeather();
    });

    
    $("#input").addClass("notrans");
    setTimeout(function(){
        $("#input").removeClass("notrans");
    }, 100);

    startTime();

    setTimeout(function(){
		$("body").addClass("smooth-bg")
	}, 1000)

    // ---------------------------------------------------- SEARCH BAR -------------------------------------------------------------------

    $("#input").val("")

    $("input").attr("placeholder", "Search " + engines[0].name)
    $("#input").css("border-color", engines[0].color)

    // typing

    $("#input").keydown(function(e) {

        let val = $(this).val();

        switch(e.keyCode){
            case 9: // TAB

                if(e.shiftKey){
                    // if($("#input").val() != "") tabThroughSuggestions(1);
                    
                    tabThroughEngines(-1);
                } else {
                    tabThroughEngines(1);
                }
                break;

            case 38: // UP
                e.preventDefault();
                tabThroughSuggestions(-1);
                break;

            case 40: // DOWN
                e.preventDefault();
                tabThroughSuggestions(1);
                break;

            case 39: // RIGHT
                // if($(".highlighted").length == 1){
                //     lastHumanInput = display[Number.parseInt($(".highlighted").attr("id").slice(8, 11))].query
                // }
                break;
                
            case 13: // ENTER

                chrome.storage.local.get("startpage_autocomplete", function(e){

                    console.log(display, $(".highlighted"))

                    searchExit(
                        ($(".highlighted").length == 0) ? val : display[Number.parseInt($(".highlighted").attr("id").slice(8, 11))].query,
                        !e.shiftKey && e.startpage_autocomplete.enabled
                    );
                      
                });

                break;

            case 27: // ESC

                $("#input").blur();

                break;

            default:

                if($(".highlighted").length != 0){
                    old = $(".highlighted").eq(0).html();
                    setTimeout(function(){
                        $.each($(".suggestions ul li"), function(index, element) {
                            if($(".suggestions ul li").eq(index).html() == old){
                                $(".suggestions ul li").eq(index).addClass("highlighted")
                            } else {
                                $(".suggestions ul li").eq(index).removeClass("highlighted")
                            }
                        });
                    }, 10);
                }
                
                break;
        }

        // autocomplete

        if(![27, 13, 16, 17, 18, 20, 38, 40, 37, 39].includes(e.keyCode) && !(e.shiftKey && e.keyCode == 9)){
            chrome.storage.local.get("startpage_autocomplete", function(e){
                local_queries = e.startpage_autocomplete.suggestions;
                last = e.startpage_autocomplete.last;
                autocomplete = e.startpage_autocomplete.enabled;
                
                if(autocomplete){
                    val = $("#input").val()[$("#input").val().length - 1] == " " ? $("#input").val().slice(0, $("#input").val().length - 1) : $("#input").val()
                    chrome.storage.local.get("startpage_settings", function(s){
                        engines = s.startpage_settings.search_engines;
                        
                        if(val.replace(/\s/g, '') != ""){

                            if(engines[engine_index].name.toUpperCase() == "GOOGLE"){

                                    $(".input").addClass("input-typing")

                                    $.get("http://suggestqueries.google.com/complete/search?client=firefox&q=" + val, function(google) {

                                        google = JSON.parse(google)[1]
                                        local = local_queries.filter(query => query.engine.toUpperCase() == engines[engine_index].name.toUpperCase())

                                        display = getScoredDisplay(google, local, val)
                                        html = ""

                                        if(display.length != 0){
                                            
                                            display.forEach(d => {
                                                html += "<li id='display-" + display.indexOf(d) + "'>" + d.query.replace("<", "").replace(">", "") + "</li>"
                                            });

                                            $(".suggestions ul").html(boldString(html, val.replace("<", "").replace(">", "")))

                                        }

                                        $(".suggestions").css("display", "block")

                                    });

                                
            
                            } else if (engines[engine_index].name.toUpperCase() == "YOUTUBE"){

                                    $(".input").addClass("input-typing")
            
                                    $.get("http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&client=firefox&q=" + val, function(youtube) {

                                        youtube = JSON.parse(youtube)[1]
                                        local = local_queries.filter(query => query.engine.toUpperCase() == engines[engine_index].name.toUpperCase())
                                    
                                        display = getScoredDisplay(youtube, local, val)
                                        html = ""

                                        if(display.length != 0){
                                            
                                            display.forEach(d => {
                                                html += "<li id='display-" + display.indexOf(d) + "'>" + d.query.replace("<", "").replace(">", "") + "</li>"
                                            });

                                            $(".suggestions ul").html(boldString(html, val.replace("<", "").replace(">", "")))

                                        }

                                        $(".suggestions").css("display", "block")

                                    });

                            } else {

                                $(".input").addClass("input-typing")

                                $.get("http://suggestqueries.google.com/complete/search?client=firefox&q=" + engines[engine_index].name + " " + val, function(general) {

                                    general = JSON.parse(general)[1]
                                    local = local_queries.filter(query => query.engine.toUpperCase() == engines[engine_index].name.toUpperCase())

                                    for(let i = 0; i < general.length; i++){
                                        if(general[i].toUpperCase().search((engines[engine_index].name + " ").toUpperCase()) == 0){
                                            general[i] = general[i].slice((engines[engine_index].name + " ").length, general[i].length)
                                        }
                                    }

                                    display = getScoredDisplay(general, local, val)
                                    html = ""

                                    if(display.length != 0){
                                            
                                        display.forEach(d => {
                                            html += "<li id='display-" + display.indexOf(d) + "'>" + d.query.replace("<", "").replace(">", "") + "</li>"
                                        });

                                        $(".suggestions ul").html(boldString(html, val.replace("<", "").replace(">", "")))

                                    }

                                    $(".suggestions").css("display", "block")

                                });

                            }

                        } else {

                            $(".suggestions ul").html("")
                            $(".suggestions").css("display", "none")
                            $(".input").removeClass("input-typing")

                        }
                    });
                }
            });
        }

        if(keyDodge || [9, 13].includes(e.KeyCode)){
            keyDodge = true;
            e.preventDefault();
        }
        return;
    });

    $(document).keydown(function(e) {
        if(![27, 16].includes(e.keyCode)){
            $("#input").focus();
            if(e.keyCode == 9) e.preventDefault();
        }
    });

    $(document).on("focusout", "#input", function(ev){
        if(!suggestionsHovered) $(".suggestions").css("display", "none")
        $(".input").removeClass("input-typing")
    })

    $(".suggestions").hover(function(){
        suggestionsHovered = true;
    }, function(){
        suggestionsHovered = false;
    })

    $(document).on("click", "#input", function(ev){
        if($("#input").val().length > 0){
            $(".suggestions").css("display", "block")
            $(".input").addClass("input-typing")
        }
    })

    $("#input").keyup(function(e) {
        if(keyDodge){
            e.preventDefault();
        }
        keyDodge = false;

    });

    $(document).on("click", ".suggestions ul li", function(ev){
        
        console.log(display, $(".highlighted"))

        let val = display[Number.parseInt($(this).attr("id").slice(8, 11))].query

        chrome.storage.local.get("startpage_autocomplete", function(e){

            searchExit(val, !e.shiftKey && e.startpage_autocomplete.enabled);
              
        });
    })

    // ---------------------------------------------------- ANIMATIONS -------------------------------------------------------------------

    setTimeout(function(){
        $(".bar_ini").addClass("bar");
        $(".bar_ini").removeClass("bar_ini");
        $(".top_left_icon").removeClass("opacity-0");
        setTimeout(function(){
            updateWeatherDisplay();
        }, 500);
        setTimeout(function(){
            progress = ((new Date().getHours() * 3600) + (new Date().getMinutes()) * 60 + (new Date().getSeconds())) / (24 * 36);
            $(".time").css("transform", "translateX(" + progress + "%)")
            $(".clock .hour").css("opacity", 1);
            $(".clock .minute").css("opacity", 1);
            if($(".header").width() * (100- progress) / 100 > 75){
                $(".clock").css("transform", "translateX(" + progress + "%)");
                $(".clock").removeClass("shiftLeft");
            } else {
                $(".clock").css("transform", "translateX(100%)");
            }
            setTimeout(function(){
                done = true;
                $(".second").css("opacity", 1);
            }, 2900);
        }, 800);
    }, 150);

    setTimeout(startWeather, 600000)

    // load


    for(let i = 0; i < 5; i++){
        if(mains[i].advanced){

            $(".main-" + i + " .outer").css("border-color", mains[i].cover)
            $(".main-" + i + " .outer").css("background-color", mains[i].cover)
            $(".main-" + i + " .inner").css("border-color", mains[i].cover)
            $(".main-" + i + " .cover").css("background-color", mains[i].cover)
            $("#big-" + i + " .small-bar").css("background-color", mains[i].cover)

            $(".main-" + i + " .outer").css("border-color", mains[i].outer)
            $(".main-" + i + " .outer").css("background-color", mains[i].fill)
            $(".main-" + i + " .inner").css("border-color", mains[i].inner)
            $(".main-" + i + " .cover").css("background-color", mains[i].cover)
            $("#big-" + i + " .small-bar").css("background-color", mains[i].bar)
        } else {
            cover = mains[i].cover
            $(".main-" + i + " .outer").css("border-color", cover)
            $(".main-" + i + " .inner").css("border-color", cover)
            $(".main-" + i + " .cover").css("background-color", cover)
            $("#big-" + i + " .small-bar").css("background-color", cover)
            
            if(cover.replace(/\s/g, '') != ""){
                if(cover.indexOf(",") != -1){
                    if(cover.match(new RegExp(",", "g")).length == 3){
                        $(".main-" + i + " .outer").css("background-color", cover.slice(0, nth_occurrence(cover, ",", 3)) + ", 0.15)")
                    } else if(cover.match(new RegExp(",", "g")).length == 2){
                        $(".main-" + i + " .outer").css("background-color", cover.slice(0, cover.length-1) + ", 0.15)")
                    }
                } else {
                    if(cover.indexOf("#") == 0){
                        if(cover.length == 7){
                            $(".main-" + i + " .outer").css("background-color", cover + "26")
                        }
                    }
                }
            }

            
        }

        $(".main-" + i).bind("contextmenu", function(e){
            e.preventDefault();

            if(hovered != -1){
                $(".dropdown .dropdown-list").html("");
    
                mains[i].context.forEach(e => {
                    li = document.createElement("li");
                    li.innerText = e.name
                    $(".dropdown .dropdown-list").append(li)
                });
    
                $(".dropdown").css("left", e.pageX - 3);
                $(".dropdown").css("top" , e.pageY - 3);
                $(".dropdown").show(50);
                startFocusOut();
            }
        })

        

        $(".img-" + i).hover(function(){
            if(!exitPage) hoverIn(i)
        }, function(){
            setTimeout(function(){
                if(!exitPage && !dropdown_hovered) hoverOut(i)
            }, 10)
        });

        $(".main-" + i + " img").on("click", function(){
            leave(i);
        })

        $("#text-" + i + " .text-site").text(mains[i].name)

    }


    $(".top_right_icon").click(function(){searchExit("https://calendar.google.com/calendar/r")});

    $(".sidebar").hover(function(){$(".top_right_icon").addClass("opacity-0")}, function(){$(".top_right_icon").removeClass("opacity-0")});
    
    $(".settings p").click(function(){searchExit("https://github.com/Usernameeeeeeeee/startpage")})

    // dropdown

    $(document).on("click", ".dropdown .dropdown-list li", function(ev){
        ev.preventDefault();
        name = $(this).text();
        leave(hovered, mains[hovered].context.filter(item => item.name == name)[0].url)
    })

    $(document).bind("contextmenu",function(e){
        e.preventDefault();   
    });
    
    $(".dropdown").hover(function(){
        dropdown_hovered = true;
    },function(){
        manageHovered();
    }); 

	$(".dark-mode input").click(function(){
		darkmode = !darkmode;
        chrome.storage.local.get("startpage_settings", function(e){
            let startpage_settings = e.startpage_settings;
            startpage_settings.darkmode = darkmode;
            chrome.storage.local.set({startpage_settings:startpage_settings})
            updateDarkMode();
        });
        chrome.storage.local.get("startpage_selected_profile", function(a){
            let startpage_selected_profile = a.startpage_selected_profile;
            if(startpage_selected_profile != ""){
                chrome.storage.local.get("startpage_profiles", function(pr){
                    let startpage_profiles = pr.startpage_profiles;
                    startpage_profiles.filter(profile => profile.name == startpage_selected_profile)[0].settings.darkmode = darkmode;
                    
                    chrome.storage.local.set({startpage_profiles:startpage_profiles})
                });
            }
        });
    });

    $("#settings").click(function(){
        chrome.runtime.sendMessage({navigate:"/settings/settings.html", newTab: "true"});
    })
});


});