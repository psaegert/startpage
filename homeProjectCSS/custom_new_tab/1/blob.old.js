$(function(){
    console.log("blob")

    // -----------------------------------------------------------  MAIN - CONTAINER ------------------------
    var blob = document.createElement("div")
    blob.id = "startpage-blob--container";
    $("body").append(blob);
    // $("#startpage-blob--container").css({
    //     "position": "fixed",
    //     "bottom": "0",
    //     "right": "0",
    //     "height": "100px",
    //     "width": "100px",
    //     "border-radius": "50%",
    //     "transition": "0.15s ease",
    //     "z-index": "2000",
    //     "overflow": "visible"
    //     // "border": "1px solid red"
    // });

    // -----------------------------------------------------------  BACKGROUND - CIRCLE ------------------------
    var background = document.createElement("div");
    background.id = "startpage-blob--background-circle";
    $("#startpage-blob--container").append(background);
    // $("#startpage-blob-background-circle").css({
    //     "position": "absolute",
    //     "height": "100%",
    //     "width": "100%",
    //     "transform": "scale(0.8)",
    //     "background-color": "rgb(123, 122, 244)",
    //     "border-radius": "50%",
    //     "overflow": "visible",
    //     "opacity": "0",
    //     "transition-property": "opacity, transform",
    //     "transition-duration": "0.15s, 0.25s",
    //     "transition-timing-function": "ease, cubic-bezier(0.320, 0.230, 0.215, 1.350)"
    // });

    // -----------------------------------------------------------  BACKGROUND - CONTAINER ------------------------
    var background = document.createElement("div");
    background.id = "startpage-blob--background-container";
    $("#startpage-blob--container").append(background);
    $("#startpage-blob--background-container").css({
        "position": "absolute",
        "height": "100%",
        "width": "100%",
        "transform": "scale(0.8)",
        "display":"none",
        "border-radius": "50%",
        "overflow": "visible",
        "transition-property": "transform",
        "transition-duration": "0.15s",
        "transition-timing-function": "ease"
    });

    // -----------------------------------------------------------  MAIN - CIRCLE ------------------------
    var circle = document.createElement("div");
    circle.id = "startpage-blob--circle";
    $("#startpage-blob--container").append(circle);
    $("#startpage-blob--circle").css({
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "left": "0",
        "right": "0",
        "height": "60px",
        "width": "60px",
        "transform": "scale(0.8)",
        "background-color": "rgb(115, 126, 253)",
        "margin": "auto",
        "border-radius": "50%",
        "opacity": "0.8",
        "transition": "0.15s ease",
        "box-shadow": "2px 3px 11px rgb(0, 0, 0, 0.3)"
    });

    // -----------------------------------------------------------  MENU - CONTAINER ------------------------
    var menu = document.createElement("div");
    menu.id = "startpage-blob--menu";
    $("#startpage-blob--background-container").append(menu);
    $("#startpage-blob--menu").css({
        "height": "95%",
        "width": "95%",
        "max-width": 225 * 0.95 + "px",
        "max-height": 225 * 0.95 + "px",
        "top": "0",
        "bottom": "0",
        "left": "0",
        "right": "0",
        "margin": "auto",
        "overflow": "visible",
        "position": "absolute",
        "border-radius": "50%"
    });


    // -----------------------------------------------------------  MENU - CIRCLES ------------------------
    var menuCircles = [
        {title: "title", url:"www.youtube.com", color:"rgb(255, 255, 100)"},
        {title: "title2", url:"www.youtube.com", color:"rgb(255, 100, 255)"},
        {title: "title2", url:"www.youtube.com", color:"rgb(100, 100, 255)"},
        {title: "title2", url:"www.youtube.com", color:"rgb(255, 100, 100)"}
    ]

    menuCircles.forEach(menuC => {
        // -----------------------------------------------------------  MENU - CIRCLES - CONTAINER ------------------------
        let menu = document.createElement("div"), ind = menuCircles.indexOf(menuC), a = -0.15 + 0.6 * ind;
        menu.id = "startpage-blob--menu-" + ind;
        $("#startpage-blob--menu").append(menu);
        $("#startpage-blob--menu-" + ind).css({
            "position": "absolute",
            "height": "20px",
            "width": "20px",
            "overflow": "visible",
            "top": ((1-Math.sin(a)) * $("#startpage-blob--menu").height() / 2 - 9) + "px",
            "left": ((1-Math.cos(a)) * $("#startpage-blob--menu").height() / 2 - 9) + "px",
            "border-radius": "50%"
        });

        // -----------------------------------------------------------  MENU - CIRCLES - INNER ------------------------
        let inner = document.createElement("div");
        inner.id = "startpage-blob--menu-" + ind + "-inner";
        $("#startpage-blob--menu-" + ind).append(inner);
        $("#startpage-blob--menu-" + ind + "-inner").css({
            "position": "absolute",
            "top": "0",
            "bottom": "0",
            "left": "0",
            "right": "0",
            "margin": "auto",
            "height": "100%",
            "width": "100%",
            "opacity": "0",
            "overflow": "visible",
            "transform":"scale(0.8)",
            "box-shadow": "2px 3px 11px rgb(0, 0, 0, 0.3)",
            "background-color": menuC.color,
            "border-radius": "50%",
            "transition-property": "transform, opacity", 
            "transition-duration": "0.25s, 0.07s",
            "transition-timing-function": "cubic-bezier(0.335, 0.305, 0.510, 1.650), ease"
        });

        // -----------------------------------------------------------  HOVER - MENU - CIRCLES ------------------------
        

        $("#startpage-blob--menu-" + ind).hover(function(){
            $("#startpage-blob--menu-" + ind + "-inner").css({
                "transform":"scale(1.1)"
            })
        }, function(){
            $("#startpage-blob--menu-" + ind + "-inner").css({
                "transform":"scale(1)"
            })
        })
    });
   
    // -----------------------------------------------------------  HOVER - OUTER ------------------------
    $("#startpage-blob--container").hover(
        function(){
            $("#startpage-blob--circle").css({
                "opacity":"1",
                "transform": "scale(1)"
            })
        }, function(){
            $("#startpage-blob--circle").css({
                "opacity":"0.8",
                "transform": "scale(0.8)"
            })
            $("#startpage-blob--background-circle").css({
                "transform": "scale(0.8)",
                "opacity": "0"
            })
            $("#startpage-blob--background-container").css({
                "display": "none",
                "transform":"scale(0.8)"
            })
            for(let i = 0; i < menuCircles.length; i++){
                $("#startpage-blob--menu-" + i + "-inner").css({
                    "transform":"scale(0.8)",
                    "opacity": "0"
                });
            }
        }
    );

    // -----------------------------------------------------------  HOVER - INNER ------------------------
    $("#startpage-blob--circle").hover(
        function(){
            $("#startpage-blob--background-circle").css({
                "transform": "scale(2.25)",
                "opacity":"0.8"
            })
            $("#startpage-blob--background-container").css({
                "display": "block",
                "transform":"scale(2.25)"
            })
            for(let i = 0; i < menuCircles.length; i++){
                $("#startpage-blob--menu-" + i + "-inner").delay(20 + 40 * i).queue(function (next) {
                    $(this).css({
                        'transform': 'scale(1)',
                        "opacity": "1"
                    }); 
                    next(); 
                  });
            }
        }, function(){
        }
    );


    // click circle
    $("#startpage-blob--circle").contextmenu(
        function(){
            chrome.runtime.sendMessage({navigate: "home", newTab: "true"});
        }
    );

    $( "#startpage-blob--circle" ).click(function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({navigate: "home", newTab: "false"});
    });

})

$(document).keydown(function (ev) {
    if(ev.keyCode == 16){
        if(mode == "toggle"){
            $("#startpage-blob--container").css({
                "left": mouse[0] - 50 + "px",
                "top": mouse[1] - 50 + "px"
            });
        } else if(mode == "hold" && !open) {
            $("#startpage-blob--container").css({
                "display":"block",
                "left": mouse[0] - 50 + "px",
                "top": mouse[1] - 50 + "px"
            });
            open = true;
        }
    }
});

$(document).keyup(function (ev) {
    if(ev.keyCode == 16){
        if(mode == "hold" && open) {
            setTimeout(function(){
                $("#startpage-blob--container").css({
                    "display":"none"
                });
            }, 100)
            open = false
        }
    }
});

var mouse = [], mode = "hold", open = false;

document.onmousemove = function(ev){
    mouse = [ev.clientX, ev.clientY];
}