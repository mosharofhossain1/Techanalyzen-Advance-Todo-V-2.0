// #### Elements Select
const newTaskForm = document.getElementById('form');
const tbody = document.getElementById('tbody');

// #### utilites 
function getUI() {
    return Date.now() + Math.round(Math.random() * 1000).toString()
}

// ### Loacal Storage 
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
    const id = getUI()
    const tasks = {
        id,
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


// ## UI handler 
// create tr
function createTr({ name, status, priority, date, id }, index) {
    const formatedDate = new Date(date).toDateString();
    return ` <tr>
               <td>${index + 1}</td>
                <td>${name}</td>
                <td>${priority}</td>
                <td>${status ? 'compleate' : 'Incompleate'}</td>
                <td>${formatedDate}</td>
                <td>
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
            </tr>`
}

// update ui
function updateUI() {
    const tasks = getTasktoLocalStorage();
    const taskHtmlArray = tasks.map((task, index) => {
        return createTr(task, index)
    })
    const taskList = taskHtmlArray.join("");
    tbody.innerHTML = taskList;
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
    }

}
// ### event listener
newTaskForm.addEventListener('submit', newTaskFormHandler);
tbody.addEventListener('click', actionHandler);
