const gameState = {
    money: 100,
    crops: [],
    waterLevel: 5, // Water system
    soilQuality: 5, // Soil system
    weather: "sunny" // Weather system added
};

const cropTypes = {
    wheat: { cost: 10, growTime: 5000, sellPrice: 20, image: "wheat.png" },
    carrot: { cost: 15, growTime: 8000, sellPrice: 30, image: "carrot.png" },
    corn: { cost: 20, growTime: 10000, sellPrice: 40, image: "corn.png" }
};

const weatherEffects = {
    sunny: { waterChange: -1, growthBoost: 1 },
    rainy: { waterChange: +2, growthBoost: 0.8 },
    stormy: { waterChange: +1, growthBoost: 1.2, cropLossChance: 0.2 },
    drought: { waterChange: -3, growthBoost: 1.5 }
};

function updateWeather() {
    const weatherTypes = ["sunny", "rainy", "stormy", "drought"];
    gameState.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const effect = weatherEffects[gameState.weather];
    gameState.waterLevel += effect.waterChange;
    gameState.waterLevel = Math.max(0, gameState.waterLevel);

    if (gameState.weather === "stormy") {
        gameState.crops = gameState.crops.filter(() => Math.random() > effect.cropLossChance);
    }

    renderGame();
}

function plantCrop(type) {
    if (gameState.money >= cropTypes[type].cost && gameState.waterLevel > 0 && gameState.soilQuality > 0) {
        gameState.money -= cropTypes[type].cost;
        gameState.waterLevel -= 1;
        gameState.soilQuality -= 1;
        const crop = { type, plantedAt: Date.now(), growTime: cropTypes[type].growTime * weatherEffects[gameState.weather].growthBoost };
        gameState.crops.push(crop);
        renderGame();
        setTimeout(() => harvestCrop(crop), crop.growTime);
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
    document.getElementById("weather").innerText = `☀️ Weather: ${gameState.weather.charAt(0).toUpperCase() + gameState.weather.slice(1)}`;
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
    setInterval(updateWeather, 10000); // Change weather every 10 seconds
    renderGame();
});
