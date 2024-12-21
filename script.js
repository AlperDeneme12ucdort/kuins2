// script.js
const boardSize = 8; // 8x8 grid
const gameBoard = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const messageContainer = document.querySelector('.message');

// Initialize the game
let queens = [];
let placedQueens = 0;

// Create board grid
function createBoard() {
    gameBoard.innerHTML = ''; // Reset board
    queens = [];
    placedQueens = 0;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if ((row + col) % 2 === 0) square.classList.add('even');
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', placeQueen);
            gameBoard.appendChild(square);
        }
    }
}

// Place a queen on the grid
function placeQueen(event) {
    const square = event.target;

    // Check if the square already has a queen
    if (square.querySelector('.queen')) return;

    // Create a new queen element
    const queen = document.createElement('div');
    queen.classList.add('queen');
    square.appendChild(queen);

    // Update the queens array with its position
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    queens.push({ row, col });

    placedQueens++;

    // Check for conflicts
    if (checkConflicts()) {
        messageContainer.textContent = 'Conflict detected! Try again.';
    } else {
        messageContainer.textContent = `Queens placed: ${placedQueens}`;
    }

    // If all queens are placed correctly
    if (placedQueens === boardSize && !checkConflicts()) {
        messageContainer.textContent = 'Congratulations! All queens are placed correctly!';
    }
}

// Check if any queens are in conflict
function checkConflicts() {
    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const q1 = queens[i];
            const q2 = queens[j];

            // Check if queens are in the same row, column, or diagonal
            if (
                q1.row === q2.row ||
                q1.col === q2.col ||
                Math.abs(q1.row - q2.row) === Math.abs(q1.col - q2.col)
            ) {
                return true;
            }
        }
    }
    return false;
}

// Reset the game
resetBtn.addEventListener('click', createBoard);

// Initialize game on load
createBoard();
