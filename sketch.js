let x, y;
let stepSize = 5.0;
let font = 'Outfit';
let letters = ' PawSteps Walk Traces Subtle Moments Different Scent First Greeting Quiet Path ';
let fontSizeMin = 12;
let angleDistortion = 0.0;
let counter = 0;

let bgColor;
let targetBgColor;
let colorLerpStep = 0.005; // Very slow transition

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-parent');
    
    // Initial Swiss White/Gray colors
    bgColor = color(250, 250, 250);
    targetBgColor = getRandomSwissColor();
    
    background(bgColor);
    x = mouseX;
    y = mouseY;
    
    textFont(font);
    textAlign(LEFT);
    fill(0, 0, 0, 150); // Muted black
}

function draw() {
    // Subtle background color transition ("아사무사하게")
    bgColor = lerpColor(bgColor, targetBgColor, colorLerpStep);
    background(bgColor);
    
    // Periodically change target color
    if (frameCount % 600 === 0) {
        targetBgColor = getRandomSwissColor();
    }

    // Footprints logic from mySketch.js
    if (mouseIsPressed) {
        let d = dist(x, y, mouseX, mouseY);
        textSize(fontSizeMin + d / 5);
        let newLetter = letters.charAt(counter);
        stepSize = textWidth(newLetter);

        if (d > stepSize) {
            let angle = atan2(mouseY - y, mouseX - x);

            push();
            translate(x, y);
            rotate(angle + random(angleDistortion));
            fill(0, 0, 0, 100); // Faint footprint
            text(newLetter, 0, 0);
            pop();

            counter++;
            if (counter >= letters.length) counter = 0;

            x = x + cos(angle) * stepSize;
            y = y + sin(angle) * stepSize;
        }
    }
}

function mousePressed() {
    x = mouseX;
    y = mouseY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function getRandomSwissColor() {
    // Light, subtle tones that fit Swiss Minimalism
    const colors = [
        color(250, 250, 250), // White
        color(245, 245, 245), // Off-white
        color(240, 242, 245), // Cool gray
        color(245, 242, 235), // Warm cream
        color(235, 240, 235)  // Muted sage
    ];
    return colors[Math.floor(random(colors.length))];
}
