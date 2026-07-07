let x, y;
let stepSize = 5.0;
let font = 'Outfit';
let letters = ' PawSteps Walk Traces Subtle Moments Different Scent First Greeting Quiet Path ';
let fontSizeMin = 12;
let angleDistortion = 0.0;
let counter = 0;

let bgColor;
let targetBgColor;
let colorLerpStep = 0.005;

let pg; // Graphics buffer for persistent traces

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-parent');
    
    // Create an off-screen buffer to store the traces
    pg = createGraphics(windowWidth, windowHeight);
    pg.textFont(font);
    pg.textAlign(LEFT);
    
    // Initial colors
    bgColor = color(250, 250, 250);
    targetBgColor = getRandomSwissColor();
    
    x = mouseX;
    y = mouseY;
}

function draw() {
    // 1. Subtle background transition (always happens)
    bgColor = lerpColor(bgColor, targetBgColor, colorLerpStep);
    background(bgColor);
    
    if (frameCount % 600 === 0) {
        targetBgColor = getRandomSwissColor();
    }

    // 2. Draw the persistent traces from the buffer
    image(pg, 0, 0);

    // 3. Generate new traces on mouse movement (no click required)
    let d = dist(x, y, mouseX, mouseY);
    let newLetter = letters.charAt(counter);
    let currentFontSize = fontSizeMin + d / 5;
    pg.textSize(currentFontSize);
    stepSize = pg.textWidth(newLetter);

    if (d > stepSize) {
        let angle = atan2(mouseY - y, mouseX - x);

        pg.push();
        pg.translate(x, y);
        pg.rotate(angle + random(angleDistortion));
        
        // Footprint color: Subtle black with low alpha for a "layered" look
        pg.fill(0, 0, 0, 60); 
        pg.text(newLetter, 0, 0);
        pg.pop();

        counter++;
        if (counter >= letters.length) counter = 0;

        x = x + cos(angle) * stepSize;
        y = y + sin(angle) * stepSize;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Note: Resizing Graphics buffer would clear it, so we keep it or resize carefully
    // For MVP, we just resize the main canvas
}

function getRandomSwissColor() {
    const colors = [
        color(250, 250, 250),
        color(245, 245, 245),
        color(242, 243, 245),
        color(245, 243, 238),
        color(238, 242, 238)
    ];
    return colors[Math.floor(random(colors.length))];
}
