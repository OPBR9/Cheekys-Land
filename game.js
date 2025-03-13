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
    const shopItems = [
        { name: "Water Refill", cost: 5, action: () => gameState.waterLevel += 3 },
        { name: "Fertilizer", cost: 10, action: () => gameState.soilQuality += 3 },
        { name: "New Seeds", cost: 15, action: () => gameState.money += 5 }
    ];
    
    let shopMenu = "Welcome to the Shop!\n";
    shopItems.forEach((item, index) => {
        shopMenu += `${index + 1}. ${item.name} - $${item.cost}\n`;
    });
    
    const choice = prompt(shopMenu + "Enter the number of the item you want to buy:");
    const selectedItem = shopItems[parseInt(choice) - 1];
    
    if (selectedItem && gameState.money >= selectedItem.cost) {
        gameState.money -= selectedItem.cost;
        selectedItem.action();
        renderGame();
    } else {
        alert("Invalid choice or not enough money!");
    }
}

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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("plantWheat").addEventListener("click", () => plantCrop("wheat"));
    document.getElementById("plantCarrot").addEventListener("click", () => plantCrop("carrot"));
    document.getElementById("plantCorn").addEventListener("click", () => plantCrop("corn"));
    document.getElementById("waterPlants").addEventListener("click", () => gameState.waterLevel += 3);
    document.getElementById("fertilizeSoil").addEventListener("click", () => gameState.soilQuality += 3);
    document.getElementById("openShop").addEventListener("click", openShop);
    setInterval(updateSeason, 30000); // Change season every 30 seconds
    renderGame();
});
