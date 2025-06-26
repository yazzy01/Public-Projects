// ES6 Task Manager Application

// Using Class (ES6 Classes)
class TaskManager {
  constructor() {
    // Initialize with default values using let/const
    this.tasks = [];
    this.currentFilter = 'all';
    
    // DOM elements - using const for elements that won't change
    this.taskInput = document.getElementById('taskInput');
    this.addButton = document.getElementById('addTask');
    this.taskList = document.getElementById('taskList');
    this.filterButtons = document.querySelectorAll('.filters button');
    this.taskStats = document.getElementById('taskStats');
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  // Method to set up event listeners
  initEventListeners() {
    // Arrow function to preserve 'this' context (ES6 Arrow Functions)
    this.addButton.addEventListener('click', () => this.addTask());
    
    // Event listener for Enter key
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    // Event listeners for filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Set active class
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Set current filter
        this.currentFilter = button.dataset.filter;
        this.renderTasks();
      });
    });
  }
  
  // Method to add a new task
  addTask() {
    // Get task text and trim whitespace
    const taskText = this.taskInput.value.trim();
    
    // Only add if task is not empty
    if (taskText) {
      // Create new task object with unique ID
      // Object property shorthand syntax (ES6)
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date()
      };
      
      // Add task to array using spread operator (ES6 Spread)
      this.tasks = [...this.tasks, newTask];
      
      // Clear input
      this.taskInput.value = '';
      
      // Render tasks
      this.renderTasks();
    }
  }
  
  // Method to toggle task completion
  toggleTask(id) {
    // Map through tasks and toggle the matching one (ES6 Arrow Function and Map)
    this.tasks = this.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    // Render tasks
    this.renderTasks();
  }
  
  // Method to delete a task
  deleteTask(id) {
    // Filter out the task with matching id (ES6 Arrow Function and Filter)
    this.tasks = this.tasks.filter(task => task.id !== id);
    
    // Render tasks
    this.renderTasks();
  }
  
  // Method to filter tasks based on current filter
  filterTasks() {
    // Using switch and filter (ES6 Arrow Functions)
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }
  
  // Method to render tasks to the DOM
  renderTasks() {
    // Get filtered tasks
    const filteredTasks = this.filterTasks();
    
    // Clear task list
    this.taskList.innerHTML = '';
    
    // If no tasks, show message
    if (filteredTasks.length === 0) {
      this.taskList.innerHTML = '<div class="task-item">No tasks to display</div>';
    } else {
      // Map tasks to HTML and join (ES6 Template Literals, Arrow Functions, Destructuring)
      const tasksHTML = filteredTasks.map(({ id, text, completed }) => `
        <div class="task-item" data-id="${id}">
          <div class="task-text ${completed ? 'completed' : ''}">${text}</div>
          <div class="task-actions">
            <button class="complete">${completed ? 'Undo' : 'Complete'}</button>
            <button class="delete">Delete</button>
          </div>
        </div>
      `).join('');
      
      // Set HTML
      this.taskList.innerHTML = tasksHTML;
      
      // Add event listeners to buttons
      this.addTaskEventListeners();
    }
    
    // Update stats
    this.updateStats();
  }
  
  // Method to add event listeners to task buttons
  addTaskEventListeners() {
    // Get all task items
    const taskItems = document.querySelectorAll('.task-item');
    
    // Add event listeners to each
    taskItems.forEach(item => {
      const id = parseInt(item.dataset.id);
      const completeButton = item.querySelector('.complete');
      const deleteButton = item.querySelector('.delete');
      
      // Complete button
      completeButton.addEventListener('click', () => this.toggleTask(id));
      
      // Delete button
      deleteButton.addEventListener('click', () => this.deleteTask(id));
    });
  }
  
  // Method to update task statistics
  updateStats() {
    // Using destructuring and filter (ES6)
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    // Set stats text using template literals (ES6)
    this.taskStats.textContent = `Total: ${totalTasks} | Active: ${activeTasks} | Completed: ${completedTasks}`;
  }
}

// Create a new task formatter utility (ES6 Default Parameters)
const formatTaskDate = (date = new Date()) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
};

// Demonstrate Promises with a simulated task loading
const simulateTaskLoading = () => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      resolve('Tasks loaded successfully!');
    }, 1000);
  });
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Using async/await with promises
  try {
    const message = await simulateTaskLoading();
    console.log(message);
    
    // Initialize task manager
    const taskManager = new TaskManager();
    
    // Add some default tasks using spread
    const defaultTasks = [
      { id: 1, text: 'Learn ES6 features', completed: true, createdAt: new Date() },
      { id: 2, text: 'Build a task manager app', completed: false, createdAt: new Date() },
      { id: 3, text: 'Present to the class', completed: false, createdAt: new Date() }
    ];
    
    // Using destructuring and spread to add default tasks
    taskManager.tasks = [...defaultTasks];
    taskManager.renderTasks();
    
  } catch (error) {
    console.error('Error:', error);
  }
});
