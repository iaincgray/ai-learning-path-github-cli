// Week data - 10 Week AI Project
const weeks = [
    { id: 1, title: "Week 1 - Resolution Tracker" },
    { id: 2, title: "Week 2 - Model Mapping" },
    { id: 3, title: "Week 3 - Deep Research" },
    { id: 4, title: "Week 4 - Data Analyst" },
    { id: 5, title: "Week 5 - Visual Reasoning" },
    { id: 6, title: "Week 6 - Information Pipelines" },
    { id: 7, title: "Week 7 - Automation: Distribution" },
    { id: 8, title: "Week 8 - Automation: Productivity" },
    { id: 9, title: "Week 9 - Context Engineering" },
    { id: 10, title: "Week 10 - Build an AI App" }
];

const STORAGE_KEY = 'ai-project-progress';
const NOTES_KEY = 'ai-project-notes';
const START_DATE_KEY = 'ai-project-start-date';

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Load notes from localStorage
function loadNotes() {
    const saved = localStorage.getItem(NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
}

// Save notes to localStorage
function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Load start date from localStorage
function loadStartDate() {
    return localStorage.getItem(START_DATE_KEY);
}

// Save start date to localStorage
function saveStartDate(date) {
    localStorage.setItem(START_DATE_KEY, date);
}

// Calculate current week based on start date
function getCurrentWeek() {
    const startDate = loadStartDate();
    if (!startDate) return null;
    
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 1;
    
    // Clamp to valid week range
    if (currentWeek < 1) return 1;
    if (currentWeek > 10) return 10;
    return currentWeek;
}

// Update the progress bar and counter
function updateProgressUI(progress) {
    const completedCount = Object.values(progress).filter(Boolean).length;
    const totalCount = weeks.length;
    const percentage = (completedCount / totalCount) * 100;
    
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

// Render the week list
function renderWeeks() {
    const progress = loadProgress();
    const notes = loadNotes();
    const currentWeek = getCurrentWeek();
    const weekList = document.getElementById('week-list');
    
    weekList.innerHTML = weeks.map(week => {
        const isCurrent = week.id === currentWeek;
        const isCompleted = progress[week.id];
        
        return `
        <li class="week-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current-week' : ''}" data-week="${week.id}">
            <div class="week-header">
                <div class="checkbox"></div>
                <div class="week-info">
                    <div class="week-title">${week.title} ${isCurrent ? '<span class="current-badge">← Current Week</span>' : ''}</div>
                    <div class="week-number">Week ${week.id} of ${weeks.length}</div>
                </div>
            </div>
            <div class="notes-section">
                <textarea 
                    class="notes-input" 
                    data-week="${week.id}" 
                    placeholder="Add notes for this week..."
                    rows="2"
                >${notes[week.id] || ''}</textarea>
            </div>
        </li>
    `}).join('');
    
    updateProgressUI(progress);
}

// Toggle week completion
function toggleWeek(weekId) {
    const progress = loadProgress();
    progress[weekId] = !progress[weekId];
    saveProgress(progress);
    renderWeeks();
}

// Reset all progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress and notes? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NOTES_KEY);
        localStorage.removeItem(START_DATE_KEY);
        renderWeeks();
        renderStartDatePicker();
    }
}

// Save note for a specific week
function saveNote(weekId, noteText) {
    const notes = loadNotes();
    notes[weekId] = noteText;
    saveNotes(notes);
}

// Render start date picker
function renderStartDatePicker() {
    const startDate = loadStartDate();
    const container = document.getElementById('start-date-container');
    
    if (startDate) {
        const formattedDate = new Date(startDate).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        container.innerHTML = `
            <span>Project started: ${formattedDate}</span>
            <button id="change-date-btn" class="change-date-btn">Change</button>
        `;
    } else {
        container.innerHTML = `
            <label for="start-date">Set your project start date:</label>
            <input type="date" id="start-date" class="date-input">
            <button id="set-date-btn" class="set-date-btn">Set Start Date</button>
        `;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderStartDatePicker();
    renderWeeks();
    
    // Delegate click events for week headers (checkbox area)
    document.getElementById('week-list').addEventListener('click', (e) => {
        const weekHeader = e.target.closest('.week-header');
        if (weekHeader) {
            const weekItem = weekHeader.closest('.week-item');
            const weekId = parseInt(weekItem.dataset.week);
            toggleWeek(weekId);
        }
    });
    
    // Handle notes input
    document.getElementById('week-list').addEventListener('input', (e) => {
        if (e.target.classList.contains('notes-input')) {
            const weekId = parseInt(e.target.dataset.week);
            saveNote(weekId, e.target.value);
        }
    });
    
    // Handle start date setting
    document.getElementById('start-date-container').addEventListener('click', (e) => {
        if (e.target.id === 'set-date-btn') {
            const dateInput = document.getElementById('start-date');
            if (dateInput.value) {
                saveStartDate(dateInput.value);
                renderStartDatePicker();
                renderWeeks();
            }
        }
        if (e.target.id === 'change-date-btn') {
            localStorage.removeItem(START_DATE_KEY);
            renderStartDatePicker();
            renderWeeks();
        }
    });
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetProgress);
});
