// app.js

let currentPlayer = 'X';
let gameBoard = [];
let gameActive = true;
let currentGameMode = null;
let humanPlayer = 'X';
let aiPlayer = 'O';
let isAITurn = false;
let currentLevel = 1;
let gridSize = 3;
let consecutiveWins = 0;
let winRequirements = 3;
let winsX = 0, winsO = 0;

(function init() {
    loadGameState();
    updateGameInfo();
})();

function setGameMode(mode) {
    currentGameMode = mode;
    document.getElementById('modeSelection').style.display = 'none';
    if (mode === 'pvai') {
        document.getElementById('sideSelection').style.display = 'block';
    } else {
        initializeGame();
    }
}

function setPlayerSide(side) {
    humanPlayer = side;
    aiPlayer = side === 'X' ? 'O' : 'X';
    document.getElementById('sideSelection').style.display = 'none';
    initializeGame();
}

function initializeGame() {
    document.getElementById('gameContainer').style.display = 'block';
    createBoard();
    resetGame();
}

function createBoard() {
    const boardContainer = document.getElementById('boardContainer');
    boardContainer.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board';
    board.style.gridTemplateColumns = `repeat(${gridSize}, minmax(50px, 80px))`;
    gameBoard = Array(gridSize * gridSize).fill('');
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.setAttribute('data-player', '');
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
    boardContainer.appendChild(board);
    updateGameInfo();
}

function handleCellClick(e) {
    if (!gameActive || (currentGameMode === 'pvai' && isAITurn)) return;
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));
    if (gameBoard[index] !== '') return;
    makeMove(cell, index, currentPlayer);
    if (currentGameMode === 'pvai' && gameActive) {
        isAITurn = true;
        setTimeout(makeAIMove, 500); // Trigger AI move after player's turn
    }
}

function makeMove(cell, index, player) {
    gameBoard[index] = player;
    cell.textContent = player;
    cell.setAttribute('data-player', player);
    if (checkWin(player)) {
        handleWin(player);
        return;
    }
    if (checkDraw()) {
        handleDraw();
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus();
}

function checkWin(player) {
    let winningCombo = [];
    const winLength = Math.min(gridSize, 3);
    // Check rows
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col <= gridSize - winLength; col++) {
            let win = true;
            const combo = [];
            for (let i = 0; i < winLength; i++) {
                const pos = row * gridSize + col + i;
                combo.push(pos);
                if (gameBoard[pos] !== player) win = false;
            }
            if (win) {
                winningCombo = combo;
                break;
            }
        }
        if (winningCombo.length) break;
    }
    // Check columns
    if (!winningCombo.length) {
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row <= gridSize - winLength; row++) {
                let win = true;
                const combo = [];
                for (let i = 0; i < winLength; i++) {
                    const pos = (row + i) * gridSize + col;
                    combo.push(pos);
                    if (gameBoard[pos] !== player) win = false;
                }
                if (win) {
                    winningCombo = combo;
                    break;
                }
            }
            if (winningCombo.length) break;
        }
    }
    // Check diagonals
    if (!winningCombo.length) {
        // Top-left to bottom-right
        for (let row = 0; row <= gridSize - winLength; row++) {
            for (let col = 0; col <= gridSize - winLength; col++) {
                let win = true;
                const combo = [];
                for (let i = 0; i < winLength; i++) {
                    const pos = (row + i) * gridSize + (col + i);
                    combo.push(pos);
                    if (gameBoard[pos] !== player) win = false;
                }
                if (win) {
                    winningCombo = combo;
                    break;
                }
            }
            if (winningCombo.length) break;
        }
        // Top-right to bottom-left
        if (!winningCombo.length) {
            for (let row = 0; row <= gridSize - winLength; row++) {
                for (let col = winLength - 1; col < gridSize; col++) {
                    let win = true;
                    const combo = [];
                    for (let i = 0; i < winLength; i++) {
                        const pos = (row + i) * gridSize + (col - i);
                        combo.push(pos);
                        if (gameBoard[pos] !== player) win = false;
                    }
                    if (win) {
                        winningCombo = combo;
                        break;
                    }
                }
                if (winningCombo.length) break;
            }
        }
    }
    if (winningCombo.length) {
        winningCombo.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winning-cell');
        });
        return true;
    }
    return false;
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function handleWin(player) {
    gameActive = false;
    let winMessage = '';
    if (currentGameMode === 'pvai') {
        if (player === humanPlayer) {
            winsX += humanPlayer === 'X' ? 1 : 0;
            winsO += humanPlayer === 'O' ? 1 : 0;
            consecutiveWins++;
            winMessage = `Good job! Wins: ${consecutiveWins}/${winRequirements}`;
            if (consecutiveWins >= winRequirements) {
                currentLevel++;
                gridSize++; // Increase grid size
                winRequirements = Math.min(gridSize, 5); // Update win requirements
                consecutiveWins = 0;
                setTimeout(() => {
                    alert(`Level up! Now playing on ${gridSize}x${gridSize}`);
                }, 1000);
            }
        } else {
            winsX += aiPlayer === 'X' ? 1 : 0; // Increment winsX if AI is 'X'
            winsO += aiPlayer === 'O' ? 1 : 0; // Increment winsO if AI is 'O'
            winMessage = 'AI wins!';
            consecutiveWins = 0;
            currentLevel = Math.max(1, currentLevel - 0.3);
        }
    } else {
        player === 'X' ? winsX++ : winsO++;
        winMessage = `Player ${player} wins!`;
    }
    updateStatus(winMessage);
    saveGameState();
    setTimeout(resetGame, 2000);
}

function handleDraw() {
    gameActive = false;
    updateStatus("Draw Game!");
    saveGameState();
    setTimeout(resetGame, 2000);
}

function makeAIMove() {
    if (!isAITurn || !gameActive) return;

    // Find moves
    const findWinningMove = player => {
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = player;
                if (checkWin(player)) {
                    gameBoard[i] = '';
                    return i;
                }
                gameBoard[i] = '';
            }
        }
        return -1;
    };

    // Try to win
    const winMove = findWinningMove(aiPlayer);
    if (winMove !== -1) {
        setTimeout(() => makeMove(document.querySelector(`[data-index="${winMove}"]`), winMove, aiPlayer), 500);
        isAITurn = false;
        return;
    }

    // Block player sometimes
    if (Math.random() < 0.8) {
        const blockMove = findWinningMove(humanPlayer);
        if (blockMove !== -1) {
            setTimeout(() => makeMove(document.querySelector(`[data-index="${blockMove}"]`), blockMove, aiPlayer), 500);
            isAITurn = false;
            return;
        }
    }

    // Prefer center/corners in 3x3
    if (gridSize === 3) {
        const center = 4;
        if (gameBoard[center] === '') {
            setTimeout(() => makeMove(document.querySelector(`[data-index="${center}"]`), center, aiPlayer), 500);
            isAITurn = false;
            return;
        }
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => gameBoard[i] === '');
        if (availableCorners.length > 0) {
            const move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            setTimeout(() => makeMove(document.querySelector(`[data-index="${move}"]`), move, aiPlayer), 500);
            isAITurn = false;
            return;
        }
    }

    // Random fallback
    const emptyCells = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    if (emptyCells.length > 0) {
        const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setTimeout(() => makeMove(document.querySelector(`[data-index="${move}"]`), move, aiPlayer), 500);
    }
    isAITurn = false;
}

function resetGame() {
    gameBoard = Array(gridSize * gridSize).fill('');
    gameActive = true;
    currentPlayer = 'X';
    createBoard(); // Recreate the board with updated gridSize
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.setAttribute('data-player', '');
        cell.classList.remove('winning-cell');
    });
    if (currentGameMode === 'pvai') {
        isAITurn = aiPlayer === 'X';
        if (isAITurn) makeAIMove(); // Ensure AI makes the first move if it starts
    }
    updateGameStatus();
}

function updateGameStatus() {
    document.getElementById('currentLevel').textContent = Math.ceil(currentLevel);
    document.getElementById('gridSize').textContent = `${gridSize}x${gridSize}`;
    document.getElementById('winsNeeded').textContent = winRequirements - consecutiveWins;
    document.getElementById('winsX').textContent = winsX;
    document.getElementById('winsO').textContent = winsO;
    const statusText = currentGameMode === 'pvai' ? 
        `Your turn ➤ (Level ${Math.ceil(currentLevel)})` : 
        `Current Player: ${currentPlayer}`;
    updateStatus(statusText);
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}

function resetProgress() {
    currentLevel = 1;
    consecutiveWins = 0;
    gridSize = 3;
    winRequirements = 3;
    winsX = 0;
    winsO = 0;
    saveGameState();
    resetGame();
}

function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({
        currentLevel: Math.ceil(currentLevel * 100) / 100,
        consecutiveWins,
        gridSize,
        winRequirements,
        winsX,
        winsO
    }));
}

function loadGameState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        const state = JSON.parse(saved);
        currentLevel = state.currentLevel || 1;
        consecutiveWins = state.consecutiveWins || 0;
        gridSize = state.gridSize || 3;
        winRequirements = state.winRequirements || 3;
        winsX = state.winsX || 0;
        winsO = state.winsO || 0;
    }
}
