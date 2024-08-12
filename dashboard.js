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

// Quick Notes
function saveNotes() {
    const quickNotes = document.getElementById('quickNotes').value;
    localStorage.setItem('quickNotes', quickNotes);
    alert('Notes saved!');
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
    if (savedNotes) {
        document.getElementById('quickNotes').value = savedNotes;
    }

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
