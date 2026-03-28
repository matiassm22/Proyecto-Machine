const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  createTask,
  completeTask,
  removeTask
} = require('../modules/tasks/task.controller');

router.get('/', getAllTasks);
router.post('/', createTask);
router.patch('/:id', completeTask);
router.delete('/:id', removeTask);

module.exports = router;