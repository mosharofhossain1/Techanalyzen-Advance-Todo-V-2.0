// selecting html element for manupulating

const newTaskFrom = document.getElementById(`form`); //step1--------------

const tBody = document.getElementById(`tbody`); // 15-----------------

const bulkSearch = document.getElementById(`search`);

const bulkFilter = document.getElementById(`filter`);
const bulkSort = document.getElementById(`sort`);

const bulkDate = document.getElementById(`by_date`);




const bulkButtonsArea = document.getElementById(`bulk_action`);

const allSelect = document.getElementById(`checkbox`);

const dismiss = document.getElementById(`dismiss`);


const deleteButton = document.getElementById(`delete_btn`);

const editButton = document.getElementById(`edit_btn`);

const editSection = document.getElementById(`edit_section`);

const editForm = document.getElementById(`edit_form`);

const editSubmitButton = document.getElementById(`edit_submit_btn`);





// ================= all utilitis function is here =================

// step 6-----------------
function getUnicId() {
  return Date.now() + Math.round(Math.random() * 10000).toString();
}

// =========================local storage / data base is here ===============

// get all task from localStorage
//step 9---------------------------------

function getAllTaskFromLocalStorage() {
  let tasks = [];

  const rowTask = localStorage.getItem(`tasks`);

  if (rowTask) {
    tasks = JSON.parse(rowTask);
  }
  return tasks;
}

// add tasks to local storage
//step 10----------------------------------

function addTasksToLocalStorage(tasks) {
  localStorage.setItem(`tasks`, JSON.stringify(tasks));
  // updateToUi();
}

// add task to localstorage
//step 7-------------------

function addSingleTaskToLocalStorageArray(task) {
  const tasks = getAllTaskFromLocalStorage();

  tasks.push(task);
  addTasksToLocalStorage(tasks);
  updateToUi();
}

// // ====================== all handler functions is here ================

// actionHandler

function actionHandler(e) {
  const {
    target: { id: actionId, dataset: { id: taskId } = {} },
  } = e;

  if (actionId === `delete`) {
    deleteHandler(taskId);
  } else if (actionId === `check`) {
    statusHandler(taskId);
  } else if (actionId === `edit`) {
    editHandler(taskId);

  }
}

// // deleteHandler

function deleteHandler(id) {
  const tasks = getAllTaskFromLocalStorage();

  const tasksAfterDeleting = tasks.filter(({ id: taskId }) => taskId !== id);
  addTasksToLocalStorage(tasksAfterDeleting);
  updateToUi();
}

// status handler

function statusHandler(id) {
  const tasks = getAllTaskFromLocalStorage();

  const taskAfterChanging = tasks.map((task) => {
    if (task.id === id) {
      if (task.status === 0) {
        task.status = 1;
      } else {
        task.status = 0;
      }
    }

    return task;
  });
  addTasksToLocalStorage(taskAfterChanging);
  updateToUi();
}

// edit handler==================================

function editHandler(id) {
  const tasks = getAllTaskFromLocalStorage();
  const task = tasks.find((task) => task.id === id) || {};


  const { id: taskId, name, priority, status, date } = task;

  const taskTr = document.getElementById(id);

  //taskName
  const taskNameTd = taskTr.querySelector(`.three`);
  const taskNameInput = document.createElement(`input`);
  taskNameInput.setAttribute(`class`, `taskNameEdit`);
  taskNameInput.value = name;
  taskNameTd.innerHTML = ``;
  taskNameTd.appendChild(taskNameInput);

  //priority
  const taskPriority = taskTr.querySelector(`.for`);
  const priorityInput = document.createElement(`select`);
  priorityInput.setAttribute(`id`, `editPrio`);
  priorityInput.innerHTML = `<option class="same_style" ${priority === "high" ? "selected" : ""
    } value="high">High</option>
                            <option class="same_style" ${priority === "medium" ? "selected" : ""
    } value="medium">Medium</option>
                            <option class="same_style" ${priority === "low" ? "selected" : ""
    } value="low">Low</option>`;

  taskPriority.innerHTML = ``;

  taskPriority.appendChild(priorityInput);

  //status

  const taskStatus = taskTr.querySelector(`.five`);
  const statusInput = document.createElement(`select`);
  statusInput.setAttribute(`id`, `editPrio`);
  statusInput.innerHTML = `<option class="same_style" ${status === 0 ? "selected" : ""}>incomplete</option>
                          <option class="same_style" ${status === 1 ? "selected" : ""}>completed</option>`;
  taskStatus.innerHTML = ``;
  taskStatus.appendChild(statusInput);

  //date

  const taskDate = taskTr.querySelector(`.six`);
  const dateInput = document.createElement(`input`);
  dateInput.setAttribute(`class`, `editDate`);
  dateInput.type = "date";
  dateInput.value = date;
  taskDate.innerHTML = ``;
  taskDate.appendChild(dateInput);

  // action buttons

  const taskAction = taskTr.querySelector(`.saven`);
  const saveBtn = document.createElement(`button`);
  saveBtn.setAttribute(`class`, `upButton`);
  saveBtn.addEventListener(`click`, () => {
    const name = taskNameInput.value;
    const priority = priorityInput.value;
    const date = dateInput.value;
    // kera-moti
    let status;
    let tempValue = statusInput.value;
    if (tempValue == `completed`) {
      status = 1;
    } else {
      status = 0;
    }

    if (name) {
      const newTask = {
        name,
        priority,
        date,
        status,
      };

      const taskAfterEditing = { ...task, ...newTask };

      const loadAllTask = tasks.map((task) => {
        if (task.id === taskId) {
          return taskAfterEditing;
        }
        return task;
      });

      addTasksToLocalStorage(loadAllTask);
      updateToUi();
    } else {
      alert(`edit properly..`);
    }
    // hll
  });
  saveBtn.textContent = `Update`;
  taskAction.innerHTML = ``;
  taskAction.appendChild(saveBtn);
}

// new task creation......

//step 3-----------
function newTaskFromHandler(e) {
  // from submit er por auto reload k bondho korar jonno..
  e.preventDefault(); //step 4

  const id = getUnicId();
  //step 5 -----------
  const task = {
    status: 0,
    id,
  };
  // step4--------------
  [...newTaskFrom.elements].forEach((element) => {
    if (element.name) {
      task[element.name] = element.value;
    }
  });

  newTaskFrom.reset(); //step 11------------------

  addSingleTaskToLocalStorageArray(task); //step 8 --------------------------
}

// Ui functionalities

// create tr

//step 13-----------------------------

function createTr({ name, priority, status, date, id }, index) {
  const formattedDate = new Date(date).toDateString();
  return ` <tr class="body_tr" id="${id}">
    <td class="one"><input class="checkbox"  data-id='${id}' data-checkId='${id}' type="checkbox"></td>
    <td class="two">${index}</td>
    <td class="three">${name}</td>
    <td class="for">${priority}</td>
    <td class="five">${status ? `completed` : `incomplete`}</td>
    <td class="six">${formattedDate}</td>
    <td class="saven">
      <button data-id="${id}" id="edit"><i class="fa-regular fa-pen-to-square"></i></button>
      <button data-id="${id}"  id="check"><i class="fa-regular fa-square-check"></i></button>
      <button data-id="${id}"  id="delete"><i class="fa-solid fa-trash-can"></i></button>
    </td>
  </tr>`;
}

// update ui


// get initialstate 

function getInitialState() {
  return getAllTaskFromLocalStorage().reverse();
}
// step 12--------------------------
function updateToUi(tasks = getInitialState()) {
  const taskHtmlArray = tasks.map((task, index) => {
    return createTr(task, index + 1);
  });

  const taskLists = taskHtmlArray.join(``); //step 14--------------------

  tBody.innerHTML = taskLists || `<center class ='nothing'>Nothing To Show</center>` //step16------------------
}
updateToUi();

// all bulk oparation is here =====================================================================

// search oparation==

// search handler ================

function handlingSearchWithTimer(searchValue) {
  const tasks = getAllTaskFromLocalStorage();

  const searchedTasks = tasks.filter(({ name }) => {
    name = name.toLowerCase();
    searchValue = searchValue.toLowerCase();
    return name.includes(searchValue);
  });
  updateToUi(searchedTasks);
}

let timer;
function bulkSearchHandler(e) {
  const { value: searchValue } = e.target;
  clearTimeout(timer);
  timer = setTimeout(() => handlingSearchWithTimer(searchValue), 1000);
}

//  filter handler ======================

function bulkFilterHandler(e) {
  const filterInput = e.target.value;

  filterAndRender(filterInput);
}

function filterAndRender(filterInput) {
  const tasks = getAllTaskFromLocalStorage();

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
  updateToUi(tasksAfterFiltering);
}

// sort handler 

function sortHandler(e) {
  const sortInput = e.target.value;

  const tasks = getAllTaskFromLocalStorage();

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


  updateToUi(tasksAfterSorting);


}



// sort by date handler 

function bulkDateHandler(e) {
  const selectedDate = e.target.value;

  const filteredTask = getAllTaskFromLocalStorage().filter(task => task.date === selectedDate);
  updateToUi(filteredTask);

}


//  bulkAction section start =======================
let selectedTaskIdArray = [];

function taskSelectionHandler(e) {

  const targetEle = e.target;
  if (targetEle.classList.contains('checkbox')) {
    const { id } = targetEle.dataset;
    if (targetEle.checked) {
      selectedTaskIdArray.push(id);
    } else {
      const selectedTaskIndex = selectedTaskIdArray.findIndex((taskId) => taskId === id);
      if (selectedTaskIndex >= 0) {
        selectedTaskIdArray.splice(selectedTaskIndex, 1);
      }
    }
  }
  bulkActionToggler();

}


function bulkActionToggler() {
  selectedTaskIdArray.length ? (bulkButtonsArea.style.display = `flex`) : (bulkButtonsArea.style.display = `none`)
  const tasks = getAllTaskFromLocalStorage();

  if (tasks.length === selectedTaskIdArray.length && tasks.length > 0) {
    allSelect.checked = true;
  } else {
    allSelect.checked = false;
  }
}

function allSelectHandler(e) {
  if (e.target.checked) {
    const tasks = getAllTaskFromLocalStorage();
    selectedTaskIdArray = tasks.map((task) => task.id);
    selectedTaskIdArray.forEach((taskId) => {
      document.querySelector(`[data-checkId='${taskId}']`).checked = true;
    });
  } else {
    selectedTaskIdArray.forEach((taskId) => {
      document.querySelector(`[data-checkId='${taskId}']`).checked = false;
    });
    selectedTaskIdArray = [];
  }
  bulkActionToggler();
}

// dismiss handler 

function dismissHandler() {
  selectedTaskIdArray.forEach((taskId) => {
    document.querySelector(`[data-checkId='${taskId}']`).checked = false;
  });
  selectedTaskIdArray = [];
  bulkActionToggler();
}


// bulk delte handler 

function bulkDeleteHandler() {
  const isConfarm = confirm(`Are you sure to delete mulltiple items...?`);
  if (isConfarm) {
    const tasks = getAllTaskFromLocalStorage();
    const tasksAfterDeleting = tasks.filter((task) => {
      if (selectedTaskIdArray.includes(task.id)) return false;
      return true;
    });

    addTasksToLocalStorage(tasksAfterDeleting);
    updateToUi();
    selectedTaskIdArray = [];
    bulkActionToggler();
  }
};

// bulk edit handler 


// bulk toggler

function bulkEditAreaToggoler() {
  editSection.style.display === `block` ? (editSection.style.display = `none`) : (editSection.style.display = `block`)
}

function bulkEditHandler() {
  bulkEditAreaToggoler()
}



// form handler



function bulkEditFormHandler(e) {
  e.preventDefault();

  const task = {};
  [...editForm.elements].forEach((element) => {
    if (element.name && element.value) {
      task[element.name] = element.value;
    }
  });

  editForm.reset();
  const tasks = getAllTaskFromLocalStorage();

  const modifiedTasks = tasks.map(selectedTask => {
    if (selectedTaskIdArray.includes(selectedTask.id)) {
      selectedTask = { ...selectedTask, ...task };
    }
    return selectedTask;
  });
  addTasksToLocalStorage(modifiedTasks);
  updateToUi(modifiedTasks);
  bulkEditAreaToggoler();
  selectedTaskIdArray = [];
  bulkActionToggler();
}
// event listeners

newTaskFrom.addEventListener(`submit`, newTaskFromHandler); //step2----------------
tBody.addEventListener(`click`, actionHandler);
bulkSearch.addEventListener(`input`, bulkSearchHandler);
bulkFilter.addEventListener(`input`, bulkFilterHandler);
bulkSort.addEventListener(`input`, sortHandler);
bulkDate.addEventListener(`input`, bulkDateHandler);
tBody.addEventListener(`input`, taskSelectionHandler);
allSelect.addEventListener(`input`, allSelectHandler);
dismiss.addEventListener(`click`, dismissHandler);
deleteButton.addEventListener(`click`, bulkDeleteHandler);
editButton.addEventListener(`click`, bulkEditHandler);
editForm.addEventListener(`submit`, bulkEditFormHandler);
