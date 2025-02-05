const boardElement = document.getElementById('board');
const winnerMessage = document.getElementById('winnerMessage');
const congratulationsMessage = document.getElementById('congratulationsMessage');
const resetButton = document.getElementById('reset');
let size = 3; // Start with a 3x3 board
let board = [];
let currentPlayer = 'X';

function initializeBoard() {
    boardElement.innerHTML = '';
    board = Array.from({ length: size }, () => Array(size).fill(''));
    winnerMessage.textContent = '';
    congratulationsMessage.textContent = '';

    boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 50px)`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] === '' && !winnerMessage.textContent) {
        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer === 'X' ? 'player-x' : 'player-o');

        if (checkWin(currentPlayer)) {
            winnerMessage.textContent = `Player ${currentPlayer} wins!`;
            congratulationsMessage.textContent = `Congratulations, Player ${currentPlayer}!`;
            setTimeout(() => {
                size = size < 5 ? size + 1 : 3; // Increment size or reset to 3
                initializeBoard();
            }, 2000);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWin(player) {
    // Check all rows
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === player)) {
            return true;
        }
    }

    // Check all columns
    for (let j = 0; j < size; j++) {
        if (board.map(row => row[j]).every(cell => cell === player)) {
            return true;
        }
    }

    // Check diagonals
    if (board.map((row, i) => row[i]).every(cell => cell === player)) {
        return true;
    }
    if (board.map((row, i) => row[size - 1 - i]).every(cell => cell === player)) {
        return true;
    }

    return false;
}

resetButton.addEventListener('click', initializeBoard);
initializeBoard();
