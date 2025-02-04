const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const congratulations = document.getElementById('congratulations');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (board[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  board[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  // Apply color based on the current player
  if (currentPlayer === 'X') {
    clickedCell.style.backgroundColor = '#ffcccb'; // Light red for X
  } else {
    clickedCell.style.backgroundColor = '#add8e6'; // Light blue for O
  }

  checkResult();
}

function checkResult() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    message.textContent = `Player ${currentPlayer} has won!`;
    congratulations.classList.remove('hidden');
    congratulations.style.display = 'block';
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    message.textContent = 'Game ended in a draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  message.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.backgroundColor = ''; // Reset background color
  });
  congratulations.classList.add('hidden');
  congratulations.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
