const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

  const newTask = {
    id: uuidv4(),
    titulo: task.titulo,
    fecha: task.fecha,
    hora: task.hora,
    estado: 'pendiente', // 👈 mejor que "recordado"
    origen: 'email',
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  console.log('✅ Tarea guardada:', newTask);
}

//  obtener pendientes
function getPendingTasks() {
  return getTasks().filter(t => t.estado === 'pendiente');
}

//  marcar como completada
function markAsDone(id) {
  const tasks = getTasks();

  const updated = tasks.map(task => {
    if (task.id === id) {
      return { ...task, estado: 'completado' };
    }
    return task;
  });

  saveTasks(updated);
}

//  eliminar tarea
function deleteTask(id) {
  const tasks = getTasks();
  const filtered = tasks.filter(task => task.id !== id);
  saveTasks(filtered);
}

module.exports = {
  addTask,
  getPendingTasks,
  markAsDone,
  deleteTask,
  getTasks
};