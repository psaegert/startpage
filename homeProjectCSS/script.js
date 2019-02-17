
var weather = {}, hovered = "", dropdown_hovered = false, clockoverflow = true;;

$( document ).ready(function() {

    function getWeather(lat, lon) {
        $.ajax({
            url: "https://api.darksky.net/forecast//" + lat + "," + lon,
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

    var timer = 0;
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

    function searchExit(url){
        $("#white").addClass("search-exit-fade");
        setTimeout(function(){
            window.location = url;
        }, 70)
    }

    function clicked(str, sub){
        exit = true;
        $(str + "-b").addClass("preview-active-exit");
        $(str + "-b .small-bar").addClass("small-bar-active-exit");
        $(".content").addClass("fade-out");
        $(".header").addClass("fade-out");
        $(".slider").addClass("display");
        setTimeout(function(){
            $(".triangle-colored").addClass(str.slice(1, str.length) + "-triangle-colored-exit");
            $(".triangle-white").addClass("triangle-white-exit");
            setTimeout(function(){
                switch(str){
                    case "#yt":
                        switch(sub){
                            case "subscriptions": url = "https://www.youtube.com/feed/subscriptions"; break;
                            case "ttt": url = "https://www.youtube.com/results?search_query=ttt+pietsmiet&sp=CAISBBABGAI%253D"; break;
                            case "hdsoundi": url = "https://www.youtube.com/user/MarK1Ira/videos"; break;
                            default: url = "https://www.youtube.com/"; break;
                        } 
                    break;

                    case "#sc":
                        switch(sub){
                            case "likes": url = "https://soundcloud.com/you/likes"; break;
                            case "history": url = "https://soundcloud.com/you/history"; break;
                            default: url = "https://soundcloud.com/discover/"; break;
                        } 
                    break;

                    case "#tv":
                        switch(sub){
                            case "2200": url = "https://www.tvspielfilm.de/tv-programm/sendungen/fernsehprogramm-nachts.html"; break;
                            case "tomorrow": 
                                now = new Date();
                                url = "https://www.tvspielfilm.de/tv-programm/sendungen/?page=1&order=time&date=" + now.getFullYear() + "-" + checkTime(now.getMonth() + 1) + "-" + checkTime(now.getDate() + 1) + "&cat%5B%5D=SP&cat%5B%5D=SE&cat%5B%5D=RE&cat%5B%5D=U&cat%5B%5D=KIN&cat%5B%5D=SPO&time=prime&channel=";
                            break;
                            case "friday":
                                now = new Date();
                                now.setDate(now.getDate() + (5+(7-now.getDay())) % 7);
                                url = "https://www.tvspielfilm.de/tv-programm/sendungen/?page=1&order=time&date=" + now.getFullYear() + "-" + checkTime(now.getMonth() + 1) + "-" + checkTime(now.getDate()) + "&cat%5B%5D=SP&cat%5B%5D=SE&cat%5B%5D=RE&cat%5B%5D=U&cat%5B%5D=KIN&cat%5B%5D=SPO&time=prime&channel=";
                            break;
                            default: url = "https://www.tvspielfilm.de/tv-programm/sendungen/abends.html"; break;
                        } 
                    break;

                    case "#tw":
                        switch(sub){
                            case "nightblue3": url = "https://www.twitch.tv/nightblue3"; break;
                            case "nasa": url = "https://www.twitch.tv/nasa"; break;
                            case "shroud": url = "https://www.twitch.tv/shroud"; break;
                            default: url = "https://www.twitch.tv/directory"; break;
                        } 
                    break;

                    case "#g":
                        switch(sub){
                            case "subscriptions": url = "https://www.reddit.com/user/Valkyrie_Cain_"; break;
                            case "ttt": url = "https://www.reddit.com/r/all"; break;
                            default: url = "https://www.reddit.com/"; break;
                        } 
                    break;
                }
                window.location = url;
            }, 600)
        }, 350)
    }

    function hoverIn(str){
        hovered = str
        $(str + "-b").addClass("preview-active");
        $(str + "-b .small-bar").addClass("small-bar-active");
        $(str + " .container-color-cover .cover").addClass("cover-active");
        $(str + " .container-color-cover").addClass("container-color-cover-active");
        $(str + " .image-container img").addClass("preview-small-img-active");
        $(str + " .container-color .outer-rect").addClass("outer-rect-active");
        $(str + " .container-white .inner-rect").addClass("inner-rect-active");
        $(str + "-text .text-site").addClass("text-site-active");
        $(str + "-text .text-underline").addClass("text-underline-active");
        $(str + "-text .text-site").addClass("text-site-active");
        $(str + "-text .text-underline").addClass("text-underline-active");
        $(str + "-text .text-site").addClass("text-opacity-active");
        $(str + "-text .text-underline").addClass("text-opacity-active");
    }

    function hoverOut(str){
        if(!dropdown_hovered){
            hovered = ""
        }
        $(str + "-b").removeClass("preview-active");
        $(str + "-b .small-bar").removeClass("small-bar-active");
        $(str + " .container-color-cover .cover").removeClass("cover-active");
        $(str + " .container-color-cover").removeClass("container-color-cover-active");
        $(str + " .image-container img").removeClass("preview-small-img-active");
        $(str + " .container-color .outer-rect").removeClass("outer-rect-active");
        $(str + " .container-white .inner-rect").removeClass("inner-rect-active");
        $(str + "-text .text-site").removeClass("text-site-active");
        $(str + "-text .text-underline").removeClass("text-underline-active");
        $(str + "-text .text-site").removeClass("text-opacity-active");
        $(str + "-text .text-underline").removeClass("text-opacity-active");

    }

    function updateWeatherDisplay(){
        if(!(weather.descr === undefined || weather.temp === undefined)){
            $(".weather-description").html(weather.descr);
            $(".weather-degrees").html(weather.temp + " C");
            $(".weather-container").css("opacity", 1);
        } else {
            $(".weather-container").css("opacity", 0);
            $(".weather-description").html("asdf");
            $(".weather-degrees").html("asdf");
        }
    }

    function startFocusOut(preview){
        $(document).on("click",function(){
            $("#" + preview + " .dropdown").hide();        
            $(document).off("click");
        });
    } 

    function manageHovered(){
        h = hovered;
        hovered = "";
        $(h + " .dropdown").hide();
        setTimeout(function(){
            if(hovered != h){
                hoverOut(h);
            }
            dropdown_hovered = false;
        }, 5)
    }

    function enginePrefix(query){
        switch(engine_index){
            case 0:
                query = "https://www.google.de/search?client=opera&q=" + query;
                break;
            case 1:
                query = "https://www.youtube.com/results?search_query=" + query;
                break;
            case 2:
                query = "https://soundcloud.com/search?q="  + query;
                break;
        }
        return query;
    }

    function searchSelect(selected_index){
        $.each($(".suggestions ul li"), function(index, element) {
            if(index == selected_index){
                $(".suggestions ul li").eq(index).addClass("highlighted")
                // console.log($(".suggestions ul li").eq(index).html(), $(".suggestions ul li").eq(index))
            } else {
                $(".suggestions ul li").eq(index).removeClass("highlighted")
            }
        });
    }
    

    // initialize..

    $("#input").val("")
    var exit = false, engine_index = 0, engines = ["Google", "Youtube", "Soundcloud"], s_index = -1;
    var keyDodge = false;
    var progress = 0;
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    // search bar enter and tab

    $("#input").keydown(function(e) {
        switch(e.keyCode){
            case 9:
                keyDodge = true;

                if(e.shiftKey){
                    if($("#input").val() != ""){
                        // tab through suggestions
                        let s_length = $(".suggestions ul li").length;
                        s_index++;
                        console.log(s_index, s_length)
                        if(s_index >= s_length) s_index = 0;
                        if(s_length > 0){
                            if($(".suggestions ul li").eq(s_index).position().top != 0) s_index = 0;
                            setTimeout(function(){
                                searchSelect(s_index);
                            }, 10)
                        }
                    }
                } else {
                    last_index = engine_index;
                    s_index = -1;
    
                    engine_index++;
                    if(engine_index >= engines.length) engine_index = 0;
    
                    $(this).attr("placeholder", "Search " + engines[engine_index])
                    $(this).removeClass("border-" + engines[last_index]); 
                    $(this).addClass("border-" + engines[engine_index]);
                }
                break;
                
            case 13:
                keyDodge = true;
                if($(".highlighted").length == 0){
                    searchExit(enginePrefix($(this).val()));
                } else if($(".highlighted").length == 1){
                    searchExit(enginePrefix($(".highlighted").eq(0).html()));
                }
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
        
        if(keyDodge){
            e.preventDefault();
        }
        return;
    });

	$('.suggestions ul li').click(function(e){
        $("#input").val($(this).html());
        searchExit(enginePrefix($(this).html()))
    })

    $(document).keydown(function(e) {
        $("#input").focus();
        if(e.keyCode == 9){
            e.preventDefault();
        }
    });

    $("#input").keyup(function(e) {
        if(keyDodge){
            e.preventDefault();
        }
        keyDodge = false;
        $('.suggestions ul li').click(function(e){
            $("#input").val($(this).html());
            searchExit(enginePrefix($(this).html()))
        })
        return;
    });

    var done = false;
    startTime();
    getWeather(49.4431922, 8.6644594);


    // begin animations

    setTimeout(function(){
        $(".bar_ini").addClass("bar");
        $(".bar_ini").removeClass("bar_ini");
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


    // click handlers

    $("#yt img").click(function(){clicked("#yt")});
    $("#sc img").click(function(){clicked("#sc")});
    $("#tv img").click(function(){clicked("#tv")});
    $("#tw img").click(function(){clicked("#tw")});
    $("#g img").click(function(){clicked("#g")});

    $("#yts").click(function(){clicked("#yt", "subscriptions")});
    $("#ttt").click(function(){clicked("#yt", "ttt")});
    $("#hds").click(function(){clicked("#yt", "hdsoundi")});

    $("#scl").click(function(){clicked("#sc", "likes")});
    $("#sch").click(function(){clicked("#sc", "history")});

    $("#tv22").click(function(){clicked("#tv", "2200")});
    $("#tvt").click(function(){clicked("#tv", "tomorrow")});
    $("#tvf").click(function(){clicked("#tv", "friday")});

    $("#nb3").click(function(){clicked("#tw", "nightblue3")});
    $("#nasa").click(function(){clicked("#tw", "nasa")});
    $("#shr").click(function(){clicked("#tw", "shroud")});

    $("#prf").click(function(){clicked("#g", "profile")});
    $("#rall").click(function(){clicked("#g", "all")});

    $(".top_right_icon").click(function(){searchExit("https://calendar.google.com/calendar/r")});
    $("#side-github").click(function(){searchExit("https://github.com/")});
    $("#side-desmos").click(function(){searchExit("https://www.desmos.com/calculator/")});
    $("#side-translate").click(function(){searchExit("https://translate.google.com/")});

    $("#yt img").hover(function(){if(!exit)hoverIn("#yt")}, function(){setTimeout(function(){if(!exit && !dropdown_hovered)hoverOut("#yt")}, 10)});
    $("#sc img").hover(function(){if(!exit)hoverIn("#sc")}, function(){setTimeout(function(){if(!exit && !dropdown_hovered)hoverOut("#sc")}, 10)});
    $("#tv img").hover(function(){if(!exit)hoverIn("#tv")}, function(){setTimeout(function(){if(!exit && !dropdown_hovered)hoverOut("#tv")}, 10)});
    $("#tw img").hover(function(){if(!exit)hoverIn("#tw")}, function(){setTimeout(function(){if(!exit && !dropdown_hovered)hoverOut("#tw")}, 10)});
    $("#g img").hover(function(){if(!exit)hoverIn("#g")}, function(){setTimeout(function(){if(!exit && !dropdown_hovered)hoverOut("#g")}, 10)});
    $(".sidebar").hover(function(){$(".top_right_icon").addClass("opacity-0")}, function(){$(".top_right_icon").removeClass("opacity-0")});

    //dropdown

    $(document).bind("contextmenu",function(e){
        e.preventDefault();
        switch(hovered){
            case "#yt":
                $("#yt .dropdown").css("left", e.pageX-1);
                $("#yt .dropdown").css("top" ,e.pageY-1);     
                $("#yt .dropdown").fadeIn(120,startFocusOut("yt")); 
                break;
            case "#sc":
                $("#sc .dropdown").css("left", e.pageX - 1);
                $("#sc .dropdown").css("top" ,e.pageY - 1);     
                $("#sc .dropdown").fadeIn(120,startFocusOut("sc")); 
                break;
            case "#tv":
                $("#tv .dropdown").css("left", e.pageX - 1);
                $("#tv .dropdown").css("top" ,e.pageY - 1);     
                $("#tv .dropdown").fadeIn(120,startFocusOut("tv")); 
                break;
            case "#tw":
                $("#tw .dropdown").css("left", e.pageX - 1);
                $("#tw .dropdown").css("top" ,e.pageY - 1);     
                $("#tw .dropdown").fadeIn(120,startFocusOut("tw")); 
                break;
            case "#g":
                if(e.pageX > $(".header").width() - $("#g .dropdown").width()){
                    $("#g .dropdown").css("left", e.pageX - $("#g .dropdown").width() + 1);
                } else {
                    $("#g .dropdown").css("left", e.pageX - 1);
                }
                $("#g .dropdown").css("top" ,e.pageY - 1);     
                $("#g .dropdown").fadeIn(120,startFocusOut("g")); 
                break;
            default:
                // $(".dropdown").css("left", e.pageX - 1);
                // $(".dropdown").css("top" ,e.pageY - 1);     
                // $(".dropdown").fadeIn(120,startFocusOut()); 
                break;
        }     
    });
    
    $(".dropdown").hover(function(){
        dropdown_hovered = true;
    },function(){
        manageHovered();
    }); 
    
    $(".dropdown .item-list > li").click(function(){
        //$("#op").text("You have selected "+$(this).text());
        }
    );

});
