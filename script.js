const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorMessage = document.getElementById("error-message");
const list = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const remainingCount = document.getElementById("remaining-count");
const filters = document.getElementById("filters");
const clearCompletedBtn = document.getElementById("clear-completed");

let tasks = [];
let currentFilter = "all";
let nextId = 1;
let editingId = null;

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}

function isDuplicate(text, ignoreId = null) {
    return tasks.some(function (task) {
        return task.id !== ignoreId && task.text.toLowerCase() === text.toLowerCase();
    });
}

function updateCounter() {
    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;
    totalCount.textContent = tasks.length;
    remainingCount.textContent = remaining;
}

function getVisibleTasks() {
    if (currentFilter === "active") {
        return tasks.filter(function (task) {
            return !task.completed;
        });
    }
    if (currentFilter === "completed") {
        return tasks.filter(function (task) {
            return task.completed;
        });
    }
    return tasks;
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;
    li.classList.toggle("completed", task.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    li.appendChild(checkbox);

    if (task.id === editingId) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "edit-input";
        editInput.value = task.text;
        li.appendChild(editInput);
    } else {
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;
        li.appendChild(span);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    li.appendChild(deleteBtn);

    return li;
}

function render() {
    list.innerHTML = "";
    const visible = getVisibleTasks();

    if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = "No tasks to show.";
        list.appendChild(empty);
    } else {
        visible.forEach(function (task) {
            list.appendChild(createTaskElement(task));
        });
    }

    updateCounter();

    const editInput = list.querySelector(".edit-input");
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

function findTask(id) {
    return tasks.find(function (task) {
        return task.id === id;
    });
}

function commitEdit(id, value) {
    const text = value.trim();
    const task = findTask(id);

    if (text === "") {
        showError("Task cannot be empty.");
        return false;
    }
    if (isDuplicate(text, id)) {
        showError("This task already exists.");
        return false;
    }

    task.text = text;
    editingId = null;
    clearError();
    render();
    return true;
}

function cancelEdit() {
    editingId = null;
    clearError();
    render();
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = input.value.trim();

    if (text === "") {
        showError("Task cannot be empty.");
        return;
    }
    if (isDuplicate(text)) {
        showError("This task already exists.");
        return;
    }

    tasks.push({ id: nextId++, text: text, completed: false });
    input.value = "";
    clearError();
    render();
    input.focus();
});

list.addEventListener("click", function (event) {
    const li = event.target.closest(".task-item");
    if (!li) {
        return;
    }
    const id = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(function (task) {
            return task.id !== id;
        });
        if (editingId === id) {
            editingId = null;
        }
        render();
        return;
    }

    if (event.target.type === "checkbox") {
        const task = findTask(id);
        task.completed = event.target.checked;
        li.classList.toggle("completed", task.completed);
        updateCounter();
        if (currentFilter !== "all") {
            render();
        }
    }
});

list.addEventListener("dblclick", function (event) {
    if (!event.target.classList.contains("task-text")) {
        return;
    }
    const li = event.target.closest(".task-item");
    editingId = Number(li.dataset.id);
    clearError();
    render();
});

list.addEventListener("keydown", function (event) {
    if (!event.target.classList.contains("edit-input")) {
        return;
    }
    const id = Number(event.target.closest(".task-item").dataset.id);

    if (event.key === "Enter") {
        commitEdit(id, event.target.value);
    } else if (event.key === "Escape") {
        cancelEdit();
    }
});

list.addEventListener("focusout", function (event) {
    if (!event.target.classList.contains("edit-input") || editingId === null) {
        return;
    }
    const id = Number(event.target.closest(".task-item").dataset.id);

    if (!commitEdit(id, event.target.value)) {
        cancelEdit();
    }
});

filters.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (!button) {
        return;
    }
    currentFilter = button.dataset.filter;

    filters.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn === button);
    });

    editingId = null;
    render();
});

clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });
    editingId = null;
    render();
});

render();