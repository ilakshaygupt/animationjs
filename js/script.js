const canvas = document.getElementById('gameCanvas');
const createAtomBtn = document.getElementById('createAtomBtn');
const ctx = canvas.getContext('2d');
const atoms = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createAtom(x, y, element) {
    atoms.push({
        x,
        y,
        element,
        velocityX: Math.random() * 2 + 1,
        velocityY: Math.random() * 2 + 1,
    });
}

function drawAtom(x, y, element) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(element, x - 7, y + 7);
}

function moveAtoms() {
    atoms.forEach(atom => {
        atom.x += atom.velocityX;
        atom.y += atom.velocityY;

        // Bounce off the edges
        if (atom.x - 25 < 0 || atom.x + 25 > canvas.width) {
            atom.velocityX *= -1;
        }
        if (atom.y - 25 < 0 || atom.y + 25 > canvas.height) {
            atom.velocityY *= -1;
        }
    });
}

//continuously draw
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveAtoms();
    atoms.forEach(atom => {
        drawAtom(atom.x, atom.y, atom.element);
    });
    requestAnimationFrame(gameLoop);
}



createAtomBtn.addEventListener('click', () => {
    const x = Math.random() * (canvas.width - 50) + 40;
    const y = Math.random() * (canvas.height - 50) + 40;
    createAtom(x, y, 'H');
});



gameLoop();
