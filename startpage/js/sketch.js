Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};



function displayWeather(){
    let center = {x: 35, y: 54};
    colors.grey= color(240, 240, 240, Math.easeInOutQuad(framePercentage(40, 60), 0, 1, 1)*70);
    colors.grey_absolute= color(168, 168, 168, Math.easeInOutQuad(framePercentage(40, 60), 0, 1, 1));

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
            stroke(colors.white);
            randoms.forEach(star => {
                ellipse(center.x + star.x, center.y + star.y, 2*star.r)
            });
            break;
        case "SLEET":
            stroke(colors.ice);
            randoms.forEach(star => {
                ellipse(center.x + star.x, center.y + star.y, 2*star.r)
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
                    stroke(colors.fog);
                    line(center.x + randoms[i].x, center.y + randoms[i].y, center.x + randoms[i].x + randoms[i].r * 10, center.y + randoms[i].y);
                } else {
                    stroke(colors.fog);
                    line(center.x + randoms[i].x, center.y + randoms[i].y, center.x + randoms[i].x - randoms[i].r * 10, center.y + randoms[i].y);
                }
            }
            break;
        case "CLOUDY":
            fill(colors.darkcloud);
            ellipse(center.x - 7, center.y, 24, 24);
            ellipse(center.x + 4, center.y + 2, 20, 20);
            rect(center.x - 7, center.y + 10, 13, 3);
            fill(colors.cloud);
            ellipse(center.x - 7, center.y + 5, 17, 17);
            ellipse(center.x + 5, center.y + 6, 15, 15);
            rect(center.x - 7, center.y + 10, 13, 3);
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
        let center_bar = {x: $(".weather-container").width() / 2, y: 95};
        let x = center_bar.x + (i - 1) * 40, y = center_bar.y;


        noFill();
        strokeWeight(1.5);
        //line(center.x, 0, center.x, height);
        //line(center_bar.x, 0, center_bar.x, height);
        stroke(colors.grey);
        ellipse(x, y, 12, 12);

        switch(i){
            case 0:
                if(weather.hum > 0){
                    stroke(colors.hum);
                    arc(x, y, 12, 12, - HALF_PI, Math.easeInOutQuad(framePercentage(70, 130), 0, 1, 1) * TWO_PI * weather.hum * 0.99 - HALF_PI);
                }
                break;
            case 1:
                if(weather.clcover > 0){
                    stroke(colors.clcover);
                    arc(x, y, 12, 12, - HALF_PI, Math.easeInOutQuad(framePercentage(80, 140), 0, 1, 1) * TWO_PI * weather.clcover * 0.99 - HALF_PI);
                    
                }
                break;
            case 2:
                if(weather.uv > 0){
                    stroke(colors.uv);
                    arc(x, y, 12, 12, - HALF_PI, Math.easeInOutQuad(framePercentage(90, 150), 0, 1, 1) * TWO_PI * weather.uv * 0.99 - HALF_PI);
                    
                }
                break;                
        }
    }

    pop();
}

function framePercentage(b, c){
    if(frameCount >= b){
        if(frameCount < c){
            return constrain(frameCount - b, 0, c - b) / (c - b)
        }
        return 1;
    }
    return 0;
}

var randoms = [{x: 5, y: 11, r: 1.3},
    {x: 3, y: -13, r: 1.1},
    {x: -7, y: 8, r: 1.3},
    {x: -15, y: 4, r: 1.6},
    {x: -10, y: -10, r: 0.9},
    {x: -2, y: 4, r: 1},
    {x: 16, y: 1, r: 1.4},
    {x: -19, y: -13, r: 1},
    {x: 12, y: -5, r: 1.5},
    {x: -20, y: 11, r: 1.9}];

var colors;

function setup(){
    colors = {
        sun: color(255, 225, 160),
        white: color(240, 240, 240),
        fog: color(240, 240, 240, 70),
        cloud: color(180, 180, 180),
        rain: color(180, 180, 180),
        hum: color(141, 228, 239),
        ice: color(141, 228, 239),
        clcover: color(165, 165, 165),
        uv: color(198, 160, 219),
        darkcloud: color(110, 110, 110),
        grey: color(240, 240, 240, Math.easeInOutQuad(framePercentage(40, 60), 0, 1, 1)*70),
        grey_absolute: color(168, 168, 168, Math.easeInOutQuad(framePercentage(40, 60), 0, 1, 1)),
        blue: color(52, 61, 70, 255)
    }
    createCanvas(250, 110);
    jQuery("#defaultCanvas0").detach().appendTo('.weather-container')
    $("#defaultCanvas0").css("position", "absolute");
    $("#defaultCanvas0").css("top", "0");
}

function draw(){
    clear();
    displayWeather();
    if(frameCount > 200){
        frameRate(1/(60*5))
    }
}