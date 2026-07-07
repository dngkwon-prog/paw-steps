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
const traceStorageKey = 'pawsteps_traces_v1';

// Photo traces: small photo stamps dropped along the mouse trail, each
// paired with a short note written from what's actually in the photo.
const photoTraces = [
    {
        src: 'assets/dog_walk_calm_1783390284529.png',
        caption: "He stopped chasing anything and just watched the hills go orange."
    },
    {
        src: 'assets/dog_walk_energetic_1783390294434.png',
        caption: "Full stretch, ears back — the frisbee never had a chance."
    },
    {
        src: 'assets/dog_walk_happy_1783390275275.png',
        caption: "Every leaf on the trail got a proper sniff before we moved on."
    }
];
let photoImages = [];
let placedPhotos = []; // {x, y, r, index} for click hit-testing
let stepsSinceLastPhoto = 0;
const photoDropInterval = 45; // steps between photo traces

function preload() {
    photoImages = photoTraces.map((p) => loadImage(p.src));
}

function setup() {
    console.log("p5.js setup started");
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-parent');

    // Create an off-screen buffer to store the traces
    pg = createGraphics(windowWidth, windowHeight);
    pg.textAlign(LEFT);

    // Restore traces saved before the last page reload
    let savedTraces = localStorage.getItem(traceStorageKey);
    if (savedTraces) {
        loadImage(savedTraces, (img) => {
            pg.image(img, 0, 0);
        });
    }

    // Initial colors
    bgColor = color(250, 250, 250);
    targetBgColor = color(245, 245, 245);

    x = mouseX;
    y = mouseY;

    isSetupDone = true;
    console.log("p5.js setup completed");
}

window.addEventListener('beforeunload', () => {
    if (!pg) return;
    try {
        localStorage.setItem(traceStorageKey, pg.canvas.toDataURL());
    } catch (e) {
        console.warn('Could not save traces before reload:', e);
    }
});

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

        stepsSinceLastPhoto++;
        let dropPhoto = stepsSinceLastPhoto >= photoDropInterval && photoImages.length > 0;

        pg.push();
        pg.translate(x, y);
        pg.rotate(angle + random(angleDistortion));

        if (dropPhoto) {
            let photoIndex = floor(random(photoImages.length));
            let photoRadius = constrain(currentFontSize * 1.4, 18, 42);
            drawPhotoTrace(photoImages[photoIndex], photoRadius);
            placedPhotos.push({ x: x, y: y, r: photoRadius, index: photoIndex });
            stepsSinceLastPhoto = 0;
        } else {
            // Footprint color: Subtle black with low alpha
            pg.fill(0, 0, 0, 60);
            pg.noStroke();
            pg.text(newLetter, 0, 0);
        }
        pg.pop();

        counter++;
        if (counter >= letters.length) counter = 0;

        x = x + cos(angle) * stepSize;
        y = y + sin(angle) * stepSize;
    }
}

// Draws a small circular thumbnail centered on the current pg origin
// (called while pg is already translated/rotated to the trail position).
function drawPhotoTrace(img, r) {
    pg.drawingContext.save();
    pg.drawingContext.beginPath();
    pg.drawingContext.arc(0, 0, r, 0, Math.PI * 2);
    pg.drawingContext.clip();
    pg.imageMode(CENTER);
    pg.tint(255, 235);
    pg.image(img, 0, 0, r * 2, r * 2);
    pg.noTint();
    pg.imageMode(CORNER);
    pg.drawingContext.restore();

    pg.noFill();
    pg.stroke(0, 0, 0, 120);
    pg.strokeWeight(1.5);
    pg.circle(0, 0, r * 2);
}

function mousePressed() {
    // Topmost (most recently dropped) photo wins if traces overlap
    for (let i = placedPhotos.length - 1; i >= 0; i--) {
        let p = placedPhotos[i];
        if (dist(mouseX, mouseY, p.x, p.y) <= p.r) {
            if (typeof window.openPhotoTrace === 'function') {
                window.openPhotoTrace(photoTraces[p.index]);
            }
            return false;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Keep existing traces instead of losing them when the buffer resizes
    let oldTraces = pg.get();
    pg.resizeCanvas(windowWidth, windowHeight);
    pg.image(oldTraces, 0, 0);
}

function getRandomSwissColor() {
    // Light, subtle tones
    const r = random(240, 255);
    const g = random(240, 255);
    const b = random(240, 255);
    return color(r, g, b);
}
