const taskConatiner = document.getElementById("app");

class Task {
  constructor(name, description, dueDate) {
    this.id = Math.floor(Math.random() * 10000);
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.status = "in-progress";
    this.progress = Math.floor(Math.random() * 100);
  }

  static buildTaskCard(task) {
    return `<div class="glass-card rounded-lg p-4 mb-4 flex flex-col">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-3">
                                <div class="task-status" style="background: ${
                                  task.status === "completed"
                                    ? "var(--secondary)"
                                    : "var(--accent)"
                                };"></div>
                                <h3 class="text-xl font-semibold">${
                                  task.name
                                }</h3>
                            </div>
                            <div class="flex gap-2">
                                <button class="p-2 rounded-full hover:bg-[rgba(0,247,255,0.1)] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--primary)]"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button onclick="deleteTask(${
                                  task.id
                                })" class="p-2 rounded-full hover:bg-[rgba(255,0,128,0.1)] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--accent)]" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-300 mb-3">${task.description}</p>
                        <div class="mt-auto">
                            <div class="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progreso: ${task.progress}%</span>
                                <span>Vence: ${task.dueDate}</span>
                            </div>
                            <div class="progress-bar w-full">
                                <div class="h-full bg-[var(--secondary)]" style="width: ${
                                  task.progress
                                }%"></div>
                            </div>
                        </div>
                    </div>`;
  }
}

// Lista de tareas mockeadas
let tasks = [];

function loadData() {
  const storedTasks = localStorage.getItem('tasks');
  tasks = storedTasks ? JSON.parse(storedTasks) : [];

  if (tasks.length > 0) {
    taskConatiner.innerHTML = tasks
      .map((task) => Task.buildTaskCard(task))
      .join("");
  } else {
    taskConatiner.innerHTML = '<div class="text-center text-gray-400 text-2xl">No hay tareas</div>';
  }
  updateTaskStats();
}

function saveTask(task) {
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log("tarea guardada", task);
  loadData();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log("la tarea se borró", id);
  loadData();
}

function updateTaskStats() {
  const totalTask = tasks.length;
  const pendingTask = tasks.filter(task => task.status === "in-progress").length;
  const completedTask = tasks.filter(task => task.status === "completed").length;

  document.getElementById("total-task").innerText = totalTask;
  document.getElementById("pending-task").innerText = pendingTask;
  document.getElementById("completed-task").innerText = completedTask;
  document.getElementById("inpregress-task").innerText = totalTask - completedTask - pendingTask;
}

// Implementar la lógica para la búsqueda de tareas
document.getElementById("search-input").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm));
  taskConatiner.innerHTML = filteredTasks.length > 0
    ? filteredTasks.map(task => Task.buildTaskCard(task)).join("")
    : '<div class="text-center text-gray-400 text-2xl">No hay tareas que coincidan</div>';
});

// Implementar la lógica para el formulario de creación de tareas
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskNameInput = document.getElementById("name");
  const taskDescriptionInput = document.getElementById("description");
  const taskDueDateInput = document.getElementById("due_date");

  const name = taskNameInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const dueDate = taskDueDateInput.value;

  if (name && description && dueDate) {
    const newTask = new Task(name, description, dueDate);
    saveTask(newTask);
    form.reset();
    const modal = document.getElementById("task-modal");
    modal.checked = false;
    showNotification("Tarea añadida correctamente");
  } else {
    showNotification("Por favor, completa todos los campos");
  }
});

function showNotification(message) {
  const notificationArea = document.getElementById('notification-area');
  const notification = document.createElement('div');
  notification.classList.add('bg-green-500', 'text-white', 'p-4', 'rounded-md', 'mb-2', 'animate__animated', 'animate__fadeInRight');
  notification.textContent = message;
  notificationArea.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('animate__fadeInRight');
    notification.classList.add('animate__fadeOutRight');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

function getRandomFutureDate() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  const formElement = document.querySelector('form');
  if (formElement) {
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      const taskNameInput = document.getElementById("name");
      const taskDescriptionInput = document.getElementById("description");
      const taskDueDateInput = document.getElementById("due_date");

      const name = taskNameInput.value.trim();
      const description = taskDescriptionInput.value.trim();
      const dueDate = taskDueDateInput.value;

      if (name && description && dueDate) {
        const newTask = new Task(name, description, dueDate);
        saveTask(newTask);
        formElement.reset();
        const modal = document.getElementById("task-modal");
        modal.checked = false;
        showNotification("Tarea añadida correctamente");
      } else {
        showNotification("Por favor, completa todos los campos");
      }
    });
  }
});