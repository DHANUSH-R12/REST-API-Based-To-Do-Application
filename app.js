const API_URL = "api/tasks.php";

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const descriptionInput = document.getElementById("taskDescription");
const message = document.getElementById("message");
let tasks = [];
let currentFilter = "all";

document.getElementById("todayLabel").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "long", month: "long", day: "numeric"
}).toUpperCase();

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function showMessage(text = "", isError = true) {
  message.textContent = text;
  message.style.color = isError ? "#d35b63" : "#269b75";
}

async function loadTasks() {
  try {
    tasks = await apiRequest(API_URL);
    renderTasks();
  } catch (error) {
    taskList.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠</div><strong>Couldn't load tasks</strong><span>${escapeHtml(error.message)} Check your PHP server and database settings.</span></div>`;
    showMessage("API connection failed.");
  }
}

function renderTasks() {
  const completed = tasks.filter(task => Number(task.completed) === 1).length;
  const total = tasks.length;
  const remaining = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  document.getElementById("totalStat").textContent = total;
  document.getElementById("doneStat").textContent = completed;
  document.getElementById("remainingStat").textContent = remaining;
  document.getElementById("navCount").textContent = remaining;
  document.getElementById("progressText").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  const filtered = tasks.filter(task => currentFilter === "all" ||
    (currentFilter === "active" && Number(task.completed) === 0) ||
    (currentFilter === "completed" && Number(task.completed) === 1));

  if (!filtered.length) {
    const title = total === 0 ? "Your task list is clear" : "No tasks in this view";
    const subtitle = total === 0 ? "Add your first task above and start making progress." : "Choose another filter to see your tasks.";
    taskList.innerHTML = `<div class="empty-state"><div class="empty-icon">✦</div><strong>${title}</strong><span>${subtitle}</span></div>`;
  } else {
    taskList.innerHTML = filtered.map(task => {
      const isDone = Number(task.completed) === 1;
      const date = task.created_at ? new Date(task.created_at.replace(" ", "T")).toLocaleDateString(undefined, {month:"short", day:"numeric"}) : "";
      return `<article class="task-row ${isDone ? "completed" : ""}">
        <button class="check-btn" data-action="toggle" data-id="${task.id}" aria-label="${isDone ? "Mark active" : "Mark completed"}">${isDone ? "✓" : ""}</button>
        <div class="task-info"><div class="task-title">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ""}
        </div>
        <span class="task-date">${escapeHtml(date)}</span>
        <button class="delete-btn" data-action="delete" data-id="${task.id}" aria-label="Delete task" title="Delete task">×</button>
      </article>`;
    }).join("");
  }
  document.getElementById("listSummary").textContent = `${remaining} task${remaining === 1 ? "" : "s"} left to complete`;
  document.getElementById("clearCompleted").style.visibility = completed ? "visible" : "hidden";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

taskForm.addEventListener("submit", async event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!title) { showMessage("Please enter a task title."); titleInput.focus(); return; }

  const addButton = taskForm.querySelector("button");
  addButton.disabled = true;
  addButton.textContent = "Adding…";
  try {
    await apiRequest(API_URL, { method: "POST", body: JSON.stringify({ title, description }) });
    taskForm.reset();
    currentFilter = "all";
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("selected", btn.dataset.filter === "all"));
    showMessage("Task added successfully.", false);
    await loadTasks();
    titleInput.focus();
  } catch (error) {
    showMessage(error.message);
  } finally {
    addButton.disabled = false;
    addButton.innerHTML = "<span>＋</span> Add task";
  }
});

taskList.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const task = tasks.find(item => Number(item.id) === id);
  if (!task) return;

  try {
    if (button.dataset.action === "toggle") {
      await apiRequest(`${API_URL}?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: Number(task.completed) === 1 ? 0 : 1 })
      });
      showMessage("Task status updated.", false);
    } else if (button.dataset.action === "delete") {
      if (!confirm(`Delete "${task.title}"?`)) return;
      await apiRequest(`${API_URL}?id=${id}`, { method: "DELETE" });
      showMessage("Task deleted.", false);
    }
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
});

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("selected", btn === button));
    renderTasks();
  });
});

document.getElementById("clearCompleted").addEventListener("click", async () => {
  const completed = tasks.filter(task => Number(task.completed) === 1);
  if (!completed.length) return;
  if (!confirm(`Delete all ${completed.length} completed task(s)?`)) return;
  try {
    await Promise.all(completed.map(task => apiRequest(`${API_URL}?id=${Number(task.id)}`, { method: "DELETE" })));
    showMessage("Completed tasks cleared.", false);
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
});

document.getElementById("allNav").addEventListener("click", () => {
  currentFilter = "all";
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("selected", btn.dataset.filter === "all"));
  renderTasks();
});

loadTasks();