// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
const myModal = new bootstrap.Modal('#exampleModal', {
    keyboard: false
})
// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = nextId * 1 + 1;
    }
    localStorage.setItem("nextId", nextId);
    return nextId;
}
// Todo: create a function to create a task card
function createTaskCard(task) {
    let d = new Date(task.date).getTime();
    let n = Date.now();
    let classes = "light";
    if (d - n < 0) {
        classes = "danger";
    } else if (d - n < 1000 * 60 * 60 * 24) {
        classes = "warning";
    }
    const card = `
    <div class="todo-item card mb-3 bg-${classes}" draggable="true" data-id="${task.id}">
        <div class="card-header">
            <h3>${task.title}</h3>
        </div>
        <div class="card-body">
            <p>${task.description}</p>
            <p class="date">
                ${task.date}
            </p>
            <button class="btn btn-outline-secondary task-delete" data-id="${task.id}">Delete</button>
        </div>
    </div>
    `;

    $(card).on("dragstart", function (event) {
        dragItem = this;
    });
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    taskList.sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(function (task) {
            if(task.todo == 1){
                $("#todo-cards").append(createTaskCard(task));
            }else if(task.todo == 2){
                $("#in-progress-cards").append(createTaskCard(task));
            }else if(task.todo == 3){
                $("#done-cards").append(createTaskCard(task));
                $("#done-cards").find(".todo-item").removeClass("bg-danger").removeClass("bg-warning");
                
            }
        });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    let title = $("#task-title").val().trim();
    let description = $("#task-description").val().trim();

    if (title && description) {
        const task = {
            id: generateTaskId(),
            title,
            description,
            date: $("#datepicker").val(),
            todo: 1
        };
        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        $("#task-title").val("");
        $("#task-description").val("");
        $("#datepicker").val("");
        myModal.hide();
        renderTaskList();
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).data("id");
    taskList = taskList.filter(function (task) {
        return task.id !== parseInt(taskId);
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(ui.dataset);
    console.log(event);
    if(event.currentTarget.id == "in-progress"){

        taskList.find(task => task.id == ui.dataset.id).todo = 2;
    }else if(event.currentTarget.id == "done"){
        taskList.find(task => task.id == ui.dataset.id).todo = 3;
    }else{
        taskList.find(task => task.id == ui.dataset.id).todo = 1;
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#datepicker").datepicker();
    $("#task-add").on("click", handleAddTask);

    $("#to-do .card-body.bg-light").on("click", ".task-delete", function (event) {
        handleDeleteTask(event);
    });
    let dragItem = null;
    $(".todo-item").on("dragstart", function (event) {
        dragItem = this;
    });
    $('#in-progress').on("drop", function (event) {
        event.preventDefault();
        handleDrop(event, dragItem);
    }).on("dragover", function (event) {
        event.preventDefault();
    });
    $('#done').on("drop", function (event) {
        event.preventDefault();
        handleDrop(event, dragItem);
    }).on("dragover", function (event) {
        event.preventDefault();
    });
    $('#to-do').on("drop", function (event) {
        event.preventDefault();
        handleDrop(event, dragItem);
    }).on("dragover", function (event) {
        event.preventDefault();
    });
});
