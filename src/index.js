require('dotenv').config();
require('./modules/whatsapp/whatsapp.service');
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const { getEmails } = require('./modules/email/email.service');
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Proyecto Machine funcionando correctamente');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

setTimeout(() => {
  getEmails();
}, 5000);