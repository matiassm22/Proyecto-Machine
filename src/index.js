require('dotenv').config();
require('./modules/whatsapp/whatsapp.service');

const express = require('express');
const authRoutes = require('./routes/auth.routes');
const { getEmails } = require('./modules/email/email.service');
const { startScheduler } = require('./jobs/scheduler');
const taskRoutes = require('./routes/task.routes');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use(express.static(path.join(__dirname, '../public')));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//  INICIAR RECORDATORIOS
startScheduler();

//  Ejecutar al inicio
getEmails();

//  Ejecutar cada 60 segundos
setInterval(() => {
  console.log('🔄 Revisando correos...');
  getEmails();
}, 60000);