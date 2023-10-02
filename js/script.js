const canvas = document.getElementById('gameCanvas');
const createAtomBtn = document.getElementById('createAtomBtn');
const ctx = canvas.getContext('2d');
const atoms = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const atomDegrees = {
    'H': 'He',
    'He': 'Li',
    'Li': 'Be'
  ,
};

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

function checkAtomCollision() {
    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const atom1 = atoms[i];
            const atom2 = atoms[j];
            const distance = Math.sqrt((atom1.x - atom2.x) ** 2 + (atom1.y - atom2.y) ** 2);

            if (distance < 50 && atom1.element === atom2.element) {
                const newDegree = atomDegrees[atom1.element];
                if (newDegree) {
                    createAtom(atom1.x, atom1.y, newDegree);
                    atoms.splice(i, 1);
                    atoms.splice(j - 1, 1);
                }
            }
        }
    }
}

//continuously draw
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveAtoms();
    checkAtomCollision();
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
