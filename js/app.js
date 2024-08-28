// #### Elements Selection 
const newTaskForm = document.getElementById('form');
const tbody = document.getElementById('tbody');
const searchEl = document.getElementById('search');
const filterEi = document.getElementById('filter');
const sortEl = document.getElementById('sort');
const dateEl = document.getElementById('byDate');
const bulkArea = document.querySelector('.bulkArea');
const allSelect = document.getElementById('allSelect');
const dismiss = document.getElementById('dismiss');
const deleteBtn = document.getElementById('deleteBtn');
const editArea = document.getElementById('edit_area');
const editBtn = document.getElementById('editBtn');
const editForm = document.getElementById('Editform');



// #### utilites 
function getUI() {
    return Date.now() + Math.round(Math.random() * 1000).toString();
}

// ### Loacal Storage database 
// getTasktoLocalStorage 
function getTasktoLocalStorage() {
    let tasks = [];
    const rowTask = localStorage.getItem('tasks');
    if (rowTask) {
        tasks = JSON.parse(rowTask)
    }
    return tasks;
}
// add multiple task 
function addTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// add single task to localstorage
function addSingleTask(task) {
    const tasks = getTasktoLocalStorage();
    tasks.push(task);
    addTasksToLocalStorage(tasks)
}
// function handler 
function newTaskFormHandler(event) {
    event.preventDefault();
    const id = getUI();
    const tasks = {
        id: id,
        status: 0
    };
    [...newTaskForm.elements].forEach(element => {
        if (element.name) {
            tasks[element.name] = element.value;
        }

    });
    newTaskForm.reset()
    addSingleTask(tasks);
    updateUI()
}

// edit handler 
function editHandler(id) {
    const tasks = getTasktoLocalStorage();
    const task = tasks.find(task => task.id === id) || {};

    const { id: taskId, name, priority, status, date } = task;

    const taskTr = document.getElementById(id);

    // const statusTd = taskTr.querySelector('.status');


    // Task Name
    const taskNameTd = taskTr.querySelector('.taskName');
    const taskNameInp = document.createElement('input');
    taskNameInp.value = name;
    taskNameTd.innerHTML = '';
    taskNameTd.appendChild(taskNameInp);

    // Priority 
    const priorityTd = taskTr.querySelector('.priority');
    const priorityInp = document.createElement('select');
    priorityInp.innerHTML =
        `<option ${priority === 'high' ? 'selected' : ''} value ="high">High</option>
        <option ${priority === 'medium' ? 'selected' : ''} value ="medium">Medium</option>
        <option ${priority === 'low' ? 'selected' : ''} value ="low">Low</option>`
    priorityInp.value = priority;
    priorityTd.appendChild(priorityInp)


    // Status 
    const taskStatus = taskTr.querySelector(`.status`);
    const statusInput = document.createElement(`select`);
    statusInput.setAttribute(`id`, `editPrio`);
    statusInput.innerHTML = `<option  ${status === 0 ? "selected" : ""}>incomplete</option>
                            <option  ${status === 1 ? "selected" : ""}>completed</option>`;
    taskStatus.innerHTML = ``;
    taskStatus.appendChild(statusInput);

    // date 
    const dateTd = taskTr.querySelector('.date');
    dateInp = document.createElement('input');
    dateInp.type = 'date';
    dateInp.value = date;
    dateTd.innerHTML = '';
    dateTd.appendChild(dateInp);

    // action 
    const actionTd = taskTr.querySelector('.action');
    const saveBtn = document.createElement('button');
    saveBtn.addEventListener('click', () => {
        const name = taskNameInp.value;
        const priority = priorityInp.value;
        const date = dateInp.value;
        if (name && priority && date) {
            const newTask = {
                name,
                priority,
                date
            }
            const taskAfterEditing = { ...task, ...newTask }
            console.log(taskAfterEditing)
            const tasksAfterEditing = tasks.map((task) => {
                if (task.id === taskId) {
                    return taskAfterEditing;
                }
                return task;
            });
            addTasksToLocalStorage(tasksAfterEditing);
            console.log(tasksAfterEditing)
            updateUI();
        } else {
            alert("Please Fill Up All Input");
        }
    })
    saveBtn.classList.add('saveBtnStyle')
    saveBtn.textContent = 'Save';
    actionTd.innerHTML = '';
    actionTd.appendChild(saveBtn);
}

// ## UI handler 
// create tr
function createTr({ name, status, priority, date, id }, index) {
    const formatedDate = new Date(date).toDateString();
    return ` <tr id="${id}">
               <td>
                    <input class="checkbox" data-id="${id}" data-checkId="${id}" type="checkbox"/>
               </td>
               <td>${index + 1}</td>
                <td class="taskName">${name}</td>
                <td class="priority">${priority}</td>
                <td class="status">${status ? 'Compleate' : 'Pending'}</td>
                <td class="date">${formatedDate}</td>
                <td class="action">
                <button data-id="${id}" id="edit">
                 <i class="fas fa-pen"></i>
                 </button>
                 <button data-id="${id}" id="check">
                  <i class="fas fa-check"></i>
                   </button>
                 <button data-id="${id}" id="delete">
                      <i class="fas fa-trash"></i>
                 </button>
                  </td>
            </tr> 
            `
}

// initiale state 
function getInitialState() {
    return getTasktoLocalStorage().reverse();
}

// update ui
function updateUI(tasks = getInitialState()) {
    // console.log(tasks)
    const taskHtmlArray = tasks.map((task, index) => {
        return createTr(task, index)
    })
    const taskList = taskHtmlArray.join("");
    tbody.innerHTML = taskList || " <center>Search Not Found</center>";
}
updateUI();

// delete handler 
function deleteHandler(id) {
    const tasks = getTasktoLocalStorage();
    const taskAfterDeleting = tasks.filter(({ id: taskId }) => taskId !== id)
    addTasksToLocalStorage(taskAfterDeleting);
    updateUI();
}
// compleate/ incompleate handler
function statusHandler(id) {
    const tasks = getTasktoLocalStorage();
    const taskAfterUpdating = tasks.map((task) => {
        if (task.id === id) {
            if (task.status === 0) {
                task.status = 1;
            }
            else {
                task.status = 0;
            }
        }
        return task;
    });
    addTasksToLocalStorage(taskAfterUpdating);
    updateUI();
}
// ### action handler 
function actionHandler(e) {
    const { target: { id: actionId, dataset: { id: taskId } = {} }, } = e;

    // const { dataset: { id } } = target; [wrong way ]
    if (actionId === 'delete') {
        // const id =target.dataset.id;
        // const { id } = target.dataset; [distractor system]
        deleteHandler(taskId);
    } else if (actionId === 'check') {
        statusHandler(taskId);
    } else if (actionId === 'edit') {
        // console.log(taskId)
        editHandler(taskId);
    };

};

// ###### Search and flter and sort functionaly 
// search function handler 
function handlingSearchWithTimer(searchText) {
    const tasks = getTasktoLocalStorage();
    const searchedText = tasks.filter(({ name }) => {
        name = name.toLowerCase();
        searchText = searchText.toLowerCase();
        return name.includes(searchText)
    })
    updateUI(searchedText)
}

// search Timing Control 
let timer;
function searchHandler(e) {
    const { value: searchText } = e.target;
    clearTimeout(timer);
    timer = setTimeout(() => handlingSearchWithTimer(searchText), 1000)
}

// filter handler
function filterHandler(e) {
    const filterInput = e.target.value;

    filterAndRender(filterInput);
}

function filterAndRender(filterInput) {
    const tasks = getTasktoLocalStorage();

    let tasksAfterFiltering = tasks;
    switch (filterInput) {
        case `all`:
            tasksAfterFiltering = tasks;
            break;
        case `1`:
            tasksAfterFiltering = tasks.filter((task) => task.status === 1);
            break;
        case `0`:
            tasksAfterFiltering = tasks.filter((task) => task.status === 0);
            break;

        case `today`:
            tasksAfterFiltering = tasks.filter((task) => {
                const today = new Date().toISOString().split(`T`)[0]
                return today === task.date;
            });
            break;

        case `high`:
            tasksAfterFiltering = tasks.filter(task => task.priority === `high`)
            break;


        case `low`:
            tasksAfterFiltering = tasks.filter(task => task.priority === `low`)
            break;

        case `medium`:
            tasksAfterFiltering = tasks.filter(task => task.priority === `medium`)
            break;


    }
    updateUI(tasksAfterFiltering);
}

// sort Handler 
function sortHandler(e) {
    const sortInput = e.target.value;

    const tasks = getTasktoLocalStorage();

    let tasksAfterSorting = tasks.sort((taskA, taskB) => {
        const taskADate = new Date(taskA.date);
        const taskBDate = new Date(taskB.date);
        if (taskADate < taskBDate) {
            return sortInput === `newest` ? 1 : -1;

        } else if (taskADate > taskBDate) {
            return sortInput === `newest` ? -1 : 1;
        } else {
            return 0;
        }

    });


    updateUI(tasksAfterSorting);


}

// sort Handler
function dateHandler(e) {
    const selectedDate = e.target.value;

    const filteredTask = getTasktoLocalStorage().filter(task => task.date === selectedDate);
    updateUI(filteredTask);

}

// bulk section operations 
let selectedTasks = [];
function taskSelectionHandler(e) {
    const targetEl = e.target;
    if (targetEl.classList.contains("checkbox")) {
        const { id } = targetEl.dataset;
        if (targetEl.checked) {
            selectedTasks.push(id)
        }
        else {
            const selectedTaskIndex = selectedTask.findIndex((taskId) => taskId === id);
            if (selectedTaskIndex >= 0) {
                selectedTasks.splice(selectedTaskIndex, 1)
            }
        }
    }
    bulkActionToggler();
}

// bulkArea function 
function bulkActionToggler() {
    selectedTasks.length ? (bulkArea.style.display = 'flex') : (bulkArea.style.display = 'none');
    const tasks = getTasktoLocalStorage();
    if (tasks.length === selectedTasks.length && tasks.length > 0) {
        allSelect.checked = true;
    }
    else {
        allSelect.checked = false;
    }
}

// select handler
function allSelectHandler(e) {
    if (e.target.checked) {
        const tasks = getTasktoLocalStorage();
        selectedTasks = tasks.map((task) => task.id);
        selectedTasks.forEach((taskId) => {
            document.querySelector(`[data-checkId = '${taskId}']`).checked = true;
        })
    }
    else {
        selectedTasks.forEach((taskId) => {
            document.querySelector(`[data-checkId = '${taskId}']`).checked = false;
        });
        selectedTasks = [];
    }
    bulkActionToggler();
}

// dismiss handler
function dismissHandler(e) {
    selectedTasks.forEach((taskId) => {
        document.querySelector(`[data-checkId = '${taskId}']`).checked = false;
    });
    selectedTasks = [];
    bulkActionToggler();
}

// delete Btn Handler
function deleteBtnHandler() {
    const isConfarm = confirm("Are Yoy Sure Delete This Task");
    if (isConfarm) {
        const tasks = getTasktoLocalStorage();
        const taskAfterDeleting = tasks.filter((task) => {
            if (selectedTasks.includes(task.id)) return false;
            return true;
        })
        addTasksToLocalStorage(taskAfterDeleting);
        updateUI(taskAfterDeleting);
        selectedTasks = [];
        bulkActionToggler();
    }
}

// bulkEditBtnHandler function
function bulkEditBtnAreaToogler() {
    editArea.style.display === 'block' ? (editArea.style.display = 'none') : (editArea.style.display = 'block');
}
function bulkEditBtnHandler() {
    bulkEditBtnAreaToogler();

}

// /'bulkEditFromHandler'
function bulkEditFromHandler(e) {
    e.preventDefault();
    const task = {};
    [...editForm.elements].forEach((element) => {
        if (element.name && element.value) {
            task[element.name] = element.value;

        }
    });
    editForm.reset();
    const tasks = getTasktoLocalStorage();
    const modifiedTasks = tasks.map((selectedTask) => {
        if (selectedTasks.includes(selectedTask.id)) {
            selectedTask = { ...selectedTask, ...task }
        }
        return selectedTask;
    })
    console.log(modifiedTasks)
    addTasksToLocalStorage(modifiedTasks);
    updateUI(modifiedTasks);
    bulkEditBtnAreaToogler();
    selectedTasks = [];
    bulkActionToggler();
}
// ### event listeners
newTaskForm.addEventListener('submit', newTaskFormHandler);
tbody.addEventListener('click', actionHandler);
searchEl.addEventListener('input', searchHandler);
filterEi.addEventListener('input', filterHandler);
sortEl.addEventListener('input', sortHandler);
dateEl.addEventListener('input', dateHandler);
tbody.addEventListener('input', taskSelectionHandler);
allSelect.addEventListener('input', allSelectHandler);
dismiss.addEventListener('click', dismissHandler);
deleteBtn.addEventListener('click', deleteBtnHandler);
editBtn.addEventListener('click', bulkEditBtnHandler);
editForm.addEventListener('submit', bulkEditFromHandler);