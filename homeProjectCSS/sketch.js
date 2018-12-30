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

function displayWeather(){
    let center = {x: 40, y: 53};
    colors = {sun: color(255, 225, 160),
        white: color(240, 240, 240),
        cloud: color(180, 180, 180),
        rain: color(180, 180, 180),
        hum: color(141, 228, 239),
        ice: color(141, 228, 239),
        clcover: color(165, 165, 165),
        uv: color(198, 160, 219),
        darkcloud: color(110, 110, 110),
        grey: color(240, 240, 240, 70),
        blue: color(52, 61, 70, 255)
    };

    push();
    noStroke();
    fill(colors.white);
    snowing = false;

    switch(weather.icon){
        case "PARTLY-CLOUDY-DAY":
            fill(colors.sun);
            ellipse(center.x, center.y, 25, 25);
            push();
            stroke(colors.sun);
            strokeWeight(2);
            translate(center.x, center.y);
            for(let i = 0; i < 7; i++){
                line(0, 18, 0, 19);
                rotate(TWO_PI / 7);
            }
            pop();
            fill(colors.cloud);
            ellipse(center.x - 7, center.y + 8, 17, 17);
            ellipse(center.x + 5, center.y + 9, 15, 15);
            rect(center.x - 7, center.y + 13, 13, 3);
            break;
        case "CLEAR-DAY":
            fill(colors.sun);
            ellipse(center.x, center.y, 25, 25);
            push();
            stroke(colors.sun);
            strokeWeight(2);
            translate(center.x, center.y);
            for(let i = 0; i < 7; i++){
                line(0, 18, 0, 19);
                rotate(TWO_PI / 7);
            }
            pop();
            break;
        case "CLEAR-NIGHT":
            fill(colors.white);
            ellipse(center.x, center.y, 20, 20);
            fill(colors.blue);
            ellipse(center.x + 12, center.y, 27, 27);
            fill(colors.white);
            randoms.forEach(star => {
                ellipse(center.x + star.x, center.y + star.y, star.r, star.r);
            });
            break;
        case "RAIN":
            stroke(colors.rain);
            randoms.forEach(star => {
                line(center.x + star.x, center.y + star.y - 5, center.x + star.x, center.y + star.y + 5);
            });
            break;
        case "SNOW":
            if(!snowing){
                snowing = true;
            }
            break;
        case "SLEET":
            randoms.forEach(star => {
                noFill();
                stroke(colors.ice);
                line(center.x + star.x, center.y + star.y, center.x + star.x, center.y + star.y - 7,);
                fill(colors.white);
                noStroke();
                ellipse(center.x + star.x, center.y + star.y, star.r * 2.5, star.r * 2.5);
            });
            break;
        case "WIND":
            stroke(colors.white);
            noFill();
            line(center.x - 14, center.y, center.x + 12, center.y);
            line(center.x - 6, center.y - 7, center.x + 4, center.y - 7);
            line(center.x - 9, center.y + 4, center.x, center.y + 4);
            line(center.x + 8, center.y + 11, center.x + 21, center.y + 11);
            arc(center.x + 21, center.y + 14.5, 6, 6, -HALF_PI, HALF_PI + 0.4);
            arc(center.x - 6, center.y - 9, 4, 4, HALF_PI, -HALF_PI + 0.7);
            break;
        case "FOG":
            noFill();
            strokeWeight(7);
            for(let i = 0; i < randoms.length; i++){
                if(randoms[i].x < 12){
                    stroke(color(colors.white.red, colors.white.green, colors.white.blue, 50 + 100 * noisef[i]));
                    line(center.x + randoms[i].x, center.y + randoms[i].y, center.x + randoms[i].x + randoms[i].r * 10, center.y + randoms[i].y);
                } else {
                    stroke(color(colors.white.red, colors.white.green, colors.white.blue, 50 + 100 * noisef[i]));
                    line(center.x + randoms[i].x, center.y + randoms[i].y, center.x + randoms[i].x - randoms[i].r * 10, center.y + randoms[i].y);
                }
            }
            break;
        case "CLOUDY":
            fill(colors.darkcloud);
            ellipse(center.x - 7, center.y + 3, 24, 24);
            ellipse(center.x + 4, center.y + 5, 20, 20);
            rect(center.x - 7, center.y + 13, 13, 3);
            fill(colors.cloud);
            ellipse(center.x - 7, center.y + 8, 17, 17);
            ellipse(center.x + 5, center.y + 9, 15, 15);
            rect(center.x - 7, center.y + 13, 13, 3);
            break;
        case "PARTLY-CLOUDY-NIGHT":
            fill(colors.white);
            ellipse(center.x, center.y, 20, 20);
            fill(colors.blue);
            ellipse(center.x + 12, center.y, 27, 27);
            fill(colors.white);
            randoms.forEach(star => {
                ellipse(center.x + star.x, center.y + star.y, star.r, star.r);
            }); 
            fill(colors.cloud);
            ellipse(center.x - 7, center.y + 8, 17, 17);
            ellipse(center.x + 5, center.y + 9, 15, 15);
            rect(center.x - 7, center.y + 13, 13, 3);
            break;
    }

    for(let i = 0; i < 3; i++){
        let x = center.x + i * 40;
        let y = center.y + 42;

        noFill();
        strokeWeight(1.5);
        stroke(colors.grey);
        ellipse(x, y, 12, 12);

        switch(i){
            case 0:
                if(weather.hum > 0){
                    stroke(colors.hum);
                    arc(x, y, 12, 12, - HALF_PI, TWO_PI * weather.hum - HALF_PI - 0.05);
                }
                break;
            case 1:
                if(weather.clcover > 0){
                    stroke(colors.clcover);
                    arc(x, y, 12, 12, - HALF_PI, TWO_PI * weather.clcover - HALF_PI - 0.05);
                    
                }
                break;
            case 2:
                if(weather.uv > 0){
                    stroke(colors.uv);
                    arc(x, y, 12, 12, - HALF_PI, TWO_PI * weather.uv - HALF_PI - 0.05);
                    
                }
                break;                
        }
    }

    pop();
}

var weather = {}, noisef = []

var randoms = [{x: 5, y: 10, r: 1.3},
    {x: 3, y: -15, r: 1.1},
    {x: -7, y: 7, r: 1.3},
    {x: -15, y: 3, r: 1.6},
    {x: -10, y: -11, r: 0.9},
    {x: -2, y: 3, r: 1},
    {x: 16, y: 0, r: 1.4},
    {x: -19, y: -15, r: 1},
    {x: 12, y: -6, r: 1.5},
    {x: -20, y: 10, r: 1.9}];

function setup(){
    createCanvas(150, 110);

    getWeather(49.4431922, 8.6644594);
    jQuery("#defaultCanvas0").detach().appendTo('.weather-container')
    $("#defaultCanvas0").css("position", "absolute");
    $("#defaultCanvas0").css("top", "0");
}

function draw(){
    clear();
    let drawn = false;
    if(!drawn){
        if(frameCount > 100){
            if(weather.temp != "" && weather.temp != undefined){
                $(".weather-description").html(weather.descr);
                $(".weather-degrees").html(weather.temp + " C");
                displayWeather();
                drawn = true;
            } else {
                $(".weather-container").css("opacity", "0 !important");
                $(".weather-description").html("");
                $(".weather-degrees").html("");
            }
        }
    } else {
        if(weather.descr == "FOG"){
            for(let i = 0; i < randoms.length; i++){
                noisef[i] = noise(frameCount / 700 + i * 100);
            }
        }
    }
}