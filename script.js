/* ===========================================
   KANBAN PRO - PART 3A-1
   Variables + LocalStorage + Render Tasks
=========================================== */

// ---------------- ELEMENTS ----------------

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const prioritySelect = document.getElementById("priority");
const searchInput = document.getElementById("searchTask");

const todoList = document.getElementById("todo");
const progressList = document.getElementById("progress");
const doneList = document.getElementById("done");

const template = document.getElementById("task-template");

// ---------------- STATS ----------------

const totalTasks = document.getElementById("totalTasks");
const progressTasks = document.getElementById("progressTasks");
const completedTasks = document.getElementById("completedTasks");

const todoCount = document.getElementById("todo-count");
const progressCount = document.getElementById("progress-count");
const doneCount = document.getElementById("done-count");

// ---------------- STORAGE ----------------

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

// ---------------- SAVE ----------------

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// ---------------- CREATE TASK ----------------

function createTask(title, priority) {

    return {
        id: Date.now().toString(),
        title: title,
        priority: priority,
        status: "todo",
        created: new Date().toLocaleDateString()
    };

}

// ---------------- ADD TASK ----------------

function addTask() {

    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    const task = createTask(
        title,
        prioritySelect.value
    );

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

}

// ---------------- RENDER ----------------

function renderTasks(filtered = tasks) {

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    filtered.forEach(task => {

        const clone =
            template.content.firstElementChild.cloneNode(true);

        clone.dataset.id = task.id;

        // Title
        clone.querySelector(".task-title").textContent =
            task.title;

        // Priority
        const badge =
            clone.querySelector(".priority");

        badge.textContent =
            task.priority;

        badge.classList.remove(
            "low",
            "medium",
            "high"
        );

        badge.classList.add(
            task.priority.toLowerCase()
        );

        // Date
        clone.querySelector(".task-footer span")
            .innerHTML =
            `<i class="fa-regular fa-clock"></i> ${task.created}`;

        // Buttons

        clone.querySelector(".edit-btn")
            .addEventListener(
                "click",
                () => editTask(task.id)
            );

        clone.querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => deleteTask(task.id)
            );

        // Drag
        clone.draggable = true;

        clone.addEventListener(
            "dragstart",
            dragStart
        );

        clone.addEventListener(
            "dragend",
            dragEnd
        );

        // Append

        if (task.status === "todo") {

            todoList.appendChild(clone);

        }

        else if (task.status === "progress") {

            progressList.appendChild(clone);

        }

        else {

            doneList.appendChild(clone);

        }

    });

    updateCounts();

}

// ---------------- BUTTON ----------------

addTaskBtn.addEventListener(
    "click",
    addTask
);

// Enter Key

taskInput.addEventListener(
    "keypress",
    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }
);


/* ===========================================
   KANBAN PRO - PART 3A-2
   Edit + Delete + Counts + Initialize
=========================================== */

// ---------------- EDIT TASK ----------------

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const updatedTitle = prompt(
        "Edit your task:",
        task.title
    );

    if (updatedTitle === null) return;

    const value = updatedTitle.trim();

    if (!value) {
        alert("Task cannot be empty.");
        return;
    }

    task.title = value;

    saveTasks();

    renderTasks();

}

// ---------------- DELETE TASK ----------------

function deleteTask(id) {

    const confirmDelete = confirm(
        "Delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}

// ---------------- COUNTS ----------------

function updateCounts() {

    const todo = tasks.filter(
        task => task.status === "todo"
    ).length;

    const progress = tasks.filter(
        task => task.status === "progress"
    ).length;

    const done = tasks.filter(
        task => task.status === "done"
    ).length;

    todoCount.textContent = todo;

    progressCount.textContent = progress;

    doneCount.textContent = done;

    totalTasks.textContent = tasks.length;

    progressTasks.textContent = progress;

    completedTasks.textContent = done;

}

// ---------------- SEARCH ----------------

if (searchInput) {

    searchInput.addEventListener("input", function () {

    console.log(this.value);

    const keyword = this.value.toLowerCase().trim();

    const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(keyword)
    );

    renderTasks(filtered);

});

}

// ---------------- INITIAL RENDER ----------------

renderTasks();
updateCounts();

// ---------------- AUTO SAVE ----------------

window.addEventListener("beforeunload", () => {

    saveTasks();

});



/* ===========================================
   KANBAN PRO - PART 3B
   Drag & Drop + Date + Theme Toggle
=========================================== */

let draggedTask = null;

// ---------------- DRAG START ----------------

function dragStart() {

    draggedTask = this;

    setTimeout(() => {

        this.classList.add("dragging");

    }, 0);

}

// ---------------- DRAG END ----------------

function dragEnd() {

    this.classList.remove("dragging");

    draggedTask = null;

}

// ---------------- DROP ZONES ----------------

document.querySelectorAll(".task-list").forEach(list => {

    list.addEventListener("dragover", e => {

        e.preventDefault();

        list.classList.add("drag-over");

    });

    list.addEventListener("dragleave", () => {

        list.classList.remove("drag-over");

    });

    list.addEventListener("drop", function (e) {

        e.preventDefault();

        list.classList.remove("drag-over");

        if (!draggedTask) return;

        const id = draggedTask.dataset.id;

        const task = tasks.find(t => t.id === id);

        if (!task) return;

        task.status = this.id;

        saveTasks();

        renderTasks();

    });

});

// ---------------- TODAY DATE ----------------

const todayDate = document.getElementById("todayDate");

if (todayDate) {

    const options = {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    };

    todayDate.textContent =
        new Date().toLocaleDateString(
            "en-US",
            options
        );

}

// ---------------- THEME TOGGLE ----------------

const themeBtn = document.getElementById("themeToggle");

const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    body.classList.add("dark-mode");

    if (themeBtn) {

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        } else {

            localStorage.setItem("theme", "light");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

        }

    });

}

// ---------------- SMOOTH BUTTON EFFECT ----------------

document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("mousedown", () => {

        btn.style.transform = "scale(.96)";

    });

    btn.addEventListener("mouseup", () => {

        btn.style.transform = "";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "";

    });

});

// ---------------- WELCOME ----------------

console.log("✅ Kanban Pro Loaded Successfully");