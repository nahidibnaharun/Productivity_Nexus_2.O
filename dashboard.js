// Clock and Date
function updateClockAndDate() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
setInterval(updateClockAndDate, 1000);


// Fetch Weather Data
function fetchWeather() {
  const apiKey = '40ca38b56ecc823aeaccf0e28b960c71'; // Your API key
  const city = document.getElementById('citySelect').value; // Get selected city
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          document.getElementById('weatherLocation').textContent = `${data.name}, ${data.sys.country}`;
          document.getElementById('weatherTemp').textContent = `${Math.round(data.main.temp)}°C`;
          document.getElementById('weatherDescription').textContent = data.weather[0].description;
      })
      .catch(error => console.error('Error fetching weather data:', error));
}

// Initialize
window.onload = function() {
  updateClockAndDate();
  updateProductivityScore();
  const savedNotes = localStorage.getItem('quickNotes');

  // Add event listener to citySelect
  document.getElementById('citySelect').addEventListener('change', fetchWeather);

  // Fetch weather for the default city when the page loads
  fetchWeather(); 

  document.getElementById('newTask').addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
          addTask();
      }
  });
  document.getElementById('newReminder').addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
          addReminder();
      }
  });

  initCalculator(); // Initialize the calculator widget
};



// Motivational Quotes
const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Believe you can and you're halfway there. - Theodore Roosevelt"
];
function setRandomQuote() {
    const quoteElement = document.getElementById('motivationalQuote');
    quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}
setRandomQuote();
setInterval(setRandomQuote, 3600000); // Update every 6 hours

// Reminders
function addReminder() {
    const reminderInput = document.getElementById('newReminder');
    const reminderTimeInput = document.getElementById('reminderTime');
    const reminderList = document.getElementById('reminderList');

    if (reminderInput.value.trim() !== '' && reminderTimeInput.value.trim() !== '') {
        const reminderText = `${reminderInput.value} - ${new Date(reminderTimeInput.value).toLocaleString()}`;
        const li = document.createElement('li');
        li.innerHTML =
            `<div class="flex items-center justify-between py-2">
                <div>
                    <input type="checkbox" onchange="updateProductivityScore()" class="mr-2">
                    <span>${reminderText}</span>
                </div>
                <button onclick="this.closest('li').remove(); updateProductivityScore()" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
        reminderList.appendChild(li);
        reminderInput.value = '';
        reminderTimeInput.value = '';
        updateProductivityScore();
    }
}

// Tasks
function addTask() {
    const taskInput = document.getElementById('newTask');
    const taskTypeSelect = document.getElementById('taskType');
    const taskImportanceSelect = document.getElementById('taskImportance');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() !== '') {
        const taskText = taskInput.value;
        const taskType = taskTypeSelect.value;
        const taskImportance = taskImportanceSelect.value;

        const li = document.createElement('li');
        li.innerHTML =
            `<div class="flex items-center justify-between py-2">
                <div>
                    <input type="checkbox" onchange="updateProductivityScore()" class="mr-2" data-importance="${taskImportance}">
                    <span>${taskText} (${taskType}) - Importance: ${taskImportance}</span>
                </div>
                <button onclick="this.closest('li').remove(); updateProductivityScore()" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
        taskList.appendChild(li);

        taskInput.value = '';
        updateProductivityScore();
    }
}

// Water Intake Tracker
let waterIntake = 0;
function addWater() {
    if (waterIntake < 8) {
        waterIntake++;
        updateWaterIntake();
        updateProductivityScore();
    }
}
function updateWaterIntake() {
    document.getElementById('waterIntake').textContent = `${waterIntake} / 8 glasses`;
    document.getElementById('waterProgress').style.width = `${(waterIntake / 8) * 100}%`;
}

// Focus Timer
let focusTimer;
let focusTimeRemaining = 1500;
function startFocusTimer() {
    clearInterval(focusTimer);
    focusTimer = setInterval(() => {
        if (focusTimeRemaining > 0) {
            focusTimeRemaining--;
            updateFocusTimer();
        } else {
            clearInterval(focusTimer);
            alert('Focus session completed!');
            updateProductivityScore();
        }
    }, 1000);
}
function stopFocusTimer() {
    clearInterval(focusTimer);
}
function updateFocusTimer() {
    const minutes = Math.floor(focusTimeRemaining / 60);
    const seconds = focusTimeRemaining % 60;
    document.getElementById('focusTimer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Logout
function logout() {
    window.location.href = "index.html";
}

// Productivity Score (Corrected)
function updateProductivityScore() {
    const tasks = document.querySelectorAll('#taskList input[type="checkbox"]'); // Select all checkboxes
    let totalScore = 0;
    let completedTasks = 0;

    tasks.forEach(task => {
        const importance = parseInt(task.dataset.importance);
        totalScore += importance;

        // Check if the task is checked *before* adding to completedTasks
        if (task.checked) {
            completedTasks += importance;
        }
    });

    const reminders = document.querySelectorAll('#reminderList input[type="checkbox"]'); // Select all reminder checkboxes
    reminders.forEach(reminder => {
        totalScore += 1;

        // Check if the reminder is checked *before* adding to completedTasks
        if (reminder.checked) {
            completedTasks += 1;
        }
    });

    // Calculate productivity score (taking task importance into account)
    let productivityScore = 0;
    if (totalScore > 0) {
        productivityScore = Math.round((completedTasks / totalScore) * 100);
    }

    document.getElementById('productivityScore').textContent = `${productivityScore}%`;
    document.getElementById('productivityProgress').style.width = `${productivityScore}%`;
}

// Initialize
window.onload = function() {
    updateClockAndDate();
    updateProductivityScore();
    const savedNotes = localStorage.getItem('quickNotes');

    // Initialize Weather
    fetchWeather();

    document.getElementById('newTask').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    document.getElementById('newReminder').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addReminder();
        }
    });

    initCalculator(); // Initialize the calculator widget
};


// Timer updates
function updateTimer() {
    const timerMinutes = document.getElementById('timerMinutes').value;
    focusTimeRemaining = timerMinutes * 60;
    updateFocusTimer();
}

// Upcoming Events
function addEvent() {
    const eventInput = document.getElementById('newEvent');
    const eventDateInput = document.getElementById('eventDate');
    const eventList = document.getElementById('eventList');

    if (eventInput.value.trim() !== '' && eventDateInput.value.trim() !== '') {
        const eventText = `${eventInput.value} - ${eventDateInput.value}`;
        const li = document.createElement('li');
        li.innerHTML = `${eventText} <button onclick="deleteEvent(this)" class="delete-button"><i class="fas fa-trash"></i></button>`;
        eventList.appendChild(li);
        eventInput.value = '';
        eventDateInput.value = '';
    }
}

function deleteEvent(button) {
    const li = button.parentNode;
    li.remove();
}

// Book Tracker
let books = []; // Array to store book data

function addBook() {
    const bookNameInput = document.getElementById('newBookName');
    const bookDateTimeInput = document.getElementById('bookDateTime');
    const bookList = document.getElementById('bookList');

    if (bookNameInput.value.trim() !== '' && bookDateTimeInput.value.trim() !== '') {
        const newBook = {
            name: bookNameInput.value,
            dateTime: new Date(bookDateTimeInput.value)
        };

        books.push(newBook);
        updateBookList();

        bookNameInput.value = '';
        bookDateTimeInput.value = '';
    }
}

function updateBookList() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // Clear the list

    // Sort books by date/time (ascending)
    books.sort((a, b) => a.dateTime - b.dateTime);

    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${book.name} - ${book.dateTime.toLocaleString()}`;
        bookList.appendChild(li);
    });
}

// Calculator
function initCalculator() {
    let calcInput = document.getElementById('calcInput');
    let calcValue = '';

    document.querySelectorAll('.calc-button').forEach(button => {
        button.addEventListener('click', function() {
            let value = this.textContent;

            if (value === '=') {
                try {
                    calcValue = eval(calcValue);
                } catch {
                    calcValue = 'Error';
                }
            } else if (value === 'Clear') {
                calcValue = '';
            } else {
                calcValue += value;
            }

            calcInput.value = calcValue;
        });
    });
}
// Mindfulness & Meditation Widget Script

let breathingInterval;
let isBreathing = false;
let cycles = 0;

function startBreathingExercise() {
    if (isBreathing) {
        stopBreathingExercise();
    } else {
        isBreathing = true;
        document.getElementById('startBreathing').textContent = 'Stop Exercise';
        breathingCycle();
        breathingInterval = setInterval(breathingCycle, 12000); // 12 seconds per full cycle
    }
}

function breathingCycle() {
    const breathingText = document.getElementById('breathingText');
    const breathingCircle = document.getElementById('breathingCircle');

    // Breathe In
    breathingText.textContent = 'Breathe In';
    breathingCircle.classList.remove('exhale', 'hold');
    breathingCircle.classList.add('inhale');

    // Hold
    setTimeout(() => {
        breathingText.textContent = 'Hold';
        breathingCircle.classList.remove('inhale', 'exhale');
        breathingCircle.classList.add('hold');
    }, 4000);

    // Breathe Out
    setTimeout(() => {
        breathingText.textContent = 'Breathe Out';
        breathingCircle.classList.remove('inhale', 'hold');
        breathingCircle.classList.add('exhale');
    }, 8000);

    // Increment cycle counter
    setTimeout(() => {
        cycles++;
        document.getElementById('cycleCounter').textContent = `Cycles: ${cycles}`;
    }, 11900);
}

function stopBreathingExercise() {
    clearInterval(breathingInterval);
    document.getElementById('startBreathing').textContent = 'Start Exercise';
    document.getElementById('breathingText').textContent = 'Breathe In';
    document.getElementById('breathingCircle').classList.remove('inhale', 'hold', 'exhale');
    isBreathing = false;
}

function resetBreathingExercise() {
    stopBreathingExercise();
    cycles = 0;
    document.getElementById('cycleCounter').textContent = 'Cycles: 0';
}
// games 
 const gameContainer = document.getElementById('gameContainer');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const levelSelect = document.getElementById('level');
    const startButton = document.getElementById('startButton');

    let score = 0;
    let moves = 0;
    let flippedCards = [];
    let matchedCards = [];
    let gameBoard = [];
    let numCards; 

    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🍒', '🍑', '🍊', '🍋', '🥭', '🥥', '🥝', '🥑', '🍆', '🥕']; 

    // Function to start the game based on selected level
    startButton.addEventListener('click', () => {
        const selectedLevel = levelSelect.value;
        switch (selectedLevel) {
            case 'easy':
                numCards = 8;
                break;
            case 'medium':
                numCards = 10;
                break;
            case 'hard':
                numCards = 12;
                break;
        }
        startGame(); 
    });

    // Function to create a card element
    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-content">${symbol}</div>
        `;
        card.addEventListener('click', flipCard);
        return card;
    }

    // Function to shuffle the array (Fisher-Yates Shuffle)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to start the game
    function startGame() {
        score = 0;
        moves = 0;
        flippedCards = [];
        matchedCards = [];
        scoreElement.textContent = score;
        movesElement.textContent = moves;

        gameBoard = shuffle(symbols.slice(0, numCards)).concat(shuffle(symbols.slice(0, numCards))); // Create pairs
        gameContainer.innerHTML = ''; // Clear previous game

        // Create and add cards to the game board
        gameBoard.forEach(symbol => {
            const card = createCard(symbol);
            gameContainer.appendChild(card);
        });
    }

    // Function to flip a card
    function flipCard() {
        if (flippedCards.length < 2 && !matchedCards.includes(this) && !flippedCards.includes(this)) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;

                // Check if the cards match
                const card1 = flippedCards[0].querySelector('.card-content').textContent;
                const card2 = flippedCards[1].querySelector('.card-content').textContent;

                if (card1 === card2) {
                    setTimeout(() => {
                        flippedCards[0].classList.add('matched');
                        flippedCards[1].classList.add('matched');
                        matchedCards.push(...flippedCards);
                        flippedCards = [];

                        score += 10;
                        scoreElement.textContent = score;

                        // Check if the game is over
                        if (matchedCards.length === gameBoard.length) {
                            setTimeout(() => {
                                alert(`Congratulations! You won with ${moves} moves!`);
                                startGame(); // Start a new game
                            }, 500);
                        }
                    }, 1000); // Wait for 1 second before checking for match
                } else {
                    setTimeout(() => {
                        flippedCards[0].classList.remove('flipped');
                        flippedCards[1].classList.remove('flipped');
                        flippedCards = [];
                    }, 1000); // Wait for 1 second before flipping back
                }
            }
        }
    }

    // Initially hide the game board 
    gameContainer.style.display = "none"; // Hide the board at the start

    // Start the game when the "Start Game" button is clicked
    startButton.addEventListener('click', () => {
        gameContainer.style.display = "grid"; // Show the game board
        startGame();
    });

// Sudoku grid
// Sudoku Code with Lives, High Score Saving, and Improved Styling
const board = document.getElementById('sudoku-board');
const newGameBtn = document.getElementById('new-game');
const solveBtn = document.getElementById('solve');
const hintBtn = document.getElementById('hint');
const checkSolvedBtn = document.getElementById('check-solved');
const highScoreElement = document.getElementById('high-score');
const livesElement = document.getElementById('lives');
let selectedCell = null;
let puzzle = [];
let solution = [];
let highScore = localStorage.getItem('highScore') || 0;
let lives = 3;
let hintsUsed = 0;

function generatePuzzle() {
  const base = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  for (let i = 0; i < 9; i += 3) {
    const rows = [i, i + 1, i + 2];
    for (let j = 0; j < 2; j++) {
      const r1 = Math.floor(Math.random() * 3);
      const r2 = Math.floor(Math.random() * 3);
      [base[rows[r1]], base[rows[r2]]] = [base[rows[r2]], base[rows[r1]]];
    }
  }

  solution = base;
  puzzle = JSON.parse(JSON.stringify(base));

  for (let i = 0; i < 40; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    puzzle[row][col] = 0;
  }
}

function renderBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (puzzle[i][j] !== 0) {
        cell.textContent = puzzle[i][j];
        cell.classList.add('initial');
      }
      cell.addEventListener('click', selectCell);
      board.appendChild(cell);
    }
  }
}

function selectCell(event) {
  if (selectedCell) {
    selectedCell.classList.remove('selected');
  }
  selectedCell = event.target;
  selectedCell.classList.add('selected');
}

function handleKeyPress(event) {
  if (selectedCell && !selectedCell.classList.contains('initial')) {
    const key = event.key;
    if (key >= '1' && key <= '9') {
      const row = parseInt(selectedCell.dataset.row);
      const col = parseInt(selectedCell.dataset.col);
      if (puzzle[row][col] === solution[row][col]) return;
      puzzle[row][col] = parseInt(key);
      selectedCell.textContent = key;
      selectedCell.classList.remove('error');
      if (puzzle[row][col] !== solution[row][col]) {
        selectedCell.classList.add('error');
        reduceLife();
      } else {
        checkWin();
      }
    } else if (key === 'Backspace' || key === 'Delete') {
      const row = parseInt(selectedCell.dataset.row);
      const col = parseInt(selectedCell.dataset.col);
      puzzle[row][col] = 0;
      selectedCell.textContent = '';
      selectedCell.classList.remove('error');
    }
  }
}

function newGame() {
  lives = 3;
  hintsUsed = 0;
  updateLives();
  generatePuzzle();
  renderBoard();
}

function solve() {
  puzzle = JSON.parse(JSON.stringify(solution));
  renderBoard();
  resetScore();
}

function hint() {
  if (hintsUsed >= 3) return;
  hintsUsed++;
  let emptyCells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    puzzle[randomCell.row][randomCell.col] = solution[randomCell.row][randomCell.col];
    renderBoard();
  }
  updateHighScore(-5); // Deduct 5 points for each hint
}

function checkSolved() {
  let solved = true;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] !== solution[i][j]) {
        solved = false;
        break;
      }
    }
    if (!solved) break;
  }
  if (solved) {
    alert('Congratulations! You solved the puzzle!');
    updateHighScore();
    winAnimation();
  } else {
    alert('Puzzle is not solved correctly yet.');
  }
}

function reduceLife() {
  lives--;
  updateLives();
  if (lives === 0) {
    alert('Game Over! You ran out of lives.');
    resetScore();
    solve(); // Show the solution
  }
}

function updateLives() {
  livesElement.textContent = `Lives: ${lives}`;
}

function updateHighScore(change = 10) {
  highScore += change;
  highScoreElement.textContent = `High Score: ${highScore}`;
  localStorage.setItem('highScore', highScore);
}

function resetScore() {
  highScore = 0;
  highScoreElement.textContent = `High Score: 0`;
  localStorage.setItem('highScore', highScore);
}

function checkWin() {
  let currentScore = calculateScore();
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreElement.textContent = `High Score: ${highScore}`;
    localStorage.setItem('highScore', highScore);
  }
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === solution[i][j]) {
        score++;
      }
    }
  }
  return score;
}

newGameBtn.addEventListener('click', newGame);
solveBtn.addEventListener('click', solve);
hintBtn.addEventListener('click', hint);
checkSolvedBtn.addEventListener('click', checkSolved);
document.addEventListener('keydown', handleKeyPress);

// Initialize the game and load the saved high score
newGame();
highScoreElement.textContent = `High Score: ${highScore}`;

// Add these to your window.onload function
document.getElementById('startBreathing').addEventListener('click', startBreathingExercise);
document.getElementById('resetBreathing').addEventListener('click', resetBreathingExercise);

// AI Widget
const aiPlatformSelect = document.getElementById('aiPlatformSelect');
const aiPrompt = document.getElementById('aiPrompt');
const submitPrompt = document.getElementById('submitPrompt');
const aiIcon = document.getElementById('aiIcon');

// Function to update the AI icon based on the selected platform
function updateAIIcon() {
    const selectedPlatform = aiPlatformSelect.value;

    switch (selectedPlatform) {
        case 'gemini':
            aiIcon.innerHTML = '<img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini">';
            submitPrompt.style.backgroundImage = 'linear-gradient(135deg, #f700ff, #3700fd, #ff0000)';
            break;
        case 'aistudio':
            aiIcon.innerHTML = '<img src="https://www.gstatic.com/aistudio/ai_studio_favicon_32x32.svg" alt="AI Studio">';
            submitPrompt.style.backgroundImage = 'linear-gradient(135deg, #1eff00, #00e1ff, #001aff)';
            break;
        case 'openai':
            aiIcon.innerHTML = '<img src="https://cdn.oaistatic.com/_next/static/media/favicon-32x32.630a2b99.png" alt="OpenAI">';
            submitPrompt.style.backgroundImage = 'linear-gradient(135deg, #000000, #9c9494, #000000)';
            break;
        case 'perplexity':
            aiIcon.innerHTML = '<i class="fas fa-question-circle"></i>';
            aiIcon.innerHTML = '<img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png" alt="Perplexity">';
            // Style the image
            aiIcon.querySelector('img').style.width = '24px'; 
            aiIcon.querySelector('img').style.height = '24px';
            break;
        case 'claude':
            aiIcon.innerHTML = '<img src="https://claude.ai/images/claude_app_icon.png" alt="Claude">';
            submitPrompt.style.backgroundImage = 'linear-gradient(135deg, #ff9900, #fdcf00, #ff0000)';
             // Style the image
             aiIcon.querySelector('img').style.width = '24px'; 
             aiIcon.querySelector('img').style.height = '24px';
            break;
        default:
            aiIcon.innerHTML = '<img src="https://www.gstatic.com/aistudio/ai_studio_favicon_32x32.svg" alt="AI">'; 
            submitPrompt.style.backgroundImage = 'linear-gradient(135deg, #667eea, #764ba2, #ff7e5f, #feb47b)';
    }
}

// Call the function to set the initial icon
updateAIIcon();

// Event listener for the select element
aiPlatformSelect.addEventListener('change', updateAIIcon);

submitPrompt.addEventListener('click', () => {
    const selectedPlatform = aiPlatformSelect.value;
    const prompt = aiPrompt.value;

    let url = '';

    switch (selectedPlatform) {
        case 'gemini':
            url = 'https://gemini.google.com/app/' + encodeURIComponent(prompt); 
            break;
        case 'aistudio':
            url = 'https://aistudio.google.com/app/prompts/new_chat/' + encodeURIComponent(prompt); 
            break;
        case 'openai':
            url = 'https://chat.openai.com/chat?q=' + encodeURIComponent(prompt); 
            break;
        case 'perplexity':
            url = 'https://www.perplexity.ai/search?q=' + encodeURIComponent(prompt); 
            break;
        case 'claude':
            url = 'https://claude.ai/search?q=' + encodeURIComponent(prompt); 
            break;
        default: 
            url = 'https://www.google.com/search?q=' + encodeURIComponent(prompt); // Default to Google Search
   }

    window.open(url, '_blank');
    aiPrompt.value = '';
});


//typing test 
// Typing Test Widget
let testParagraph = document.getElementById('testParagraph');
let userInput = document.getElementById('userInput');
let timeLeftElement = document.getElementById('timeLeft');
let timeTakenElement = document.getElementById('timeTaken');
let wpmElement = document.getElementById('wpm');
let accuracyElement = document.getElementById('accuracy');
let typingTestWidget = document.getElementById('typingTestWidget'); 

let startTime;
let endTime;
let testTime = 60; // Default test time in seconds
let intervalId;

function setTestTime() {
  testTime = parseInt(document.getElementById('testTime').value);
  updateTestParagraph(testTime); // Update the paragraph based on time
}

function startTest() {
  testParagraph = document.getElementById('testParagraph').textContent;
  userInput.disabled = false;
  userInput.value = '';
  userInput.focus();
  document.getElementById('result').style.display = 'none';
  startTime = new Date();
  timeLeftElement.textContent = formatTime(testTime);
  intervalId = setInterval(updateTimer, 1000);
  // Removed animation code
}

function stopTest() {
  clearInterval(intervalId);
  endTime = new Date();
  calculateResult();
  // Removed animation code
}

function updateTimer() {
  testTime--;
  timeLeftElement.textContent = formatTime(testTime);
  if (testTime <= 0) {
    stopTest();
  }
}

function calculateResult() {
  const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;
  const userInput = document.getElementById('userInput').value;

  const words = testParagraph.split(' ');
  const correctWords = calculateCorrectWords(userInput, words);
  const accuracy = (correctWords / words.length) * 100;
  const wpm = Math.round((correctWords / timeTaken) * 60);

  timeTakenElement.textContent = timeTaken.toFixed(2);
  wpmElement.textContent = wpm;
  accuracyElement.textContent = accuracy.toFixed(2);

  document.getElementById('result').style.display = 'block';
  userInput.disabled = true;
}

function calculateCorrectWords(userInput, words) {
  let correctWords = 0;
  const userWords = userInput.split(' ');
  for (let i = 0; i < words.length && i < userWords.length; i++) {
    if (words[i] === userWords[i]) {
      correctWords++;
    }
  }
  return correctWords;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTestParagraph(testTime) {
  // Logic to create a paragraph with a variable number of words
  const baseParagraph = "The quick brown fox jumps over the lazy dog."; // Your base paragraph
  const wordsToAdd = Math.floor((testTime - 60) / 10); // Add words based on time increase
  const newParagraph = baseParagraph.split(' ').concat(Array(wordsToAdd).fill('words')).join(' '); 
  document.getElementById('testParagraph').textContent = newParagraph;
}

// Event Listeners
document.getElementById('userInput').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    stopTest(); // Stop the test on Enter key press
  }
});

// Update test paragraph when selected
document.getElementById('testParagraphSelect').addEventListener('change', function() {
  document.getElementById('testParagraph').textContent = this.value;
  updateTestParagraph(testTime); // Update paragraph based on current time
});

// ... (your other JavaScript functions) ...

// Fetch 5-Day Forecast Data
function fetchFiveDayForecast() {
  const apiKey = '40ca38b56ecc823aeaccf0e28b960c71'; // Replace with your OpenWeatherMap API key
  const city = document.getElementById('citySelectAirForecast').value; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const forecastList = document.getElementById('forecastList');
          forecastList.innerHTML = ''; // Clear previous forecast

          // Group forecasts by day
          for (let i = 0; i < data.list.length; i += 8) { 
              const forecast = data.list[i];
              const day = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
              const temp = Math.round(forecast.main.temp);
              const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`; 

              const forecastItem = document.createElement('li');
              forecastItem.classList.add('forecast-item');
              forecastItem.innerHTML = `
                  <div class="day">${day}</div>
                  <img src="${icon}" alt="${forecast.weather[0].description}" class="forecast-icon">
                  <div class="temp">${temp}°C</div>
              `;
              forecastList.appendChild(forecastItem);
          }
      })
      .catch(error => console.error('Error fetching weather data:', error));
}

// Initialize the 5-Day forecast
window.onload = function() {
  // ... your other initialization code ...

  // Initialize the 5-day forecast widget
  fetchFiveDayForecast();
  document.getElementById('citySelectAirForecast').addEventListener('change', fetchFiveDayForecast);
};


// ... (your other JavaScript functions) ...
// ... (your other JavaScript code) ...

// Fetch Air Pollution Data
function fetchAirPollutionData() {
  const apiKey = '40ca38b56ecc823aeaccf0e28b960c71'; // Replace with your OpenWeatherMap API key
  const city = document.getElementById('citySelectAirQuality').value; 

  // Get latitude and longitude using Geocoding API
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              const lat = data[0].lat;
              const lon = data[0].lon;

              // Now fetch air pollution data using lat and lon
              fetchAirPollutionDataByCoords(lat, lon); 
          } else {
              // Handle case where city is not found
              document.getElementById('aqiIndex').textContent = "City not found";
              document.getElementById('airQualityDescription').textContent = "";
              document.getElementById('pollutantList').innerHTML = ''; 
          }
      })
      .catch(error => console.error('Error fetching geocoding data:', error));
}

// Fetch Air Pollution Data by Coordinates
function fetchAirPollutionDataByCoords(lat, lon) {
  const apiKey = '40ca38b56ecc823aeaccf0e28b960c71'; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const airQualityData = document.getElementById('airQualityData');
          const aqiIndex = document.getElementById('aqiIndex');
          const airQualityDescription = document.getElementById('airQualityDescription');
          const pollutantList = document.getElementById('pollutantList');

          if (data.list && data.list.length > 0) {
              const aqi = data.list[0].main.aqi;
              aqiIndex.textContent = `AQI: ${aqi}`;

              // Air quality descriptions (you can customize these)
              let airQualityDescriptionText = "";
              switch (aqi) {
                  case 1:
                      airQualityDescriptionText = "Good - Air quality is considered satisfactory, and air pollution poses little or no risk.";
                      break;
                  case 2:
                      airQualityDescriptionText = "Fair - Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
                      break;
                  case 3:
                      airQualityDescriptionText = "Moderate - Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
                      break;
                  case 4:
                      airQualityDescriptionText = "Poor -  Increased likelihood of health effects.  The general public may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
                      break;
                  case 5:
                      airQualityDescriptionText = "Very Poor -  Health warnings of emergency conditions.  Everyone may experience more serious health effects.";
                      break;
                  default:
                      airQualityDescriptionText = "Data Unavailable";
              }
              airQualityDescription.textContent = airQualityDescriptionText;

              // Display pollutants
              pollutantList.innerHTML = ''; 
              for (const pollutant in data.list[0].components) {
                  const pollutantItem = document.createElement('li');
                  pollutantItem.classList.add('pollutant-item');
                  pollutantItem.innerHTML = `
                      <div class="pollutant-name">${pollutant.toUpperCase()}</div>
                      <div class="pollutant-value">${data.list[0].components[pollutant].toFixed(2)} μg/m³</div>
                  `;
                  pollutantList.appendChild(pollutantItem);
              }
          } else {
              // Handle the case where data is not available
              aqiIndex.textContent = "Data Unavailable";
              airQualityDescription.textContent = "";
              pollutantList.innerHTML = ''; 
          }
      })
      .catch(error => console.error('Error fetching air pollution data:', error));
}

// Initialize the Air Pollution Widget
window.onload = function() {
  // ... your other initialization code ...

  // Initialize the 5-day forecast widget
  fetchFiveDayForecast();
  document.getElementById('citySelectAirForecast').addEventListener('change', fetchFiveDayForecast);

  // Initialize the Air Pollution Widget
  fetchAirPollutionData();
  document.getElementById('citySelectAirQuality').addEventListener('change', fetchAirPollutionData);
};


// ... (your other JavaScript functions) ...