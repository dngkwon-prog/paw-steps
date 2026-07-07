let x = 0;
let y = 0;
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
let isSetupDone = false;

function setup() {
    console.log("p5.js setup started");
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-parent');
    
    // Create an off-screen buffer to store the traces
    pg = createGraphics(windowWidth, windowHeight);
    pg.textAlign(LEFT);
    
    // Initial colors
    bgColor = color(250, 250, 250);
    targetBgColor = color(245, 245, 245);
    
    x = mouseX;
    y = mouseY;
    
    isSetupDone = true;
    console.log("p5.js setup completed");
}

function draw() {
    if (!isSetupDone) return;

    // 1. Subtle background transition
    bgColor = lerpColor(bgColor, targetBgColor, colorLerpStep);
    background(bgColor);
    
    if (frameCount % 600 === 0) {
        targetBgColor = getRandomSwissColor();
    }

    // 2. Draw the persistent traces from the buffer
    image(pg, 0, 0);

    // 3. Generate new traces on mouse movement
    // Avoid drawing if mouse hasn't moved yet
    if (mouseX === 0 && mouseY === 0) return;

    let d = dist(x, y, mouseX, mouseY);
    let newLetter = letters.charAt(counter);
    
    // Set font inside draw if pg exists
    pg.textFont(font || 'Arial');
    
    let currentFontSize = fontSizeMin + d / 5;
    pg.textSize(currentFontSize);
    stepSize = pg.textWidth(newLetter);

    if (d > stepSize) {
        let angle = atan2(mouseY - y, mouseX - x);

        pg.push();
        pg.translate(x, y);
        pg.rotate(angle + random(angleDistortion));
        
        // Footprint color: Subtle black with low alpha
        pg.fill(0, 0, 0, 60); 
        pg.noStroke();
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
}

function getRandomSwissColor() {
    // Light, subtle tones
    const r = random(240, 255);
    const g = random(240, 255);
    const b = random(240, 255);
    return color(r, g, b);
}
