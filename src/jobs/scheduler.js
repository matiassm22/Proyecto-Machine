const { getPendingTasks, markAsDone } = require('../modules/tasks/task.service');
const { sendMessage } = require('../modules/whatsapp/whatsapp.service');

async function checkReminders() {
  const tasks = getPendingTasks();
  const now = new Date();

  tasks.forEach(async (task, index) => {

    const fechaHora = new Date(`${task.fecha}T${task.hora}`);
    const diff = fechaHora - now;

    //  10 minutos antes
    if (diff <= 600000 && diff > 0) {

      const mensaje = `⏰ Recordatorio

📌 ${task.titulo}
🕐 ${task.hora}
📅 ${task.fecha}

¡Te quedan 10 minutos!`;

      await sendMessage('56944095023', mensaje);

      markAsDone(index);
    }
  });
}

function startScheduler() {
  setInterval(() => {
    checkReminders();
  }, 60000); // cada 1 min
}

module.exports = { startScheduler };