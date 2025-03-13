const gameState = {
    money: 100,
    crops: [],
    waterLevel: 5,
    soilQuality: 5,
    weather: "sunny",
    season: "Spring"
};

const cropTypes = {
    wheat: { cost: 10, growTime: 5000, sellPrice: 20, image: "wheat.png", seasons: ["Spring", "Summer"] },
    carrot: { cost: 15, growTime: 8000, sellPrice: 30, image: "carrot.png", seasons: ["Fall", "Winter"] },
    corn: { cost: 20, growTime: 10000, sellPrice: 40, image: "corn.png", seasons: ["Summer", "Fall"] }
};

const seasons = ["Spring", "Summer", "Fall", "Winter"];
let seasonIndex = 0;

function updateSeason() {
    seasonIndex = (seasonIndex + 1) % seasons.length;
    gameState.season = seasons[seasonIndex];
    renderGame();
}

function plantCrop(type) {
    if (gameState.money >= cropTypes[type].cost && gameState.waterLevel > 0 && gameState.soilQuality > 0) {
        if (!cropTypes[type].seasons.includes(gameState.season)) {
            alert("This crop cannot be planted in " + gameState.season + "!");
            return;
        }
        gameState.money -= cropTypes[type].cost;
        gameState.waterLevel -= 1;
        gameState.soilQuality -= 1;
        const crop = { type, plantedAt: Date.now(), growTime: cropTypes[type].growTime };
        gameState.crops.push(crop);
        renderGame();
        setTimeout(() => harvestCrop(crop), crop.growTime);
    } else {
        alert("Not enough money, water, or soil quality too low!");
    }
}

function openShop() {
    document.getElementById("shopModal").style.display = "block";
}

document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("shopModal").style.display = "none";
});

document.getElementById("buyWater").addEventListener("click", () => {
    if (gameState.money >= 5) {
        gameState.money -= 5;
        gameState.waterLevel += 3;
        renderGame();
    } else {
        alert("Not enough money!");
    }
});

document.getElementById("buyFertilizer").addEventListener("click", () => {
    if (gameState.money >= 10) {
        gameState.money -= 10;
        gameState.soilQuality += 3;
        renderGame();
    } else {
        alert("Not enough money!");
    }
});

document.getElementById("buySeeds").addEventListener("click", () => {
    if (gameState.money >= 15) {
        gameState.money -= 15;
        gameState.money += 5; // Bonus money
        renderGame();
    } else {
        alert("Not enough money!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("plantWheat").addEventListener("click", () => plantCrop("wheat"));
    document.getElementById("plantCarrot").addEventListener("click", () => plantCrop("carrot"));
    document.getElementById("plantCorn").addEventListener("click", () => plantCrop("corn"));
    document.getElementById("openShop").addEventListener("click", openShop);
    setInterval(updateSeason, 30000); // Change season every 30 seconds
    renderGame();
});

function renderGame() {
    document.getElementById("money").innerText = `💰 Money: $${gameState.money}`;
    document.getElementById("waterLevel").innerText = `💧 Water Level: ${gameState.waterLevel}`;
    document.getElementById("soilQuality").innerText = `🌱 Soil Quality: ${gameState.soilQuality}`;
    document.getElementById("weather").innerText = `☀️ Weather: ${gameState.weather.charAt(0).toUpperCase() + gameState.weather.slice(1)}`;
    document.getElementById("season").innerText = `🍂 Season: ${gameState.season}`;
    document.getElementById("crops").innerHTML = gameState.crops.map(crop => `
        <div class="crop">
            <img src="${cropTypes[crop.type].image}" alt="${crop.type}" class="growing">
        </div>
    `).join("");
}
