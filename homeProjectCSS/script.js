$( document ).ready(function() {

    function startTime() {
        var today = new Date();
        var mt = today.getMonth();
        var d = today.getDate();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        if(done){
            $(".hour").html(h)
            $(".minute").html(":" + m)
            $(".second").html(":" + s)
            $(".date").html(d)
            $(".month").html(monthToStr(mt))
            var t = setTimeout(startTime, 500);
        } else {
            $(".hour").html(checkTime(Math.floor(($(".time").width() / $(document).width()) * (24))))
            $(".minute").html(":" + checkTime(Math.floor((($(".time").width() / $(document).width()) * (24) - Math.floor(($(".time").width() / $(document).width()) * (24))) * 60)));
            $(".second").html(":" + s)
            $(".month").html(monthToStr(mt))
            $(".date").html(d)
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

    var done = false;
    startTime();
    var progress = 0;

    setTimeout(function(){
        $(".bar_ini").addClass("bar");
        $(".bar_ini").removeClass("bar_ini");
        setTimeout(function(){
            progress = ((new Date().getHours() * 3600) + (new Date().getMinutes()) * 60 + (new Date().getSeconds())) / (24 * 3600) * $( document ).width();
            $(".time").css("width", progress + "px")
            $(".clock .hour").css("opacity", 1);
            $(".clock .minute").css("opacity", 1);
            if($(document).width() - progress > $(".clock").width()){
                $(".clock").css("left", progress + "px");
            } else {
                $(".clock").css("left", $(document).width() - $(".clock").width() - 10 + "px");
            }
            setTimeout(function(){
                done = true;
                $(".second").css("opacity", 1);
            }, 2000);
        }, 800);
    }, 150);

    var exit = false, engine_index = 0, engines = ["Google", "Youtube"];
    
    $(".red").click(function(){clicked("red")});
    $(".orange").click(function(){clicked("orange")});
    $(".blue").click(function(){clicked("blue")});
    $(".purple").click(function(){clicked("purple")});
    $(".orange2").click(function(){clicked("orange2")});

    $(".red").hover(function(){if(!exit)hoverIn("red")}, function(){if(!exit)hoverOut("red")});
    $(".orange").hover(function(){if(!exit)hoverIn("orange")}, function(){if(!exit)hoverOut("orange")});
    $(".blue").hover(function(){if(!exit)hoverIn("blue")}, function(){if(!exit)hoverOut("blue")});
    $(".purple").hover(function(){if(!exit)hoverIn("purple")}, function(){if(!exit)hoverOut("purple")});
    $(".orange2").hover(function(){if(!exit)hoverIn("orange2")}, function(){if(!exit)hoverOut("orange2")});


    var keyDodge = false;

    $("#input").keydown(function(e) {
        switch(e.keyCode){
            case 9: 
                keyDodge = true;
                last_index = engine_index;

                engine_index++;
                if(engine_index == engines.length){
                    engine_index = 0;
                }

                $(this).attr("placeholder", "Search " + engines[engine_index])
                $(this).removeClass("border-" + engines[last_index]); 
                $(this).addClass("border-" + engines[engine_index]);
                break;
                
            case 13:
                keyDodge = true;
                switch(engine_index){
                    case 0:
                        searchExit("https://www.google.de/search?client=opera&q=" + $(this).val() + "&sourceid=opera&ie=UTF-8&oe=UTF-8");
                        break;
                    case 1:
                        searchExit("https://www.youtube.com/results?search_query=" + $(this).val());
                        break;
                }
            break;
        }
        
        if(keyDodge){
            e.preventDefault();
        }
        return;
    });


    $("#input").keyup(function(e) {
        if(keyDodge){
            e.preventDefault();
        }
        keyDodge = false;
        return;
    });

    function searchExit(url){
        $("#white").addClass("search-exit-fade");
        setTimeout(function(){
            window.location = url;
        }, 50)
    }

    function clicked(color){
        exit = true;
        switch(color){
            case "red": str = "#yt";; break;
            case "orange": str = "#sc"; break;
            case "blue": str = "#tv"; break;
            case "purple": str = "#tw"; break;
            case "orange2": str = "#g"; break;
        }
        $(str + "-b").addClass("preview-active-exit");
        $(str + "-b .small-bar").addClass("small-bar-active-exit");
        $(".content").addClass("fade-out");
        $(".header").addClass("fade-out");
        $(".slider").addClass("display");
        setTimeout(function(){
            $(".triangle-colored").addClass(str.slice(1, str.length) + "-triangle-colored-exit");
            $(".triangle-white").addClass("triangle-white-exit");
            setTimeout(function(){
                switch(color){
                    case "red": url = "https://www.youtube.com/"; break;
                    case "orange": url = "https://soundcloud.com/discover"; break;
                    case "blue": url = "https://www.tvspielfilm.de/tv-programm/sendungen/abends.html"; break;
                    case "purple": url = "https://www.twitch.tv/directory"; break;
                    case "orange2": url = "https://www.reddit.com/"; break;
                }
                window.location = url;
            }, 600)
        }, 350)
    }

    function hoverIn(color){
        switch(color){
            case "red": str = "#yt"; break;
            case "orange": str = "#sc"; break;
            case "blue": str = "#tv"; break;
            case "purple": str = "#tw"; break;
            case "orange2": str = "#g"; break;
        }
        $(str + "-b").addClass("preview-active");
        $(str + "-b .small-bar").addClass("small-bar-active");
        $(str + " .container-color-cover .cover").addClass("cover-active");
        $(str + " .container-color .outer-rect").addClass("outer-rect-active");
        $(str + " .container-white .inner-rect").addClass("inner-rect-active");
    }

    function hoverOut(color){
        switch(color){
            case "red": str = "#yt"; break;
            case "orange": str = "#sc"; break;
            case "blue": str = "#tv"; break;
            case "purple": str = "#tw"; break;
            case "orange2": str = "#g"; break;
        }
        $(str + "-b").removeClass("preview-active");
        $(str + "-b .small-bar").removeClass("small-bar-active");
        $(str + " .container-color-cover .cover").removeClass("cover-active");
        $(str + " .container-color .outer-rect").removeClass("outer-rect-active");
        $(str + " .container-white .inner-rect").removeClass("inner-rect-active");
    }

});
