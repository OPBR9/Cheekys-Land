const gameState = {
    money: 100,
    crops: []
};

const cropTypes = {
    wheat: { cost: 10, growTime: 5000, sellPrice: 20, image: "wheat.png" },
    carrot: { cost: 15, growTime: 8000, sellPrice: 30, image: "carrot.png" },
    corn: { cost: 20, growTime: 10000, sellPrice: 40, image: "corn.png" }
};

function plantCrop(type) {
    if (gameState.money >= cropTypes[type].cost) {
        gameState.money -= cropTypes[type].cost;
        const crop = { type, plantedAt: Date.now() };
        gameState.crops.push(crop);
        renderGame();
        setTimeout(() => harvestCrop(crop), cropTypes[type].growTime);
    } else {
        alert("Not enough money!");
    }
}

function harvestCrop(crop) {
    gameState.money += cropTypes[crop.type].sellPrice;
    gameState.crops = gameState.crops.filter(c => c !== crop);
    renderGame();
}

function renderGame() {
    document.getElementById("money").innerText = `Money: $${gameState.money}`;
    document.getElementById("crops").innerHTML = gameState.crops.map(crop => `
        <div class="crop">
            <img src="${cropTypes[crop.type].image}" alt="${crop.type}" class="growing">
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("plantWheat").addEventListener("click", () => plantCrop("wheat"));
    document.getElementById("plantCarrot").addEventListener("click", () => plantCrop("carrot"));
    document.getElementById("plantCorn").addEventListener("click", () => plantCrop("corn"));
    renderGame();
});
