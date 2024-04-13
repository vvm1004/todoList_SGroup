
let popupContainer = document.querySelector(".popup-container")
let popupMain = document.querySelector(".popup-main")
let newTaskButton = document.getElementById('newTaskButton')
let todoBox = document.querySelector(".todo-box");
let currentDate = new Date();
let formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
let formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

//open popup
newTaskButton.addEventListener('click', function () {
    document.getElementById("field-category").value = '';
    document.getElementById("field-title").value = '';
    document.getElementById("field-content").value = '';
    popupContainer.classList.toggle('hidden')

});
//close popup
popupContainer.addEventListener('click', function () {
    popupContainer.classList.toggle('hidden')
})


//prevent main popup close
popupMain.addEventListener('click', function (event) {
    event.stopPropagation()
})


// Hàm tạo box nhiệm vụ mới
function createTodoBox(index, category, title, content, formattedDate, formattedTime) {
    // var currentDate = new Date();
    // var formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // var formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return `
        <div class="box" id="task-${index}" data-index="${index}" draggable="true">
            <div class="category">${category}
                <div class="category__img">
                    <img src="./assests/icon/edit.svg" alt="" onclick="openEditPopupWithDetails(${index})"> 
                    <img src="./assests/icon/delete.svg" alt="" onclick="onDelete(${index})">
                </div>
            </div>
            <div class="title">${title}</div>
            <div class="title-line"></div>
            <div class="content">${content}</div>
            <div class="date-time">
                <img src="./assests/icon/Frame.svg" alt="">
                ${formattedDate}, ${formattedTime}
            </div>
        </div>
    `;
}



//--------------EDIT-------------------------

let editPopupContainer = document.querySelector(".edit-popup");
let popupMain2 = document.querySelector(".popup-main2");


//close popup
editPopupContainer.addEventListener('click', function () {
    editPopupContainer.classList.toggle('hidden')
})


//prevent main popup close
popupMain2.addEventListener('click', function (event) {
    event.stopPropagation()
})
// Function to open edit popup with task details filled in
function openEditPopupWithDetails(index) {
    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    var todo = todos[index];
    document.getElementById("edit-field-category").value = todo.categoryName;
    document.getElementById("edit-field-title").value = todo.title;
    document.getElementById("edit-field-content").value = todo.content;
    let status = todo.status;
    document.getElementById(status.toLowerCase()).checked = true;
    document.getElementById("edit-task-index").value = index; // Lưu vị trí của nhiệm vụ trong danh sách
    editPopupContainer.classList.toggle('hidden');
}



// Function to add a new task
function addNewTask(categoryName, title, content) {
    // Get current tasks from localStorage
    var todos = JSON.parse(localStorage.getItem('todos')) || [];


    // Add the new task to the array
    todos.push({ categoryName: categoryName, title: title, content: content, status: 'ToDo', formattedDate: formattedDate, formattedTime: formattedTime });

    // Save the updated tasks back to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));

    // Render tasks based on their status
    renderTasks();
}

// Function to remove a task
function removeTask(index) {
    // Get current tasks from localStorage
    var todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Remove the task at the specified index
    todos.splice(index, 1);

    // Save the updated tasks back to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));

    // Render tasks based on their status
    renderTasks();
}

// Function to update a task
function updateTask(index, newCategoryName, newTitle, newContent, newStatus) {
    // Get current tasks from localStorage
    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    // Check if the index is valid
    if (index >= 0 && index < todos.length) {
        // Remove the task from its current position
        var updatedTask = todos.splice(index, 1)[0];

        // Update the task
        updatedTask.categoryName = newCategoryName;
        updatedTask.title = newTitle;
        updatedTask.content = newContent;
        updatedTask.status = newStatus;
        updatedTask.formattedDate = formattedDate;
        updatedTask.formattedTime = formattedTime

        // Add the updated task to the end of the list
        todos.push(updatedTask);

        // Save the updated tasks back to localStorage
        localStorage.setItem("todos", JSON.stringify(todos));
        editPopupContainer.classList.add('hidden');

        // Render tasks based on their status
        renderTasks();
    } else {
        console.error("Invalid task index.");
    }
}


// Function to render tasks based on their status
function renderTasks() {
    // Get current tasks from localStorage
    var todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Clear existing task boxes and counters
    var todoContainer = document.querySelector(".todo-box");
    var doingContainer = document.querySelector(".doing-box");
    var completedContainer = document.querySelector(".completed-box");
    var blockedContainer = document.querySelector(".blocked-box");
    todoContainer.innerHTML = "";
    doingContainer.innerHTML = "";
    completedContainer.innerHTML = "";
    blockedContainer.innerHTML = "";

    // Initialize counters
    var todoCount = 0;
    var doingCount = 0;
    var completedCount = 0;
    var blockedCount = 0;

    // Loop through tasks and render them in corresponding boxes based on their status
    todos.forEach(function (todo, index) {
        var todoHTML = createTodoBox(index, todo.categoryName, todo.title, todo.content, todo.formattedDate, todo.formattedTime);
        if (todo.status === "ToDo") {
            todoContainer.innerHTML += todoHTML;
            todoCount++;
        } else if (todo.status === "Doing") {
            doingContainer.innerHTML += todoHTML;
            doingCount++;
        } else if (todo.status === "Completed") {
            completedContainer.innerHTML += todoHTML;
            completedCount++;
        } else if (todo.status === "Blocked") {
            blockedContainer.innerHTML += todoHTML;
            blockedCount++;
        }
    });

    // Update the number-text spans with the counts
    document.querySelector(".todo .number-text").textContent = todoCount;
    document.querySelector(".doing .number-text").textContent = doingCount;
    document.querySelector(".completed .number-text").textContent = completedCount;
    document.querySelector(".blocked .number-text").textContent = blockedCount;
}
// Function to clear validation effect for a specific input field
function clearValidationForField(fieldId) {
    document.getElementById(fieldId).classList.remove("input-error");
}
// Function to clear validation effects
function clearValidation() {
    document.getElementById("field-category").classList.remove("input-error");
    document.getElementById("field-title").classList.remove("input-error");
    document.getElementById("field-content").classList.remove("input-error");
    document.getElementById("edit-field-category").classList.remove("input-error");
    document.getElementById("edit-field-title").classList.remove("input-error");
    document.getElementById("edit-field-content").classList.remove("input-error");
}
popupContainer.addEventListener('click', function () {
    clearValidation()
})

// Function to validate input fields
function validateFields(category, title, content) {
    if (!category || !title || !content) {
        if (!category) {
            document.getElementById("field-category").classList.add("input-error");
        }
        if (!title) {
            document.getElementById("field-title").classList.add("input-error");
        }
        if (!content) {
            document.getElementById("field-content").classList.add("input-error");
        }
        return false;
    }
    return true;
}


// Function to handle task submission
function onCreate() {

    var categoryName = document.getElementById("field-category");
    var title = document.getElementById("field-title");
    var content = document.getElementById("field-content");

    if (validateFields(categoryName.value, title.value, content.value)) {
        addNewTask(categoryName.value, title.value, content.value);
        document.querySelector(".popup-container").classList.add('hidden');
    }
}

// Clear validation when inputs are focused
document.getElementById("field-category").addEventListener("focus", function () {
    clearValidationForField("field-category");
});
document.getElementById("field-title").addEventListener("focus", function () {
    clearValidationForField("field-title");
});
document.getElementById("field-content").addEventListener("focus", function () {
    clearValidationForField("field-content");
});


// Function to handle task deletion
function onDelete(index) {
    removeTask(index);
}

function validateFieldsForUpdate(category, title, content) {

    if (!category || !title || !content) {
        if (!category) {
            document.getElementById("edit-field-category").classList.add("input-error");
        }
        if (!title) {
            document.getElementById("edit-field-title").classList.add("input-error");
        }
        if (!content) {
            document.getElementById("edit-field-content").classList.add("input-error");
        }
        return false;
    }
    return true;
}
editPopupContainer.addEventListener('click', function () {
    clearValidation()
})
// Clear validation when inputs are focused
document.getElementById("edit-field-category").addEventListener("focus", function () {
    clearValidationForField("edit-field-category");
});
document.getElementById("edit-field-title").addEventListener("focus", function () {
    clearValidationForField("edit-field-title");
});
document.getElementById("edit-field-content").addEventListener("focus", function () {
    clearValidationForField("edit-field-content");
});

// Function to handle task update
function onUpdate() {
    var index = document.getElementById("edit-task-index").value;
    var newCategoryName = document.getElementById("edit-field-category");
    var newTitle = document.getElementById("edit-field-title");
    var newContent = document.getElementById("edit-field-content");
    var radioValue = document.querySelector('input[name="radio"]:checked');

    if (validateFieldsForUpdate(newCategoryName.value, newTitle.value, newContent.value)) {
        updateTask(index, newCategoryName.value, newTitle.value, newContent.value, radioValue.value);
        document.querySelector(".edit-popup").classList.add('hidden');
    }
}

// Hàm tạo task ban đầu và lưu vào localStorage
function createInitialTask() {
    var initialTask = {
        categoryName: "Default Category",
        title: "Sample Task",
        content: "This is a sample task created initially.",
        status: "ToDo", // Trạng thái mặc định là "ToDo",
        formattedDate,
        formattedTime
    };

    // Kiểm tra xem có dữ liệu trong localStorage hay không
    var todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Thêm task ban đầu vào mảng todos
    todos.push(initialTask);

    // Lưu mảng tasks vào localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Gọi hàm tạo task ban đầu khi DOM được tải hoàn toàn
document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra xem đã có user trong localStorage hay chưa
    var user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        // Nếu không có user, chuyển hướng người dùng về trang index.html
        window.location.href = 'index.html';
    } else {
        // Kiểm tra xem đã có task trong localStorage chưa
        if (!localStorage.getItem("todos")) {
            // Nếu chưa có, tạo task ban đầu và lưu vào localStorage
            createInitialTask();
        }
        renderTasks()
    }

});


// Function to handle logout
function logout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Lắng nghe sự kiện click trên nút logout
document.getElementById('logoutButton').addEventListener('click', logout);


// Thêm sự kiện dragstart vào task box
document.addEventListener('dragstart', function (event) {
    if (event.target.classList.contains('box')) {
        // Lưu thông tin về task được kéo
        event.dataTransfer.setData('text/plain', event.target.id);
        // Thêm class 'dragging' để tạo hiệu ứng CSS khi kéo
        event.target.classList.add('dragging');
    }
});

// Thêm sự kiện dragover vào vùng đích
document.addEventListener('dragover', function (event) {
    event.preventDefault();
    // Hiển thị phản hồi trực quan cho người dùng
});

// Thêm sự kiện drop vào vùng đích
document.addEventListener('drop', function (event) {
    event.preventDefault();
    // Lấy thông tin về task được kéo
    var taskId = event.dataTransfer.getData('text/plain');
    console.log(taskId)
    var draggedTask = document.getElementById(taskId);
    console.log(draggedTask)

    // Tìm phần tử cha gần nhất có class là todo-container, doing-container, completed-container, hoặc blocked-container
    var targetContainer = event.target.closest('.todo-container, .doing-container, .completed-container, .blocked-container');
    if (targetContainer) {
        // Di chuyển task đến vị trí mới và cập nhật trạng thái
        targetContainer.querySelector('.box-container').appendChild(draggedTask);
        // Xóa class 'dragging' để loại bỏ hiệu ứng CSS khi kéo
        draggedTask.classList.remove('dragging');
        // Cập nhật trạng thái của task
        updateTaskStatus(taskId, targetContainer);
        // renderTasks(); // Hãy cập nhật lại giao diện sau khi thay đổi trạng thái của task
    }
});
// Function to update task status after drag and drop
function updateTaskStatus(taskId, targetContainer) {
    // Lấy trạng thái mới từ class của targetContainer
    var newStatus = targetContainer.classList.contains('todo-container') ? 'ToDo' :
                    targetContainer.classList.contains('doing-container') ? 'Doing' :
                    targetContainer.classList.contains('completed-container') ? 'Completed' :
                    targetContainer.classList.contains('blocked-container') ? 'Blocked' :
                    '';
    // Lấy chỉ số của task từ ID
    var index = taskId.split('-')[1];
    // Lấy ra danh sách tasks từ localStorage
    var todos = JSON.parse(localStorage.getItem('todos')) || [];
    // Kiểm tra xem chỉ số task có hợp lệ không
    if (index >= 0 && index < todos.length) {
        // Cập nhật trạng thái mới của task
        todos[index].status = newStatus;
        // Tính toán lại chỉ số mới của task dựa trên vị trí của targetContainer
        var newIndex = Array.from(targetContainer.querySelectorAll('.box')).indexOf(document.getElementById(taskId));
        // Di chuyển task tới vị trí mới trong danh sách
        var task = todos.splice(index, 1)[0];
        todos.splice(newIndex, 0, task);
        // Lưu danh sách tasks đã cập nhật vào localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
        // Cập nhật lại giao diện
        renderTasks();
    } else {
        console.error('Invalid task index.');
    }
}

// Thêm sự kiện dragend để cập nhật giao diện sau khi kéo và thả kết thúc
document.addEventListener('dragend', function (event) {
    // Xóa class 'dragging' cho tất cả các task box để loại bỏ hiệu ứng CSS khi kéo
    var draggedTasks = document.querySelectorAll('.box.dragging');
    draggedTasks.forEach(function (task) {
        task.classList.remove('dragging');
    });
});
