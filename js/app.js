// Elements Select
const newTaskForm = document.getElementById('form');
const tobody = document.getElementById('tbody');

// #### utilites 
function getUid(){
    return Date.now() + Math.round(Math.random() * 1000).toString();
}
// ########localStorage function 
// add singleTaskToloacalStorage
function addTaskTolocalStorage(task){
  const tasks = getAllTaskFromlocalStorage();
  tasks.push(task);
  addTasksTolocalStorage(tasks);
}
// getAlltaskTolocalStorage
function getAllTaskFromlocalStorage(){
    let tasks = [];
    const rowTask = localStorage.getItem('tasks');
    if(rowTask){
        tasks = JSON.parse(rowTask);
    } 
    return tasks;
}
// add multiple task
function addTasksTolocalStorage(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks));

}
// ########  handlers function
// event functions
function newTaskFormhandler(event){
    event.preventDefault();
    const id = getUid();
    const tasks = {
       id,
       status: 1,
    };

    [...newTaskForm.elements].forEach(element =>{
        if(element.name)
       tasks[element.name] = element.value;
    // console.log(element.name)
    })
    // tasks.id = getUid()
    // tasks.status = 0
    newTaskForm.reset();
    addTaskTolocalStorage(tasks)
}

// UI handlers 

// create tr
function createTr({name,priority, status,date, id},index){
    const formatedDate = new Date(date).toDateString();
        return `<tr id='${id}'>
                    <td>${index + 1}</td>
                    <td>${name}</td>
                    <td>${priority}</td>
                    <td>${status ? 'Compleate' : 'Incompleate'}</td>
                    <td>${formatedDate}</td>
                    <td>
                        <button id="edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button id="check">
                            <i class="fas fa-check"></i>
                        </button>
                        <button id="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`
};
// ui function 
function updateUI(){
    const tasks = getAllTaskFromlocalStorage();
    const taskHtmlArray = tasks.map((task,index) =>{
        return createTr(task,index)
    })
    const taskLists = taskHtmlArray.join("");
    tobody.innerHTML = taskLists;

}

updateUI();
// ####### addEvent listeners
newTaskForm.addEventListener('submit', newTaskFormhandler);