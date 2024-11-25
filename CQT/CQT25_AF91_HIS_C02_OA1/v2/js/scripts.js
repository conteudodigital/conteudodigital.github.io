
// chama todos os elementos
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const creditButton = document.getElementById('credit-button');
const creditsModal = document.getElementById('credits-modal');
const tutorialScreen = document.getElementById('tutorial-screen');
const tutorialDialogo = document.querySelector('.textoDialogo');
const jogoDialogo = document.querySelector('.textoDialogoJogo');
const gameScreen = document.getElementById('game-screen');
const infoButtons = document.querySelectorAll('.info-btn');
const infoModal = document.getElementById('info-modal');
const infoImage = document.getElementById('info-image');
const moreInfoButton = document.getElementById('more-info-button');
const moreInfoModal = document.getElementById('more-info-modal');
const modals = document.querySelectorAll('.modal');
const closeElements = document.querySelectorAll('.close');

const infoPointsClicked = new Set();
const totalInfoPoints = infoButtons.length;
let index = 0;
let indexQuebra = 0;
let countTutorial = 0;
//infoId é o id do dialogo que vem do botão data-id
let infoId = 0;
const dialogosTutorial = [
    "Hoje vamos explorar um dos aspectos mais emblemáticos da Primeira Guerra Mundial: a Guerra de Trincheiras. A guerra de trincheiras é uma forma de combate que se destacou durante a Primeira Guerra Mundial, que ocorreu entre 1914 e 1918.",
    "Nesse estilo de guerra, soldados se abrigavam em longas linhas de trincheiras, ou seja, valas escavadas no solo que se estendiam por quilômetros. Nesses buracos, os soldados encontravam abrigo contra os disparos de artilharia e as balas inimigas. ",
    "A Guerra de Trincheiras surgiu a partir do impasse militar que se instaurou na Frente Ocidental, especialmente após a Batalha do Marne, em 1914. Com o avanço da tecnologia militar, principalmente no que diz respeito à artilharia, as tropas se viram obrigadas a buscar proteção em posições fixas.",
    "As trincheiras, com seus sistemas de comunicação e seu apoio logístico, foram a solução encontrada. Para compreender melhor como ocorria esse tipo de combate, interaja com o cenário a seguir!"
]

const dialogos = [
    [
        "Na retaguarda, ficavam as áreas de apoio logístico, onde suprimentos, munições e reforços eram preparados para garantir",
        "a sustentação da linha de frente. Os soldados na retaguarda desempenhavam um papel essencial, pois sem eles a sustentação",
        "das operações de combate seria impossível."
    ],
    [
        "Avançando para as segundas trincheiras, havia um nível adicional de defesa. Essas trincheiras estavam posicionadas",
        "mais atrás e serviam como uma linha de proteção caso a linha de frente fosse comprometida. Elas eram mais profundas e fortificadas,",
        "preparadas para abrigar tropas e permitir um contra-ataque, se necessário."
    ],
    [
        "Conectando essas áreas, havia os túneis. Esses corredores subterrâneos permitiam que os soldados se movimentassem",
        "de forma segura entre as trincheiras, evitando a exposição ao fogo inimigo."
    ],
    [
        "Chegamos à linha de frente, a primeira trincheira. Aqui, os soldados enfrentavam o horror do combate direto.",
        " Esse era o ponto mais próximo do inimigo, onde as condições eram extremas e o perigo estava sempre à espreita."
    ],
    [
        "E o que havia entre uma trincheira e outra? Uma faixa de terra devastada, repleta de crateras, arame farpado e,",
        "muitas vezes, minas terrestres. Essa era a chamada “terra de ninguém”, um lugar perigoso onde os soldados avançavam em ataques. "
    ]
]
const infoData = {
    1: 'teacher1.jpg',
    2: 'teacher2.jpg',
    3: 'teacher3.jpg'
};

// Inicia jogo
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    tutorialScreen.classList.remove('hidden');

    //coloca primeiro dialogo tutorial
    index = 0;
    animaTextoDialogo();
});

// Verifica pontos clicados
function checkInfoPoints() {
    if (infoPointsClicked.size === totalInfoPoints) {
        moreInfoButton.classList.remove('hidden');
    }
}

function continuaDialogoTutorial() {
    if (countTutorial >= dialogosTutorial.length - 1) {
        //finaliza tutorial
        tutorialScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        return;
    }
    console.log("tuto");
    countTutorial += 1;
    //tutorialDialogo.innerHTML = dialogosTutorial[countTutorial]
    tutorialDialogo.textContent = "";
    index = 0;
    animaTextoDialogo();
}
function continuaDialogo() {
    console.log("Dialogo Jogo",indexQuebra,dialogos[0].length-1);
    if (indexQuebra >= dialogos[infoId-1].length-1) {
        //finaliza tutorial
        console.log("Fim Jogo");
        infoModal.style.display = 'none';
        return;
    }
    console.log("indexQuebra");
    indexQuebra += 1;
    jogoDialogo.textContent = "";
    index = 0;
    animaTextoDialogoJogo();
}

function animaTextoDialogo() {
    if (index < dialogosTutorial[countTutorial].length) {
        tutorialDialogo.textContent += dialogosTutorial[countTutorial].charAt(index);
        index++;
        setTimeout(animaTextoDialogo, 10); // Adjust speed here (100 ms between each character)
    }
}
function animaTextoDialogoJogo() {
    if (index < dialogos[infoId-1][indexQuebra].length) {
        if (indexQuebra < dialogos[infoId-1].length) {
            jogoDialogo.textContent += dialogos[infoId-1][indexQuebra].charAt(index);
            index++;
            setTimeout(animaTextoDialogoJogo, 10); // Adjust speed here (100 ms between each character)    
        }

    }
}


//
//
//
//
//MODALS

creditButton.addEventListener('click', () => {
    creditsModal.style.display = 'block';
});

infoButtons.forEach(button => {
    button.addEventListener('click', () => {
        infoId = button.getAttribute('data-info');
        document.getElementById('a' + infoId).style.display = 'block';
        document.getElementById('a' + infoId).style.opacity = '0';
        document.getElementById('a' + infoId).style.transition = 'opacity 0.5s ease-in-out';
        document.getElementById('b' + infoId).style.display = 'block';
        document.getElementById('b' + infoId).style.opacity = '0';
        document.getElementById('b' + infoId).style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(function () {
            document.getElementById('a' + infoId).style.opacity = '1';
            document.getElementById('b' + infoId).style.opacity = '1';
        }, 100);
        setTimeout(function () {

            //infoImage.src = infoData[infoId];
            jogoDialogo.textContent = "";
            index = 0;
            indexQuebra = 0;
            animaTextoDialogoJogo();

            infoModal.style.display = 'block';
            infoPointsClicked.add(infoId);
            checkInfoPoints();
        }, 1000);

    });
});
moreInfoButton.addEventListener('click', () => {
    moreInfoModal.style.display = 'block';
});

closeElements.forEach(closeEl => {
    closeEl.addEventListener('click', () => {
        closeEl.parentElement.parentElement.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});
