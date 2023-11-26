const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides: {
        player1: "player-cards",
        player1box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel")
    },
};



const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
        DrawWith: [0]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
        DrawWith: [1]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
        DrawWith: [2]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.setAttribute("src", "./src/assets/icons/card-front.png");
    } else {
        cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    }

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(IdCard, fieldSide);
    })

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win!";
        await playAudio("Win");
        state.score.playerScore++;
    } else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Lose!";
        await playAudio("Lose");
        state.score.computerScore++
    } else if(playerCard.DrawWith.includes(computerCardId)){
        duelResults = "Draw!";
    }

    return duelResults;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.visibility = "visible";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function removeAllCardsImages(){
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.player1box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index,fieldSide) {
    if(fieldSide === state.playerSides.player1) {
        state.cardSprites.avatar.src = cardData[index].img;
        state.cardSprites.name.innerText = cardData[index].name;
        state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
    }    
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        console.log(fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "/src/assets/icons/card-front.png";
    state.actions.button.style.visibility = "hidden";

    state.cardSprites.name.innerText = "Select";
    state.cardSprites.type.innerText = "a card";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();