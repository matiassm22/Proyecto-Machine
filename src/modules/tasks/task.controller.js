const {
  getTasks,
  addTask,
  markAsDone,
  deleteTask
} = require('./task.service');

// obtener todas
function getAllTasks(req, res) {
  const tasks = getTasks();
  res.json(tasks);
}

// crear tarea manual (opcional)
function createTask(req, res) {
  const { titulo, fecha, hora } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Título requerido' });
  }

  addTask({ titulo, fecha, hora });

  res.json({ message: 'Tarea creada' });
}

//  completar tarea
function completeTask(req, res) {
  const { id } = req.params;

  markAsDone(id);

  res.json({ message: 'Tarea completada' });
}

//  eliminar tarea
function removeTask(req, res) {
  const { id } = req.params;

  deleteTask(id);

  res.json({ message: 'Tarea eliminada' });
}

module.exports = {
  getAllTasks,
  createTask,
  completeTask,
  removeTask
};