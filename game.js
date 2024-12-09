// game.js

// 1. Set up the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 2. Resize the canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 3. Define game objects
const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5, // Normal speed
};

let blocks = []; // Array to hold blocks to be collected
let blocksCollected = 0; // Counter for collected blocks
let level = 1; // Starting level
let totalBlocks = 1; // Starting number of blocks at level 1

// 4. Define the enemy block
const enemyBlock = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 3,
};

// 5. Input handling
let keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// 6. FPS control
const targetFPS = 120; // Increase frame rate to 120 FPS
let lastFrameTime = 0;

// 7. Game loop (update and render)
function gameLoop(timestamp) {
    // Throttle frame rate to target FPS
    if (timestamp - lastFrameTime < 1000 / targetFPS) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = timestamp;

    // Update game state
    update();

    // Render game state
    render();

    // Call the game loop again
    requestAnimationFrame(gameLoop);
}

// 8. Update game state
function update() {
    // Handle player movement efficiently
    if (keys["ArrowUp"] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys["ArrowDown"] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Move the enemy block towards the player
    moveEnemyTowardsPlayer();

    // Check if player collides with any block
    blocks.forEach((block, index) => {
        if (checkCollision(player, block)) {
            blocks.splice(index, 1); // Remove the block from the array
            blocksCollected++; // Increment the collected blocks counter
        }
    });

    // If all blocks are collected, move to the next level
    if (blocksCollected === totalBlocks) {
        levelUp();
    }

    // Check if the player collides with the enemy block
    if (checkCollision(player, enemyBlock)) {
        resetGame(); // Reset the game if collided with enemy block
    }
}

// 9. Check for collision between player and any block or enemy block
function checkCollision(player, block) {
    return (
        player.x < block.x + block.width &&
        player.x + player.width > block.x &&
        player.y < block.y + block.height &&
        player.y + player.height > block.y
    );
}

// 10. Move the enemy block towards the player
function moveEnemyTowardsPlayer() {
    const dx = player.x - enemyBlock.x;
    const dy = player.y - enemyBlock.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
        // Move the enemy in the normalized direction towards the player
        enemyBlock.x += (dx / distance) * enemyBlock.speed;
        enemyBlock.y += (dy / distance) * enemyBlock.speed;
    }
}

// 11. Move to the next level and increase block count
function levelUp() {
    level++; // Increase the level
    totalBlocks++; // Increase the number of blocks to collect for the next level
    blocksCollected = 0; // Reset the collected blocks counter
    generateBlocks(); // Generate new blocks for the next level
}

// 12. Generate blocks randomly based on the current level
function generateBlocks() {
    blocks = []; // Reset blocks array
    for (let i = 0; i < totalBlocks; i++) {
        blocks.push({
            x: Math.random() * (canvas.width - 50), // Random x position
            y: Math.random() * (canvas.height - 50), // Random y position
            width: 50,
            height: 50,
            color: "green", // Color of the block
        });
    }
}

// 13. Reset the game
function resetGame() {
    // Reset the player’s position
    player.x = 50;
    player.y = canvas.height / 2;
    
    // Reset the enemy block’s position
    enemyBlock.x = canvas.width - 100;
    enemyBlock.y = canvas.height / 2;
    
    // Reset the blocks and collected count
    blocksCollected = 0;
    blocks = [];
    level = 1;
    totalBlocks = 1;
    
    // Generate new blocks for level 1
    generateBlocks();
}

// 14. Render game state
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw the blocks
    blocks.forEach((block) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });

    // Draw the enemy block
    ctx.fillStyle = "red";
    ctx.fillRect(enemyBlock.x, enemyBlock.y, enemyBlock.width, enemyBlock.height);

    // Display the level and number of blocks collected
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Level: ${level}`, 10, 30);
    ctx.fillText(`Blocks Collected: ${blocksCollected}/${totalBlocks}`, 10, 60);
}

// Start the game
generateBlocks(); // Generate blocks for level 1
requestAnimationFrame(gameLoop); // Start the game loop
