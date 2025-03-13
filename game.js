const gameState = {
    money: 100,
    crops: [],
    waterLevel: 5, // Water system added
    soilQuality: 5 // Soil system added
};

const cropTypes = {
    wheat: { cost: 10, growTime: 5000, sellPrice: 20, image: "wheat.png" },
    carrot: { cost: 15, growTime: 8000, sellPrice: 30, image: "carrot.png" },
    corn: { cost: 20, growTime: 10000, sellPrice: 40, image: "corn.png" }
};

function plantCrop(type) {
    if (gameState.money >= cropTypes[type].cost && gameState.waterLevel > 0 && gameState.soilQuality > 0) {
        gameState.money -= cropTypes[type].cost;
        gameState.waterLevel -= 1; // Water used when planting
        gameState.soilQuality -= 1; // Soil depletes over time
        const crop = { type, plantedAt: Date.now() };
        gameState.crops.push(crop);
        renderGame();
        setTimeout(() => harvestCrop(crop), cropTypes[type].growTime);
    } else {
        alert("Not enough money, water, or soil quality too low!");
    }
}

function harvestCrop(crop) {
    gameState.money += cropTypes[crop.type].sellPrice;
    gameState.crops = gameState.crops.filter(c => c !== crop);
    renderGame();
}

function waterPlants() {
    if (gameState.money >= 5) {
        gameState.money -= 5;
        gameState.waterLevel += 3;
        renderGame();
    } else {
        alert("Not enough money to water plants!");
    }
}

function fertilizeSoil() {
    if (gameState.money >= 10) {
        gameState.money -= 10;
        gameState.soilQuality += 3;
        renderGame();
    } else {
        alert("Not enough money to fertilize soil!");
    }
}

function renderGame() {
    document.getElementById("money").innerText = `💰 Money: $${gameState.money}`;
    document.getElementById("waterLevel").innerText = `💧 Water Level: ${gameState.waterLevel}`;
    document.getElementById("soilQuality").innerText = `🌱 Soil Quality: ${gameState.soilQuality}`;
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
    document.getElementById("waterPlants").addEventListener("click", waterPlants);
    document.getElementById("fertilizeSoil").addEventListener("click", fertilizeSoil);
    renderGame();
});

