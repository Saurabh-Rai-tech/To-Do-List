// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const tasksLeftElement = document.getElementById('tasks-left');
const themeToggleBtn = document.getElementById('theme-toggle');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize
function init() {
    renderTasks();
    updateTaskCount();
    
    // Load theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({
            id: Date.now(),
            text,
            completed: false
        });
        saveTasks();
        taskInput.value = '';
        renderTasks();
        updateTaskCount();
    }
}

// Render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
    
    // Add event listeners to new elements
    addTaskEventListeners();
}

// Add event listeners to task elements
function addTaskEventListeners() {
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTaskComplete);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editTask);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// Toggle task completion status
function toggleTaskComplete(e) {
    const taskId = parseInt(e.target.dataset.id);
    const task = tasks.find(task => task.id === taskId);
    task.completed = e.target.checked;
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Edit task
function editTask(e) {
    const taskId = parseInt(e.target.closest('button').dataset.id);
    const task = tasks.find(task => task.id === taskId);
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(e) {
    const taskId = parseInt(e.target.closest('button').dataset.id);
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Update task count
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    tasksLeftElement.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
}

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);
themeToggleBtn.addEventListener('click', toggleTheme);

// Initialize app
init();