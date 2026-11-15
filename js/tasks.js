/* ============================================================
   My Study Task Manager - tasks.js
   Login system + Create / Update / Delete / View study tasks.
   Tasks are stored in localStorage so they persist between visits.
   ============================================================ */

"use strict";

/* ---------- Simple login system (requirement 2.2.2) ---------- */
var VALID_USERNAME = "student";
var VALID_PASSWORD = "study123";

function isLoggedIn() {
  return sessionStorage.getItem("stm_logged_in") === "true";
}

function showLoginForm() {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
}

function showApp() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
  resetFormMode();
  renderTasks();
}

/* ---------- Task storage ---------- */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("stm_tasks")) || [];
  } catch (e) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem("stm_tasks", JSON.stringify(tasks));
}

/* ---------- Helpers ---------- */
function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function isValidDate(value) {
  // Must match YYYY-MM-DD and be a real calendar date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var d = new Date(value + "T00:00:00");
  return !isNaN(d.getTime()) && value === d.toISOString().slice(0, 10);
}

function daysUntil(dateStr) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var due = new Date(dateStr + "T00:00:00");
  return Math.round((due - today) / 86400000);
}

function setAlert(type, message) {
  var box = document.getElementById("form-alert");
  box.className = "form-alert " + type; // "error" or "success"
  box.textContent = message;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearAlert() {
  var box = document.getElementById("form-alert");
  box.className = "form-alert";
  box.textContent = "";
}

/* ---------- Form state (create vs update) ---------- */
var editingId = null;

function resetFormMode() {
  editingId = null;
  document.getElementById("task-form").reset();
  document.getElementById("form-title").textContent = "Create a New Study Task";
  document.getElementById("submit-btn").textContent = "Create Task";
  document.getElementById("cancel-edit-btn").style.display = "none";
  document.querySelectorAll(".error-msg").forEach(function (e) { e.textContent = ""; });
  clearAlert();
}

function startEdit(id) {
  var task = loadTasks().find(function (t) { return t.id === id; });
  if (!task) return;
  editingId = id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("course-code").value = task.courseCode;
  document.getElementById("course-name").value = task.courseName;
  document.getElementById("due-date").value = task.dueDate;
  document.getElementById("description").value = task.description;
  document.getElementById("priority").value = task.priority;
  document.getElementById("form-title").textContent = "Update Existing Task";
  document.getElementById("submit-btn").textContent = "Save Changes";
  document.getElementById("cancel-edit-btn").style.display = "inline-block";
  clearAlert();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Validation (requirement: all input must be validated) ---------- */
function validateForm(data) {
  var errors = {};
  document.querySelectorAll(".error-msg").forEach(function (e) { e.textContent = ""; });

  if (data.title.trim() === "") {
    errors.title = "Task title is required and cannot be empty.";
  } else if (data.title.trim().length > 60) {
    errors.title = "Task title must be 60 characters or fewer.";
  }

  if (data.courseCode.trim() === "") {
    errors.courseCode = "Course code is required (e.g. INFO1012).";
  }

  if (data.courseName.trim() === "") {
    errors.courseName = "Course name is required (e.g. Information Technology Systems).";
  }

  if (data.dueDate.trim() === "") {
    errors.dueDate = "Due date is required and cannot be empty.";
  } else if (!isValidDate(data.dueDate)) {
    errors.dueDate = "Invalid date: please enter a real calendar date (YYYY-MM-DD).";
  } else if (daysUntil(data.dueDate) < 0) {
    errors.dueDate = "Invalid date: the due date cannot be in the past.";
  }

  if (data.description.trim() === "") {
    errors.description = "Task description is required and cannot be empty.";
  } else if (data.description.trim().length > 300) {
    errors.description = "Description must be 300 characters or fewer.";
  }

  Object.keys(errors).forEach(function (key) {
    var el = document.getElementById(key + "-error");
    if (el) el.textContent = errors[key];
  });

  return Object.keys(errors).length === 0;
}

/* ---------- Create / Update ---------- */
function handleTaskSubmit(event) {
  event.preventDefault();
  clearAlert();

  var data = {
    title: document.getElementById("task-title").value,
    courseCode: document.getElementById("course-code").value,
    courseName: document.getElementById("course-name").value,
    dueDate: document.getElementById("due-date").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value
  };

  if (!validateForm(data)) {
    setAlert("error", "Please fix the highlighted errors before saving.");
    return;
  }

  var tasks = loadTasks();
  if (editingId === null) {
    tasks.push({
      id: Date.now(),
      title: data.title.trim(),
      courseCode: data.courseCode.trim().toUpperCase(),
      courseName: data.courseName.trim(),
      dueDate: data.dueDate,
      description: data.description.trim(),
      priority: data.priority,
      createdAt: new Date().toISOString()
    });
    saveTasks(tasks);
    resetFormMode();
    setAlert("success", 'Task "' + escapeHtml(data.title.trim()) + '" was created successfully.');
  } else {
    tasks = tasks.map(function (t) {
      if (t.id === editingId) {
        t.title = data.title.trim();
        t.courseCode = data.courseCode.trim().toUpperCase();
        t.courseName = data.courseName.trim();
        t.dueDate = data.dueDate;
        t.description = data.description.trim();
        t.priority = data.priority;
        t.updatedAt = new Date().toISOString();
      }
      return t;
    });
    saveTasks(tasks);
    resetFormMode();
    setAlert("success", "Task was updated and saved successfully.");
  }
  renderTasks();
}

/* ---------- Delete (requirement: confirmation dialog) ---------- */
function deleteTask(id) {
  var task = loadTasks().find(function (t) { return t.id === id; });
  if (!task) return;

  var confirmed = confirm(
    "Delete this task?\n\n" +
    "Title: " + task.title + "\n" +
    "Course: " + task.courseCode + " " + task.courseName + "\n" +
    "Due: " + task.dueDate + "\n\n" +
    "This action cannot be undone."
  );
  if (!confirmed) return;

  saveTasks(loadTasks().filter(function (t) { return t.id !== id; }));
  if (editingId === id) resetFormMode();
  setAlert("success", "Task was deleted successfully.");
  renderTasks();
}

/* ---------- View all tasks (ordered table) ---------- */
function statusLabel(task) {
  var d = daysUntil(task.dueDate);
  if (d < 0) return '<span class="status overdue">Overdue</span>';
  if (d <= 3) return '<span class="status due-soon">Due soon</span>';
  return '<span class="status ok">On track</span>';
}

function renderTasks() {
  var tbody = document.getElementById("task-table-body");
  var count = document.getElementById("task-count");
  var tasks = loadTasks().slice().sort(function (a, b) {
    return a.dueDate.localeCompare(b.dueDate); // ordered by due date
  });

  count.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");

  if (tasks.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No study tasks yet. Create your first task above.</td></tr>';
    return;
  }

  tbody.innerHTML = tasks.map(function (t) {
    return "<tr>" +
      "<td><strong>" + escapeHtml(t.title) + "</strong></td>" +
      "<td>" + escapeHtml(t.courseCode) + "<br><small>" + escapeHtml(t.courseName) + "</small></td>" +
      "<td>" + escapeHtml(t.dueDate) + "</td>" +
      "<td>" + statusLabel(t) + "</td>" +
      '<td><span class="badge ' + t.priority.toLowerCase() + '">' + escapeHtml(t.priority) + "</span></td>" +
      "<td>" + escapeHtml(t.description) + "</td>" +
      '<td class="actions">' +
        '<button class="btn small" onclick="startEdit(' + t.id + ')">Edit</button> ' +
        '<button class="btn small danger" onclick="deleteTask(' + t.id + ')">Delete</button>' +
      "</td>" +
      "</tr>";
  }).join("");
}

/* ---------- Login / logout ---------- */
function handleLogin(event) {
  event.preventDefault();
  var user = document.getElementById("username").value.trim();
  var pass = document.getElementById("password").value;

  if (user === "" || pass === "") {
    setLoginError("Username and password cannot be empty.");
    return;
  }
  if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
    sessionStorage.setItem("stm_logged_in", "true");
    showApp();
  } else {
    setLoginError("Incorrect username or password. Please try again.");
  }
}

function setLoginError(message) {
  var el = document.getElementById("login-error");
  el.textContent = message;
}

function handleLogout() {
  sessionStorage.removeItem("stm_logged_in");
  document.getElementById("login-form").reset();
  document.getElementById("login-error").textContent = "";
  showLoginForm();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("task-form").addEventListener("submit", handleTaskSubmit);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("cancel-edit-btn").addEventListener("click", resetFormMode);

  if (isLoggedIn()) {
    showApp();
  } else {
    showLoginForm();
  }
});
