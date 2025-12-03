const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const petals = [];

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.speed = 1 + Math.random() * 1.5;
        this.size = 5 + Math.random() * 10;
        this.angle = Math.random() * 2 * Math.PI;
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 1;
        this.angle += 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 192, 203, 0.8)";
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (petals.length < 50) petals.push(new Petal());

    petals.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.y > canvas.height) petals.splice(i, 1);
    });

    requestAnimationFrame(loop);
}

loop();
