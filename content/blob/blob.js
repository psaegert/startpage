// ------------------------------------------ VARIABLES ---------------------------------------------------------------------------------------------------

// declare golbal variables and position object

chrome.storage.local.get("startpage_settings", function(s){
    let mains = s.startpage_settings.mains;

    var open = false,
        an, capital = 1,
        segment = 2 * Math.PI / mains.length,
        focus = -1,
        focus_old, position, pressed = false, scroll = false;;

    chrome.storage.local.get("startpage_blob_position", function(e){
        if(e.startpage_blob_position != undefined){
            position = {
                mouse:{
                    x:e.startpage_blob_position.x,
                    y:e.startpage_blob_position.y},
                blob:{
                    x:e.startpage_blob_position.x,
                    y:e.startpage_blob_position.y},
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

    var styleNode           = document.createElement ("style");
    styleNode.type          = "text/css";
    styleNode.textContent   = "@font-face { font-family: GothamRoundedLight; src: url('"
                            + chrome.extension.getURL("/content/blob/fonts/GothamRoundedLight.otf")
                            + "'); }"
                            ;
    document.head.appendChild (styleNode);

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

    var imgcontainer = document.createElement("div");
    imgcontainer.id = "startpage-blob--description-img-container";
    $("#startpage-blob--description-container").append(imgcontainer);

    var imgcontainer2 = document.createElement("div");
    imgcontainer2.id = "startpage-blob--description-img-container-2";
    $("#startpage-blob--description-img-container").append(imgcontainer2);

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

    mains.forEach(main => {
        let menu = document.createElement("div"), ind = mains.indexOf(main), a = segment * ind;
        menu.id = "startpage-blob--menu-" + ind;
        $("#startpage-blob--menu").append(menu);
        $("#startpage-blob--menu-" + ind).css({
            "top": ((1-Math.cos(a)) * 95 / 2 - 9) + "px",
            "left": ((1-Math.sin(-a)) * 95 / 2 - 9) + "px"
        });
        $("#startpage-blob--menu-" + ind).addClass("startpage-blob--menu-item");
    
        let inner = document.createElement("div");
        inner.id = "startpage-blob--menu-" + ind + "-inner";
        $("#startpage-blob--menu-" + ind).append(inner);
        $("#startpage-blob--menu-" + ind + "-inner").css({
            "background-color": main.cover
        });
        $("#startpage-blob--menu-" + ind + "-inner").addClass("startpage-blob--menu-item-inner");
    
        var title = document.createElement("div");
        title.id = "startpage-blob--description-title-" + ind;
        title.innerText = main.name;
        $("#startpage-blob--description-title-container").append(title);
        $("#startpage-blob--description-title-" + ind).addClass("startpage-blob--description-title");
    
        var img = document.createElement("img");
        img.id = "startpage-blob--description-img-" + ind;
        $("#startpage-blob--description-img-container-2").append(img);
        $("#startpage-blob--description-img-" + ind).addClass("startpage-blob--description-img");
    });
    
    var underline = document.createElement("div");
    underline.id = "startpage-blob--description-underline";
    $("#startpage-blob--description-container").append(underline);   


    loadBlobImage(0)

    //


    // ------------------------------------------ USER INTERACTION ---------------------------------------------------------------------------------------------------


    // KEY listener
    $(document).keydown(function (ev) {
        if(ev.keyCode == 16){
            ev.preventDefault();
            pressed = true;
            if(position != undefined){
                if(!open){
                    if(position.inWindow && !scroll){
                        if($(":focus:not(div)").length == 0){
                            openBlob();
                        } else {
                            setTimeout(function(){if(pressed && (new Date().getTime() - capital) > 300)openBlob()}, 300);
                        }
                    }
                } 
            }
        } else {
            if(ev.shiftKey){
                capital = new Date().getTime();
                closeBlob();
            }
        }
    });

    $(document).keyup(function (ev) {
        if(ev.keyCode == 16){
            pressed = false;
            scroll = false;
            ev.preventDefault;
            if(open) {
                closeBlob();
            }
        }
    });

    $(document).on("mousewheel", function(ev){
        if(ev.shiftKey){
            closeBlob();
            scroll = true;
            setTimeout(function(){
                if(!pressed){
                    scroll = false;
                }
            }, 100);
        }
    })

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
            blobExit(0);
        }
    });

    $("#startpage-blob--dark").mousedown(function(ev){
        ev.preventDefault();
        if(ev.which == 1){
            blobExit(0);
        }
    })

    $("#startpage-blob--container").contextmenu(function(ev){
        ev.preventDefault();
        blobExit(1);
    });

    $("#startpage-blob--dark").contextmenu(function(ev){
        ev.preventDefault();
        blobExit(1);
    })

    //

    // mouse movement

    $("body").mouseleave(function(ev){
        // if(position != undefined){
        //     position.inWindow = false;
        // }
        // closeBlob();
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
                if(Math.asin(position.difference.x / len) < 0){
                    an = Math.PI + Math.acos(position.difference.y / len);
                } else {
                    an = Math.PI - Math.acos(position.difference.y / len);
                }

                if(focus != -2){
                    let min = 7;
                    for(let i = 0; i <= mains.length; i++){
                        if(Math.abs(segment * i - an) < min){
                            min = Math.abs(segment * i - an)
                            focus = i;
                        }
                    }
                    focus = focus % mains.length;
                }
    
                if(focus != focus_old && focus != -1 && focus_old != -2){
                    activateMenu(focus);
                    focus_old = focus;
                }
            }
        }
    }

    //


    // ------------------------------------------ ANIMATIONS ---------------------------------------------------------------------------------------------------


    // open, close animations

    function openBlob(){
        chrome.storage.local.set({startpage_blob_position: position.blob});

        try{
            $(".suggestions").css("display", "none")
            $(".input").removeClass("input-typing")
        } catch(e){

        }

        chrome.storage.local.get('startpage_settings',function(e){
            if(e.startpage_settings.blob){
                    
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

                    for(let i = 0; i < mains.length; i++){
                        $("#startpage-blob--menu-" + i + "-inner").delay(20 + 200 / mains.length * i).queue(function (next) {
                            $(this).addClass("startpage-blob--menu-item-inner-ready")
                            next(); 
                        });
                    }
                }, 20);
                open = true;
            }
        });
    }

    function closeBlob(){

        try{
            if($("#input").val().replace(/\s/g, '') != ""){
                $(".suggestions").css("display", "block")
                $(".input").addClass("input-typing")
            }
        } catch(e){

        }

        $("#startpage-blob--dark").fadeOut(100);
        $("body > :not(#startpage-blob--container):not(#startpage-blob--dark)").each(function(){$(this).removeClass("startpage-blob--blur")});
        $("#startpage-blob--circle").removeClass("startpage-blob--circle-active")
        $("#startpage-blob--background-circle").removeClass("startpage-blob--background-circle-active")
        $("#startpage-blob--circle").removeClass("startpage-blob--circle-ready")
        $("#startpage-blob--menu-container").removeClass("startpage-blob--menu-container-active").hide();
        $("#startpage-blob--description-underline").css("transform", "scaleX(0)").removeClass("startpage-blob--description-underline-active")

        for(let i = 0; i < mains.length; i++){
            $("#startpage-blob--menu-" + i + "-inner").removeClass("startpage-blob--menu-item-inner-ready")
            $("#startpage-blob--description-title-" + i).removeClass("startpage-blob--description-title-active")
            $("#startpage-blob--description-img-" + i).removeClass("startpage-blob--description-img-active")
        }
        setTimeout(function(){
            $("#startpage-blob--container").hide();
        }, 100);
        open = false
    }

    function activateMenu(a){
        for(let i = 0; i < mains.length; i++){
            if(i == a){
                $("#startpage-blob--menu-" + i + "-inner").addClass("startpage-blob--menu-item-inner-active")
                $("#startpage-blob--description-title-" + i).addClass("startpage-blob--description-title-active")
                $("#startpage-blob--description-img-" + i).addClass("startpage-blob--description-img-active")

            } else {
                $("#startpage-blob--menu-" + i + "-inner").removeClass("startpage-blob--menu-item-inner-active")
                $("#startpage-blob--description-title-" + i).removeClass("startpage-blob--description-title-active")
                $("#startpage-blob--description-img-" + i).removeClass("startpage-blob--description-img-active")


            }
        }
        if(a >= 0){
            $("#startpage-blob--description-underline").css("transform", "scaleX(" + $("#startpage-blob--description-title-" + a).width() / 100 + ")").addClass("startpage-blob--description-underline-active")
        } else {
            $("#startpage-blob--description-underline").css("transform", "scaleX(0)").removeClass("startpage-blob--description-underline-active")

        }
    }

    function loadBlobImage(i){
        if(i < 5){
            main = mains[i];
            let src = ""
            if(main.img.indexOf("file:///") == 0 || main.img.indexOf("http://") == 0 || main.img.indexOf("https://") == 0){
                src = main.img;
            } else {
                src = chrome.extension.getURL("/startpage/img/main/" + main.img)
            }
            if(src.replace(/\s/g, '') != "" && src.split(".").length > 1){
                $.get(src)
                .done(function() { 
            
                    $("#startpage-blob--description-img-" + i).attr("src", src);
                    loadBlobImage(i+1)

                }).fail(function() { 
            
                    $("#startpage-blob--description-img-" + i).remove();
        
                    loadBlobImage(i+1)
                })
            } else {
                $("#startpage-blob--description-img-" + i).remove();

                loadBlobImage(i+1)
            }
        }
    }

    //


    // ------------------------------------------ LOGIC ---------------------------------------------------------------------------------------------------


    // exit

    function blobExit(newTab){
        chrome.storage.local.set({startpage_blob_position: position.mouse});
        if(focus_old >= 0){

            switch (newTab) {
                case 0:
                    chrome.runtime.sendMessage({navigate: mains[focus].url, newTab: "false"});
                    break;
                case 1:
                    chrome.runtime.sendMessage({navigate: mains[focus].url, newTab: "true"});
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

})

//