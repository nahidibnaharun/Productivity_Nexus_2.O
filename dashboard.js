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


// Notes
function saveNotes() {
    const notes = document.getElementById('quickNotes').value;
    localStorage.setItem('quickNotes', notes);
}

// Add these to your window.onload function
document.getElementById('startBreathing').addEventListener('click', startBreathingExercise);
document.getElementById('resetBreathing').addEventListener('click', resetBreathingExercise);
