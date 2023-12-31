const canvas = document.getElementById('gameCanvas');
const createAtomBtn = document.getElementById('createAtomBtn');
const ctx = canvas.getContext('2d');
const atoms = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("goBackBtn").addEventListener("click", () => {

    window.location.href = "index.html";
});

const atomDegrees = {
    'H': 'He',
    'He': 'Li',
    'Li': 'Be'
  ,
};
const atomColors = {
    'H': '#3498db', 
    'He': '#e74c3c', 
    'Li': '#2ecc71', 
    'Be': '#f1c40f',
};

function createAtom(x, y, element) {
    atoms.push({
        x,
        y,
        element,
        velocityX: (Math.random() - 0.5) * 8,//increased randomness
        velocityY: (Math.random() - 0.5) * 8,
    });
}

function drawAtom(x, y, element) {
     const color = atomColors[element] ;
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '35px Arial';
    ctx.fillText(element,x-10,y);
    ctx.textalign='center';
    ctx.textBaseline='middle';
}

function moveAtoms() {
    atoms.forEach(atom => {
        atom.x += atom.velocityX;
        atom.y += atom.velocityY;
        if (atom.x - 45 < 0 ) {
            atom.velocityX *= -1;//change speed in oppsotie direction
            atom.x = 45;//set coordinate so it doesnt go off canvas
        }
        else if(atom.x + 45 > canvas.width){
            atom.velocityX *= -1;
            atom.x = canvas.width-45;
        }
        if (atom.y - 45 < 0 ) {
            atom.velocityY *= -1;
            atom.y = 45;
        }
        else if( atom.y + 45 > canvas.height){
            atom.velocityY *= -1;
            atom.y = canvas.height-45;

        }
    });
}

function checkAtomCollision() {
    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const atom1 = atoms[i];
            const atom2 = atoms[j];
            const distance = Math.sqrt((atom1.x - atom2.x) ** 2 + (atom1.y - atom2.y) ** 2);
            if(distance<90 && atom1.element == 'Be' && atom2.element == 'Be'){
                atoms.splice(i, 1);
                atoms.splice(j - 1, 1);
            }
            else if (distance < 90 && atom1.element == atom2.element) {
                const newDegree = atomDegrees[atom1.element];
                if (newDegree) {
                    createAtom(atom1.x, atom1.y, newDegree);
                    atoms.splice(i, 1);
                    atoms.splice(j - 1, 1);
                }
            }
            else if(distance<90 && atom1.element != atom2.element){
                  // Calculate the angle between atoms
                  const dx = atom2.x - atom1.x;
                  const dy = atom2.y - atom1.y;
                  const angle = Math.atan2(dy, dx);
                  // Calculate new velocities after collision
                  const v1i = atom1.velocityX * Math.cos(angle) + atom1.velocityY * Math.sin(angle);
                  const v2i = atom2.velocityX * Math.cos(angle) + atom2.velocityY * Math.sin(angle);
                  const v1f = v2i;
                  const v2f = v1i;
                  // Update velocities after collision
                  atom1.velocityX = v1f * Math.cos(angle)*1.2;
                  atom1.velocityY = v1f * Math.sin(angle)*1.2;
                  atom2.velocityX = v2f * Math.cos(angle)*1.2;
                  atom2.velocityY = v2f * Math.sin(angle)*1.2;

                  //icnreased speed stationary atoms
                  if (Math.abs(atom1.velocityX) < 1.5 || Math.abs(atom1.velocityY) < 1.5) {
                    atom1.velocityX = -0.4 * 8;
                    atom1.velocityY = -0.4 * 8;
                    
                  }
                  if (Math.abs(atom2.velocityX) < 1.5 || Math.abs(atom2.velocityY) < 1.5) {
                    atom2.velocityX =   0.4 * 8;
                    atom2.velocityY =   0.4 * 8;
                    
                  }
                  // Move atoms away to avoid sticking
                  const overlap = 90 - distance;
                  atom1.x -= overlap * Math.cos(angle);
                  atom1.y -= overlap * Math.sin(angle);
                  atom2.x += overlap * Math.cos(angle);
                  atom2.y += overlap * Math.sin(angle);
            }
        }
    }
}
function updateAtomCounts() {
    let HatomCount = 0;
    let HeatomCount = 0;
    let LiatomCount = 0;
    let BeatomCount = 0;
    atoms.forEach(atom => {
        if(atom.element=='H') {
            HatomCount++;
        }
        else if(atom.element=='He') {
            HeatomCount++;
        }
        else if(atom.element=='Li') {
            LiatomCount++;
        }
        else if(atom.element=='Be') {
            BeatomCount++;
        }
    });
    document.getElementById("HatomCount").textContent = `H : ${HatomCount}`;
    document.getElementById("HeatomCount").textContent = `He : ${HeatomCount}`;
    document.getElementById("LiatomCount").textContent = `Li : ${LiatomCount}`;
    document.getElementById("BeatomCount").textContent = `Be : ${BeatomCount}`;
}


function restartGame() {
    atoms.forEach(atom => {
        atom.velocityX=0;
        atom.velocityY=0;
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atoms.length = 0; 
    updateAtomCounts();
    gameLoop();
}

//continuously draw
function gameLoop() {
    moveAtoms();
    updateAtomCounts();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    checkAtomCollision();
    atoms.forEach(atom => {
        drawAtom(atom.x, atom.y, atom.element);
    });
    requestAnimationFrame(gameLoop);
}
createAtomBtn.addEventListener('click', () => {
    const x = Math.random() * (canvas.width - 90) ;
    const y = Math.random() * (canvas.height - 90) ;
    createAtom(x, y, 'H');
});


gameLoop();
