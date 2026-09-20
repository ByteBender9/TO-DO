const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const taskCount = document.getElementById("taskCount");

const clearCompleted = document.getElementById("clearCompleted");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("taskflow_tasks")) || [];
let currentFilter = "all";

/* -------------------------
   Save Tasks
------------------------- */

function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
}

/* -------------------------
   Add Task
------------------------- */

function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    title,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);

  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "medium";

  taskInput.focus();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

/* -------------------------
   Toggle Task
------------------------- */

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

/* -------------------------
   Delete Task
------------------------- */

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

/* -------------------------
   Edit Task
------------------------- */

function editTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const newTitle = prompt("Edit your task:", task.title);

  if (newTitle === null) return;

  const title = newTitle.trim();

  if (!title) return;

  task.title = title;

  saveTasks();
  renderTasks();
}

/* -------------------------
   Filter
------------------------- */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelectorAll(".filter")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });

});

/* -------------------------
   Render Tasks
------------------------- */

function renderTasks() {

  let filteredTasks = [...tasks];

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  taskList.innerHTML = "";

  filteredTasks.forEach(task => {

    const taskElement = document.createElement("div");

    taskElement.className =
      `task ${task.completed ? "completed" : ""}`;

    const formattedDate = task.dueDate
      ? new Date(task.dueDate + "T00:00:00")
          .toLocaleDateString(undefined, {
            month: "short",
            day: "numeric"
          })
      : "";

    taskElement.innerHTML = `

      <div
        class="checkbox ${task.completed ? "checked" : ""}"
        onclick="toggleTask(${task.id})"
      ></div>

      <div class="task-content">

        <div class="task-title">
          ${escapeHTML(task.title)}
        </div>

        <div class="task-meta">

          <span class="priority ${task.priority}">
            ${task.priority}
          </span>

          ${
            formattedDate
              ? `<span>📅 ${formattedDate}</span>`
              : ""
          }

        </div>

      </div>

      <div class="task-actions">

        <button
          class="action-btn"
          onclick="editTask(${task.id})"
          title="Edit"
        >
          ✎
        </button>

        <button
          class="action-btn delete-btn"
          onclick="deleteTask(${task.id})"
          title="Delete"
        >
          ×
        </button>

      </div>
    `;

    taskList.appendChild(taskElement);
  });

  updateStats();

  emptyState.style.display =
    filteredTasks.length === 0 ? "block" : "none";
}

/* -------------------------
   Statistics
------------------------- */

function updateStats() {

  const total = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  const pending = total - completed;

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;

  taskCount.textContent =
    `${pending} ${pending === 1 ? "task" : "tasks"} remaining`;
}

/* -------------------------
   Clear Completed
------------------------- */

clearCompleted.addEventListener("click", () => {

  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
});

/* -------------------------
   Theme
------------------------- */

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

  const lightMode =
    document.body.classList.contains("light");

  themeBtn.textContent = lightMode ? "☀" : "☾";

  localStorage.setItem(
    "taskflow_theme",
    lightMode ? "light" : "dark"
  );
});

/* Load Theme */

if (localStorage.getItem("taskflow_theme") === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀";
}

/* -------------------------
   Security
------------------------- */

function escapeHTML(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Initial Render */

renderTasks();