const canvas = document.getElementById("winter-scene");
const ctx = canvas.getContext("2d");

let w, h;

// =========================
// EVERGREEN TREES
// =========================

function tree(x, y, H, W) {
    ctx.save();
    ctx.translate(x, y);

    // Tree trunk
    ctx.fillStyle = "#514b43";
    ctx.fillRect(-W * 0.045, -H * 0.4, W * 0.09, H * 0.4);

    // Layers of branches
    for (let j = 0; j < 7; j++) {
        let yy = -H * 0.13 - j * H * 0.112;
        let ww = W * (1 - j * 0.123) / 2;
        let hh = H * 0.34;

        ctx.fillStyle = j % 2 ? "#254c42" : "#183d35";

        ctx.beginPath();
        ctx.moveTo(0, yy - hh);
        ctx.bezierCurveTo(
            -ww * 0.3, yy - hh * 0.55,
            -ww * 0.65, yy - hh * 0.22,
            -ww, yy
        );
        ctx.quadraticCurveTo(
            -ww * 0.55, yy + H * 0.035,
            0, yy - H * 0.015
        );
        ctx.quadraticCurveTo(
            ww * 0.55, yy + H * 0.035,
            ww, yy
        );
        ctx.bezierCurveTo(
            ww * 0.65, yy - hh * 0.22,
            ww * 0.3, yy - hh * 0.55,
            0, yy - hh
        );
        ctx.fill();

        // Snow on branches
        ctx.fillStyle = "#dbe8e7";

        ctx.beginPath();
        ctx.moveTo(0, yy - hh);
        ctx.quadraticCurveTo(
            -ww * 0.45, yy - hh * 0.38,
            -ww * 0.93, yy - H * 0.015
        );
        ctx.quadraticCurveTo(
            -ww * 0.52, yy + H * 0.018,
            -ww * 0.26, yy - H * 0.06
        );
        ctx.lineTo(-ww * 0.4, yy - H * 0.085);
        ctx.quadraticCurveTo(
            -ww * 0.1, yy - H * 0.13,
            0, yy - hh * 0.64
        );
        ctx.quadraticCurveTo(
            ww * 0.17, yy - H * 0.11,
            ww * 0.44, yy - H * 0.08
        );
        ctx.lineTo(ww * 0.27, yy - H * 0.06);
        ctx.quadraticCurveTo(
            ww * 0.7, yy + H * 0.02,
            ww * 0.93, yy - H * 0.015
        );
        ctx.quadraticCurveTo(
            ww * 0.45, yy - hh * 0.38,
            0, yy - hh
        );
        ctx.fill();
    }

    ctx.restore();
}

// =========================
// WINTER LANDSCAPE
// =========================

function drawLandscape() {
    ctx.clearRect(0, 0, w, h);

    // Background snowbank
    ctx.fillStyle = "#c6d9dc";
    ctx.beginPath();
    ctx.moveTo(0, h - 90);
    ctx.quadraticCurveTo(
        w * 0.3, h - 120,
        w * 0.6, h - 65
    );
    ctx.quadraticCurveTo(
        w * 0.8, h - 100,
        w, h - 110
    );
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Left evergreen
    tree(
        w * 0.10,
        h - 54,
        Math.min(450, h * 0.55, w * 0.54),
        Math.min(240, w * 0.25)
    );

    // Right evergreen
    tree(
        w * 0.90,
        h - 56,
        Math.min(400, h * 0.49, w * 0.49),
        Math.min(220, w * 0.24)
    );

    // Foreground snowbank
    ctx.fillStyle = "#e5eeee";
    ctx.beginPath();
    ctx.moveTo(0, h - 55);
    ctx.quadraticCurveTo(
        w * 0.25, h - 78,
        w * 0.5, h - 52
    );
    ctx.quadraticCurveTo(
        w * 0.8, h - 28,
        w, h - 64
    );
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
}

// =========================
// SCREEN RESIZING
// =========================

function resizeCanvas() {
    w = window.innerWidth;
    h = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawLandscape();
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

// =========================
// FALLING SNOW
// =========================

const snowflakes = Array.from({ length: 250 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 0.0008 + 0.0003,
    drift: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.5 + 0.3
}));

function drawSnow(time, delta) {

    snowflakes.forEach(flake => {

        flake.y += flake.speed * delta;

        if (flake.y > 1.02) {
            flake.y = -0.02;
            flake.x = Math.random();
        }

        const x = flake.x * w +
            Math.sin(time * 0.0006 + flake.drift) * 15;

        const y = flake.y * h;

        ctx.fillStyle =
            `rgba(255, 255, 255, ${flake.opacity})`;

        ctx.beginPath();
        ctx.arc(x, y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// =========================
// PAW PRINT SHAPES
// =========================

function drawPaw(x, y, size, angle, opacity, animal) {

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(size, size);

    ctx.fillStyle = `rgba(190, 215, 215, ${opacity})`;

    // Main paw pad
    ctx.beginPath();
    ctx.ellipse(0, 5, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Four toes
    const toes = [
        [-8, -3],
        [-3, -9],
        [3, -9],
        [8, -3]
    ];

    toes.forEach(([tx, ty]) => {

        ctx.beginPath();

        if (animal === "dog") {
            ctx.ellipse(
                tx, ty, 2.7, 3.5, 0, 0, Math.PI * 2
            );
        } else {
            ctx.ellipse(
                tx, ty, 3, 3, 0, 0, Math.PI * 2
            );
        }

        ctx.fill();

        // Claw marks for dogs only
        if (animal === "dog") {
            ctx.beginPath();
            ctx.ellipse(
                tx, ty - 5, 1.1, 1.8, 0, 0, Math.PI * 2
            );
            ctx.fill();
        }
    });

    ctx.restore();
}

// =========================
// RANDOM PAW TRAILS
// =========================

const walkingPaths = {};

function drawTrail(time, animal, name, size, spacing) {

    // Generate a new random walking path
    if (!walkingPaths[name] || time > walkingPaths[name].finish) {

        // Random starting position
        const startX = Math.random() * w;
        const startY = Math.random() * h;

        // Random walking direction
        const direction = Math.random() * Math.PI * 2;

        // Walking distance
        const distance = Math.hypot(w, h) *.5;
        const count = Math.ceil(distance / spacing);

        // Random starting delay
        const start = time + Math.random() * 1000;

        walkingPaths[name] = {
            startX,
            startY,
            direction,
            count,
            start,
            finish: start + count * 350 + 10000
        };
    }

    const path = walkingPaths[name];
    const phase = (time - path.start) / 1000;

    const dx = Math.cos(path.direction);
    const dy = Math.sin(path.direction);

    // Draw individual paw prints
    for (let i = 0; i < path.count; i++) {

        const age = phase - i * 0.35;

        if (age > 0 && age < 10) {

            // Alternate left and right paws
            const stagger = i % 2 ? 10 : -10;

            const x = path.startX + dx * i * spacing
                - dy * stagger;

            const y = path.startY + dy * i * spacing
                + dx * stagger;

            // Gradually fade the paw prints
            const opacity = Math.min(
                0.45, (10 - age) * 0.09
            );

            drawPaw(
                x, y, size,
                path.direction + Math.PI / 2,
                opacity, animal
            );
        }
    }
}

// =========================
// ANIMAL WALKING PATHS
// =========================

function drawPawPrints(time) {

    // Settings: animal, name, paw size, stride length

    // Blondie
    drawTrail(time, "dog", "Blondie", 1.8, 65);

    // Dagwood
    drawTrail(time, "dog", "Dagwood", 2.0, 70);

    // Feline Division
    drawTrail(time, "cat", "Cat", 1.3, 45);
}
// =========================
// ANIMAL WALKING PATHS
// =========================

function drawPawPrints(time) {

    // Blondie
    drawTrail(time, "dog", 0, 1.8, 65, 0);

    // Dagwood
    drawTrail(time, "dog", 4, 2.0, 70, 60);

    // Feline Division
    drawTrail(time, "cat", 8, 1.3, 45, 0);
}

// =========================
// ANIMATION LOOP
// =========================

let lastTime = 0;

function animate(time) {

    const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 3)
        : 1;

    lastTime = time;

    drawLandscape();
    drawPawPrints(time);
    drawSnow(time, delta);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);