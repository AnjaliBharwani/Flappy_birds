// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the game elements
    var bird = document.getElementById("bird");
    var gameArea = document.getElementById("gameArea");
    var startBtn = document.getElementById("startBtn");
    var restartBtn = document.getElementById("restartBtn");
    var scoreDisplay = document.getElementById("score");
    var dieSound = document.getElementById("dieSound");
    var hitSound = document.getElementById("hitSound");
    var pointSound = document.getElementById("pointSound");
    var wingSound = document.getElementById("wingSound");

    // Define initial game state
    var birdY = 200, birdVelocity = 0;
    var gravity = 0.5;
    var gameInterval, obstacleInterval;
    var score = 0;
    var gameOver = false;

    // Function to start the game
    function startGame() {
        // Reset bird position, score, and game state
        birdY = 200;
        birdVelocity = 0;
        score = 0;
        scoreDisplay.innerText = "Score: " + score;
        gameOver = false;
        startBtn.style.display = "none";
        restartBtn.style.display = "none";

        // Set up game update interval
        gameInterval = setInterval(updateGameArea, 20);

        // Set up obstacle generation interval
        obstacleInterval = setInterval(addObstacle, 2000);

        // Add event listener for jump
        window.addEventListener("keydown", jump);
        window.addEventListener("click", mouseJump);

        // Clear any remaining obstacles from previous game
        clearObstacles();
    }

    // Function to handle bird jump
    function jump(e) {
        if (e.code === "Space" && !gameOver) {
            birdVelocity = -10;
            wingSound.play();
        }
    }

    function mouseJump(e) {
        console.log(e);
        if (!gameOver) {
            birdVelocity = -10;
            wingSound.play();
        }

    }

    // Function to update the game area
    function updateGameArea() {
        // Apply gravity to bird
        birdY += birdVelocity;
        birdVelocity += gravity;
        bird.style.top = birdY + "px";

        // Check for game over conditions
        checkGameOver();
    }

    // Function to add a new obstacle
    function addObstacle() {
        // Create obstacle element
        var obstacle = document.createElement("div");
        obstacle.className = "obstacle";
        var obstacleHeight = Math.random() * (gameArea.clientHeight - 300) + 50;
        obstacle.style.height = obstacleHeight + "px";
        obstacle.style.top = (Math.random() * (gameArea.clientHeight - obstacleHeight)) + "px";
        gameArea.appendChild(obstacle);

        // Function to move the obstacle
        function moveObstacle() {
            var obstacleRight = parseInt(obstacle.style.right, 10) || 0;
            obstacle.style.right = (obstacleRight + 5) + "px";

            // Remove obstacle and increase score if it moves past the screen
            if (obstacleRight > gameArea.clientWidth) {
                gameArea.removeChild(obstacle);
                score++;
                scoreDisplay.innerText = "Score: " + score;
                pointSound.play();
            }

            // Clear interval if the game is over
            if (gameOver) {
                clearInterval(moveInterval);
            }
        }

        // Set interval to move the obstacle
        var moveInterval = setInterval(moveObstacle, 20);
    }

    // Function to clear all obstacles
    function clearObstacles() {
        var existingObstacles = document.getElementsByClassName("obstacle");
        while (existingObstacles[0]) {
            existingObstacles[0].parentNode.removeChild(existingObstacles[0]);
        }
    }

    // Function to check game over conditions
    function checkGameOver() {
        // Check if the bird hits the top or bottom of the game area
        if (birdY < 0 || birdY + bird.clientHeight > gameArea.clientHeight) {
            endGame();
        }

        // Check for collisions with obstacles
        var obstacles = document.getElementsByClassName("obstacle");
        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (bird.getBoundingClientRect().right > obstacle.getBoundingClientRect().left &&
                bird.getBoundingClientRect().left < obstacle.getBoundingClientRect().right &&
                bird.getBoundingClientRect().bottom > obstacle.getBoundingClientRect().top &&
                bird.getBoundingClientRect().top < obstacle.getBoundingClientRect().bottom) {
                endGame();
            }
        }
    }

    // Function to handle game over
    function endGame() {
        gameOver = true;
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        restartBtn.style.display = "block";
        hitSound.play();

    }

    // Event listeners for start and restart buttons
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", function () {
        scoreDisplay.innerText = "Score: 0";
        startGame();
    });
});
