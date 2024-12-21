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
// script.js güncellemesi

let queens = [];
let placedQueens = 0;
let threatenedSquares = []; // Tehdit altındaki karelerin listesi

// Çarpı işaretini ekleme
function addXMark(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('x-marked');
    const xMark = document.createElement('div');
    xMark.classList.add('x-mark');
    xMark.textContent = 'X';
    square.appendChild(xMark);
}

// Çarpı işaretlerini kaldırma
function clearXMarks() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('x-marked');
        const xMark = square.querySelector('.x-mark');
        if (xMark) {
            square.removeChild(xMark);
        }
    });
}

// Queen yerleştirildiğinde tehdit edilen kareleri işaretleme
function markThreatenedSquares() {
    threatenedSquares = []; // Önceki tehditleri sıfırlıyoruz

    queens.forEach(queen => {
        const row = queen.row;
        const col = queen.col;

        // Aynı satırdaki kareler
        for (let i = 0; i < boardSize; i++) {
            if (i !== col) threatenedSquares.push({ row, col: i }); // Aynı satırdaki kareleri işaretle
            if (i !== row) threatenedSquares.push({ row: i, col }); // Aynı sütundaki kareleri işaretle
        }

        // Çaprazdaki kareler
        for (let i = -boardSize; i < boardSize; i++) {
            if (row + i >= 0 && row + i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row + i, col: col + i }); // Sol üst- sağ alt çapraz
            }
            if (row - i >= 0 && row - i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row - i, col: col + i }); // Sol alt - sağ üst çapraz
            }
        }
    });

    // Tehdit altındaki kareleri işaretle
    threatenedSquares.forEach(pos => {
        addXMark(pos.row, pos.col);
    });
}

// Tahtayı yeniden oluştururken tehdit edilen kareleri kontrol etme
function createBoard() {
    gameBoard.innerHTML = '';
    queens = [];
    placedQueens = 0;
    threatenedSquares = []; // Önceki tehditleri sıfırlıyoruz
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
    markThreatenedSquares(); // Tahta oluşturulurken tehdit altındaki kareleri işaretle
}

// Queen yerleştirildiğinde tehdit edilen karelere çarpı ekle
function placeQueen(event) {
    const square = event.target;

    // Eğer karede zaten bir queen varsa, bir şey yapma
    if (square.querySelector('.queen')) return;

    // Kareye queen ekle
    const queen = document.createElement('div');
    queen.classList.add('queen');
    square.appendChild(queen);

    // Queen'in konumunu kaydet
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    queens.push({ row, col });
    placedQueens++;

    // Tehdit altındaki kareleri işaretle
    markThreatenedSquares();

    // Eğer conflict varsa, uyarı ver
    if (checkConflicts()) {
        messageContainer.textContent = 'Conflict detected! Try again.';
    } else {
        messageContainer.textContent = `Queens placed: ${placedQueens}`;
    }

    // Eğer tüm queen'ler yerleştirildiyse
    if (placedQueens === boardSize && !checkConflicts()) {
        messageContainer.textContent = 'Congratulations! All queens are placed correctly!';
    }
}

// Çarpı işareti eklemek için kullanılacak fonksiyonu çağırıyoruz
function checkConflicts() {
    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const q1 = queens[i];
            const q2 = queens[j];

            // Çatışma kontrolü: Aynı satır, sütun veya çapraz
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
// script.js güncellemesi

let queens = [];
let placedQueens = 0;
let threatenedSquares = [];
let undoStack = []; // Undo stack (geri alma yığını)

// Çarpı işareti ekleme fonksiyonu (önceki adımlarda belirtildi)
function addXMark(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('x-marked');
    const xMark = document.createElement('div');
    xMark.classList.add('x-mark');
    xMark.textContent = 'X';
    square.appendChild(xMark);
}

// Çarpı işaretlerini temizleme fonksiyonu
function clearXMarks() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('x-marked');
        const xMark = square.querySelector('.x-mark');
        if (xMark) {
            square.removeChild(xMark);
        }
    });
}

// Queen yerleştirildiğinde tehdit edilen kareleri işaretleme
function markThreatenedSquares() {
    threatenedSquares = []; // Önceki tehditleri sıfırlıyoruz

    queens.forEach(queen => {
        const row = queen.row;
        const col = queen.col;

        // Aynı satırdaki kareler
        for (let i = 0; i < boardSize; i++) {
            if (i !== col) threatenedSquares.push({ row, col: i }); // Aynı satırdaki kareleri işaretle
            if (i !== row) threatenedSquares.push({ row: i, col }); // Aynı sütundaki kareleri işaretle
        }

        // Çaprazdaki kareler
        for (let i = -boardSize; i < boardSize; i++) {
            if (row + i >= 0 && row + i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row + i, col: col + i }); // Sol üst- sağ alt çapraz
            }
            if (row - i >= 0 && row - i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row - i, col: col + i }); // Sol alt - sağ üst çapraz
            }
        }
    });

    // Tehdit altındaki kareleri işaretle
    threatenedSquares.forEach(pos => {
        addXMark(pos.row, pos.col);
    });
}

// Undo işlemi
function undo() {
    if (undoStack.length === 0) return; // Eğer undo yapılacak bir hamle yoksa, hiçbir şey yapma

    // Son yapılan queen'i geri al
    const lastMove = undoStack.pop();
    const square = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    square.innerHTML = ''; // Queen'i tahtadan kaldırıyoruz

    queens = queens.filter(queen => queen.row !== lastMove.row || queen.col !== lastMove.col);
    placedQueens--;

    // Tehdit altındaki kareleri yeniden işaretle
    markThreatenedSquares();

    updateUndoButton(); // Geri al butonunun durumunu güncelle
    messageContainer.textContent = `Queen removed. Total queens: ${placedQueens}`;
}

// Geri al butonunun aktif/pasif durumunu güncelleme
function updateUndoButton() {
    if (undoStack.length > 0) {
        document.getElementById('undoButton').disabled = false; // Eğer geri alınacak hamle varsa, buton aktif
    } else {
        document.getElementById('undoButton').disabled = true; // Eğer geri alınacak hamle yoksa, buton pasif
    }
}

// Tahtayı oluşturma ve oyun kurma
function createBoard() {
    gameBoard.innerHTML = '';
    queens = [];
    placedQueens = 0;
    threatenedSquares = [];
    undoStack = []; // Undo stack temizleniyor

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

    markThreatenedSquares();
    updateUndoButton(); // Geri al butonunun durumunu güncelle
}

// Queen yerleştirme
function placeQueen(event) {
    const square = event.target;

    // Eğer karede zaten bir queen varsa, bir şey yapma
    if (square.querySelector('.queen')) return;

    // Queen'i yerleştir
    const queen = document.createElement('div');
    queen.classList.add('queen');
    square.appendChild(queen);

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    queens.push({ row, col });
    placedQueens++;

    // Undo stack'e hamleyi ekle
    undoStack.push({ row, col });

    // Tehditli kareleri işaretle
    markThreatenedSquares();

    // Eğer conflict varsa, uyarı ver
    if (checkConflicts()) {
        messageContainer.textContent = 'Conflict detected! Try again.';
    } else {
        messageContainer.textContent = `Queens placed: ${placedQueens}`;
    }

    // Eğer tüm queen'ler yerleştirildiyse
    if (placedQueens === boardSize && !checkConflicts()) {
        messageContainer.textContent = 'Congratulations! All queens are placed correctly!';
    }

    updateUndoButton(); // Geri al butonunu güncelle
}

// Çatışma kontrolü
function checkConflicts() {
    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const q1 = queens[i];
            const q2 = queens[j];

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

// Geri al

