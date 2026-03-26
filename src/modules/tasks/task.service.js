const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../../../tasks.json');

//  obtener tareas
function getTasks() {
  if (!fs.existsSync(tasksPath)) return [];
  return JSON.parse(fs.readFileSync(tasksPath));
}

//  guardar tareas
function saveTasks(tasks) {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
}

//  agregar tarea
function addTask(task) {
  const tasks = getTasks();

  tasks.push({
    ...task,
    recordado: false
  });

  saveTasks(tasks);
}

//  obtener pendientes
function getPendingTasks() {
  return getTasks().filter(t => !t.recordado);
}

//  marcar como recordado
function markAsDone(index) {
  const tasks = getTasks();

  if (tasks[index]) {
    tasks[index].recordado = true;
    saveTasks(tasks);
  }
}

module.exports = {
  addTask,
  getPendingTasks,
  markAsDone
};