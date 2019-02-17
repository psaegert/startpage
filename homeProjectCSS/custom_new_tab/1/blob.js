// ------------------------------------------ VARIABLES ---------------------------------------------------------------------------------------------------


var enable;
chrome.storage.local.get('startpage_blob',function(e){
    if(e.startpage_blob){



// get menu data

var menuCircles = [
    {title: "Youtube", url:"https://www.youtube.com", color:"rgb(255, 160, 160)"},
    {title: "Soundcloud", url:"https://soundcloud.com/discover/", color:"rgb(255, 200, 160)"},
    {title: "TV", url:"https://www.tvspielfilm.de/tv-programm/sendungen/abends.html", color:"rgb(160, 160, 255)"},
    {title: "Twitch", url:"https://www.twitch.tv/directory", color:"rgb(220, 160, 255)"},
    {title: "Reddit", url:"https://www.reddit.com", color:"rgb(255, 180, 140)"},
].slice(0, 13)

//


// declare golbal variables and position object

var mouse = [],
    open = false,
    blobPos, an,
    segment = 2 * Math.PI / menuCircles.length,
    focus = -1,
    focus_old, position, pressed = false,
    key = 16;

chrome.storage.local.get("custom_startpage_blob_position", function(e){
    if(e.custom_startpage_blob_position != undefined){
        position = {
            mouse:{
                x:e.custom_startpage_blob_position.x,
                y:e.custom_startpage_blob_position.y},
            blob:{
                x:e.custom_startpage_blob_position.x,
                y:e.custom_startpage_blob_position.y},
            difference:{
                x:0,
                y:0
            },
            inWindow:true
        }
    } else {
        position = {
            mouse:{
                x:500,
                y:500},
            blob:{
                x:500,
                y:500},
            difference:{
                x:0,
                y:0
            },
            inWindow:true
        }
    }
    
});

//


// ------------------------------------------ INJECTION ---------------------------------------------------------------------------------------------------


// inject font

chrome.storage.local.get('custom_startpage',function(e){
    var styleNode           = document.createElement ("style");
    styleNode.type          = "text/css";
    styleNode.textContent   = "@font-face { font-family: GothamRoundedLight; src: url('"
                            + chrome.extension.getURL ("GothamRoundedLight.otf")
                            + "'); }"
                            ;
    document.head.appendChild (styleNode);
});

//


// create and inject elements

var dark = document.createElement("div");
dark.id = "startpage-blob--dark";
$("body").append(dark);

var blob = document.createElement("div")
blob.id = "startpage-blob--container";
$("body").append(blob);

var description = document.createElement("div");
description.id = "startpage-blob--description-container";
$("#startpage-blob--container").append(description);

var titlecontainer = document.createElement("div");
titlecontainer.id = "startpage-blob--description-title-container";
$("#startpage-blob--description-container").append(titlecontainer);

var backgroundcircle = document.createElement("div");
backgroundcircle.id = "startpage-blob--background-circle";
$("#startpage-blob--container").append(backgroundcircle);

var background = document.createElement("div");
background.id = "startpage-blob--menu-container";
$("#startpage-blob--container").append(background);

var circle = document.createElement("div");
circle.id = "startpage-blob--circle";
$("#startpage-blob--container").append(circle);

var menu = document.createElement("div");
menu.id = "startpage-blob--menu";
$("#startpage-blob--menu-container").append(menu);

// var pointer = document.createElement("div");
// pointer.id = "startpage-blob--pointer";
// $("#startpage-blob--menu-container").append(pointer);

menuCircles.forEach(menuC => {
    let menu = document.createElement("div"), ind = menuCircles.indexOf(menuC), a = 2 * Math.PI / menuCircles.length * ind;
    menu.id = "startpage-blob--menu-" + ind;
    $("#startpage-blob--menu").append(menu);
    $("#startpage-blob--menu-" + ind).css({
        "top": ((1-Math.cos(a)) * $("#startpage-blob--menu").height() / 2 - 9) + "px",
        "left": ((1-Math.sin(-a)) * $("#startpage-blob--menu").height() / 2 - 9) + "px"
    });
    $("#startpage-blob--menu-" + ind).addClass("startpage-blob--menu-item");

    let inner = document.createElement("div");
    inner.id = "startpage-blob--menu-" + ind + "-inner";
    $("#startpage-blob--menu-" + ind).append(inner);
    $("#startpage-blob--menu-" + ind + "-inner").css({
        "background-color": menuC.color
    });
    $("#startpage-blob--menu-" + ind + "-inner").addClass("startpage-blob--menu-item-inner");

    var title = document.createElement("div");
    title.id = "startpage-blob--description-title-" + ind;
    title.innerText = menuC.title;
    $("#startpage-blob--description-title-container").append(title);
    $("#startpage-blob--description-title-" + ind).addClass("startpage-blob--description-title");
});

var underline = document.createElement("div");
underline.id = "startpage-blob--description-underline";
$("#startpage-blob--description-container").append(underline);

//


// ------------------------------------------ USER INTERACTION ---------------------------------------------------------------------------------------------------


// KEY listener

$(document).keydown(function (ev) {
    if(ev.keyCode == key){
        ev.preventDefault();
        pressed = true;
        if(position != undefined){
            if(!open){
                if(position.inWindow){
                    if( $(":focus").length == 0){
                        openBlob();
                    } else {
                        setTimeout(function(){if(pressed)openBlob()}, 300);
                    }
                }
            } 
        }
    }
});

$(document).keyup(function (ev) {
    if(ev.keyCode == key){
        pressed = false;
        ev.preventDefault;
        if(open) {
            closeBlob();
        }
    }
});

//


// remove focus on middle hover

$("#startpage-blob--circle").hover(function(){
        focus_old = -2;
        $("#startpage-blob--circle").addClass("startpage-blob--circle-active")
        activateMenu(-1);
    }, function(){
        focus_old = -1;
        $("#startpage-blob--circle").removeClass("startpage-blob--circle-active")
});

//


// handle clicks

$("#startpage-blob--container :not(#startbage-blob--container):not(#startpage-blob--dark)").contextmenu(function(ev){
    ev.preventDefault();
});

$("#startpage-blob--container").mousedown(function(ev){
    ev.preventDefault();
    if(ev.which == 1){
        exit(0);
    }
});

$("#startpage-blob--dark").mousedown(function(ev){
    ev.preventDefault();
    if(ev.which == 1){
        exit(0);
    }
})

$("#startpage-blob--container").contextmenu(function(ev){
    ev.preventDefault();
    exit(1);
});

$("#startpage-blob--dark").contextmenu(function(ev){
    ev.preventDefault();
    exit(1);
})

//

// mouse movement

$("body").mouseleave(function(ev){
    if(position != undefined){
        position.inWindow = false;
    }
    closeBlob();
})

document.onmousemove = function(ev){
    if(position != undefined){
        position.inWindow = true;
        position.mouse.x = ev.clientX
        position.mouse.y = ev.clientY
        if(open){
            position.difference.x = position.mouse.x - position.blob.x;
            position.difference.y = position.mouse.y - position.blob.y;
        }
        let len = Math.sqrt(position.difference.x * position.difference.x + position.difference.y * position.difference.y)
    
        if(len != 0){
            if(Math.asin(position.difference.x / len)<0){
                an = Math.PI + Math.acos(position.difference.y / len);
            } else {
                an = Math.PI - Math.acos(position.difference.y / len);
            }
        }
    
        if(focus != -2){
            let min = 7;
            for(let i = 0; i <= menuCircles.length; i++){
                if(Math.abs(segment * i - an) < min){
                    min = Math.abs(segment * i - an)
                    focus = i;
                }
            }
            focus = focus % menuCircles.length;
        }

        if(focus != focus_old && focus != -1 && focus_old != -2){
            activateMenu(focus);
            focus_old = focus;
        }
        
    }
}

//


// ------------------------------------------ ANIMATIONS ---------------------------------------------------------------------------------------------------


// open, close animations

function openBlob(){
    chrome.storage.local.set({custom_startpage_blob_position: position.blob});

    an = 0;
    position.blob.x = position.mouse.x;
    position.blob.y = position.mouse.y;
    $("body > :not(#startpage-blob--container):not(#startpage-blob--dark)").each(function(){$(this).addClass("startpage-blob--blur")});
    $("#startpage-blob--dark").fadeIn(100);
    $("#startpage-blob--container").css({
        "left": position.mouse.x - 50 + "px",
        "top": position.mouse.y - 50 + "px"
    }).show();
    setTimeout(function(){

        $("#startpage-blob--circle").addClass("startpage-blob--circle-ready")
        $("#startpage-blob--circle").addClass("startpage-blob--circle-active")
        $("#startpage-blob--background-circle").addClass("startpage-blob--background-circle-active")
        $("#startpage-blob--menu-container").show().addClass("startpage-blob--menu-container-active")

        for(let i = 0; i < menuCircles.length; i++){
            $("#startpage-blob--menu-" + i + "-inner").delay(20 + 200 / menuCircles.length * i).queue(function (next) {
                $(this).addClass("startpage-blob--menu-item-inner-ready")
                next(); 
            });
        }
    }, 20);
    open = true;
}

function closeBlob(){
    $("#startpage-blob--dark").fadeOut(100);
    $("body > :not(#startpage-blob--container):not(#startpage-blob--dark)").each(function(){$(this).removeClass("startpage-blob--blur")});
    $("#startpage-blob--circle").removeClass("startpage-blob--circle-active")
    $("#startpage-blob--background-circle").removeClass("startpage-blob--background-circle-active")
    $("#startpage-blob--circle").removeClass("startpage-blob--circle-ready")
    $("#startpage-blob--menu-container").removeClass("startpage-blob--menu-container-active").hide();
    $("#startpage-blob--description-underline").css("transform", "scaleX(0)").removeClass("startpage-blob--description-underline-active")

    for(let i = 0; i < menuCircles.length; i++){
        $("#startpage-blob--menu-" + i + "-inner").removeClass("startpage-blob--menu-item-inner-ready")
        $("#startpage-blob--description-title-" + i).removeClass("startpage-blob--description-title-active")
    }
    setTimeout(function(){
        $("#startpage-blob--container").hide();
    }, 100);
    open = false
}

function activateMenu(a){
    for(let i = 0; i < menuCircles.length; i++){
        if(i == a){
            $("#startpage-blob--menu-" + i + "-inner").addClass("startpage-blob--menu-item-inner-active")
            $("#startpage-blob--description-title-" + i).addClass("startpage-blob--description-title-active")
        } else {
            $("#startpage-blob--menu-" + i + "-inner").removeClass("startpage-blob--menu-item-inner-active")
            $("#startpage-blob--description-title-" + i).removeClass("startpage-blob--description-title-active")
        }
    }
    if(a >= 0){
        $("#startpage-blob--description-underline").css("transform", "scaleX(" + $("#startpage-blob--description-title-" + a).width() / 100 + ")").addClass("startpage-blob--description-underline-active")
    } else {
        $("#startpage-blob--description-underline").css("transform", "scaleX(0)").removeClass("startpage-blob--description-underline-active")
    }
}

//


// ------------------------------------------ LOGIC ---------------------------------------------------------------------------------------------------


// exit

function exit(newTab){
    chrome.storage.local.set({custom_startpage_blob_position: position.mouse});
    if(focus_old >= 0){

        switch (newTab) {
            case 0:
                chrome.runtime.sendMessage({navigate: menuCircles[focus].url, newTab: "false"});
                break;
            case 1:
                chrome.runtime.sendMessage({navigate: menuCircles[focus].url, newTab: "true"});
                break;
        }
    } else {
        switch (newTab) {
            case 0:
                chrome.runtime.sendMessage({navigate: "home", newTab: "false"});
                break;
            case 1:
                chrome.runtime.sendMessage({navigate: "home", newTab: "true"});
                break;
        }
    }
}

//



    }
});
