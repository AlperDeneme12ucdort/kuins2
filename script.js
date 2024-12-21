let queens = [];
let placedQueens = 0;
let threatenedSquares = [];
let undoStack = [];
let timeRemaining = 0; // Zaman sayacı
let moveCount = 0; // Hamle sayacı
let timerInterval;
let hintUsed = false; // İpucu butonunun kullanılıp kullanılmadığını kontrol et
const boardSize = 8; // Tahta boyutu

// Başarı tablosu için localStorage
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Çarpı işareti ekleme
function addXMark(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('x-marked');
    const xMark = document.createElement('div');
    xMark.classList.add('x-mark');
    xMark.textContent = 'X';
    square.appendChild(xMark);
}

// Çarpı işaretlerini temizleme
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
    threatenedSquares = [];
    queens.forEach(queen => {
        const row = queen.row;
        const col = queen.col;

        // Aynı satırdaki kareler
        for (let i = 0; i < boardSize; i++) {
            if (i !== col) threatenedSquares.push({ row, col: i });
            if (i !== row) threatenedSquares.push({ row: i, col });
        }

        // Çaprazdaki kareler
        for (let i = -boardSize; i < boardSize; i++) {
            if (row + i >= 0 && row + i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row + i, col: col + i });
            }
            if (row - i >= 0 && row - i < boardSize && col + i >= 0 && col + i < boardSize && i !== 0) {
                threatenedSquares.push({ row: row - i, col: col + i });
            }
        }
    });

    threatenedSquares.forEach(pos => {
        addXMark(pos.row, pos.col);
    });
}

// Undo işlemi
function undo() {
    if (undoStack.length === 0) return;
    const lastMove = undoStack.pop();
    const square = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    square.innerHTML = '';
    queens = queens.filter(queen => queen.row !== lastMove.row || queen.col !== lastMove.col);
    placedQueens--;
    markThreatenedSquares();
    updateUndoButton();
    updateMoveCount();
}

// Hamle sayacını güncelle
function updateMoveCount() {
    moveCount++;
    document.getElementById('moveContainer').textContent = `Hamleler: ${moveCount}`;
}

// Zaman sayacını başlat
function startTimer() {
    timeRemaining = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        timeRemaining++;
        document.getElementById('timeContainer').textContent = `Zaman: ${formatTime(timeRemaining)}`;
    }, 1000);
}

// Zamanı formatla
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// İpucu butonu
function useHint() {
    if (hintUsed) return;
    hintUsed = true;

    // 30 saniye içinde yalnızca bir kez kullanılabilir
    const randomSquare = queens[Math.floor(Math.random() * queens.length)];
    const hintMessage = `Bir queen ${randomSquare.row}, ${randomSquare.col} koordinatında.`;

    alert(hintMessage); // İpucu göster
    document.getElementById('hintButton').disabled = true; // Butonu devre dışı bırak
    setTimeout(() => {
        document.getElementById('hintButton').disabled = false;
    }, 30000); // 30 saniye sonra buton tekrar aktif olacak
}

// Tahtayı oluşturma ve oyun kurma
function createBoard() {
    gameBoard.innerHTML = '';
    queens = [];
    placedQueens = 0;
    threatenedSquares = [];
    undoStack = [];
    moveCount = 0;
    hintUsed = false;

    startTimer(); // Zaman sayacını başlat

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
    updateUndoButton();
}

// Queen yerleştirme
function placeQueen(event) {
    const square = event.target;

    if (square.querySelector('.queen')) return;

    const queen = document.createElement('div');
    queen.classList.add('queen');
    square.appendChild(queen);

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    queens.push({ row, col });
    placedQueens++;

    undoStack.push({ row, col });
    markThreatenedSquares();
    updateMoveCount();

    if (checkConflicts()) {
        messageContainer.textContent = 'Conflict detected! Try again.';
    } else {
        messageContainer.textContent = `Queens placed: ${placedQueens}`;
    }

    if (placedQueens === boardSize && !checkConflicts()) {
        messageContainer.textContent = 'Tebrikler! Tüm kraliçeler doğru şekilde yerleştirildi!';
        stopTimer();
        saveBestTime();
    }
}

// Konfliktsiz çözüm var mı kontrol et
function checkConflicts() {
    return threatenedSquares.some(pos => queens.some(queen => queen.row === pos.row && queen.col === pos.col));
}

// Zamanı durdur
function stopTimer() {
    clearInterval(timerInterval);
}

// Başarıları kaydet ve başarı tablosunu güncelle
function saveBestTime() {
    const time = formatTime(timeRemaining);
    leaderboard.push({ time, moves: moveCount });
    leaderboard.sort((a, b) => a.time.localeCompare(b.time) || a.moves - b.moves);
    leaderboard = leaderboard.slice(0, 5); // En iyi 5 sonucu göster

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
}

// Başarı tablosunu güncelle
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Zaman: ${entry.time} - Hamleler: ${entry.moves}`;
        leaderboardList.appendChild(li);
    });
}

// Butonları etkinleştir
function updateUndoButton() {
    document.getElementById('undoButton').disabled = undoStack.length === 0;
}

// Yeni oyun başlat
function restartGame() {
    clearInterval(timerInterval);
    createBoard();
    document.getElementById('messageContainer').textContent = '';
    document.getElementById('timeContainer').textContent = 'Zaman: 00:00';
    document.getElementById('moveContainer').textContent = 'Hamleler: 0';
    document.getElementById('hintButton').disabled = false;
}

document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('hintButton').addEventListener('click', useHint);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Başlangıçta tahtayı oluştur
createBoard();
