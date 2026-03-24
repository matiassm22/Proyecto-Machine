const { google } = require('googleapis');
const oauth2Client = require('../../config/gmail');
const { analyzeEmail } = require('../ai/ai.service');
const { sendMessage } = require('../whatsapp/whatsapp.service');

const fs = require('fs');
const path = require('path');

// 📁 Ruta al archivo de correos procesados
const processedPath = path.join(__dirname, '../../../processedEmails.json');

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function getEmails() {
  try {
    // 📥 Leer correos ya procesados
    let processed = [];

    if (fs.existsSync(processedPath)) {
      processed = JSON.parse(fs.readFileSync(processedPath));
    }

    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });

    const messages = res.data.messages;

    if (!messages) {
      console.log('No hay correos');
      return;
    }

    for (let msg of messages) {

      // 🚫 Evitar duplicados
      if (processed.includes(msg.id)) {
        continue;
      }

      const email = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
      });

      const headers = email.data.payload.headers;

      const subject = headers.find(h => h.name === 'Subject')?.value;
      const from = headers.find(h => h.name === 'From')?.value;

      const analysis = await analyzeEmail(subject, from);

      console.log('📩 Email:');
      console.log('De:', from);
      console.log('Asunto:', subject);
      console.log('Análisis:', analysis);
      console.log('----------------------');

      // 📲 Enviar solo si es tarea
      if (analysis.es_tarea) {
        const mensaje = `📌 Nueva tarea detectada

${analysis.titulo}
📅 ${analysis.fecha || 'Sin fecha'}
⚠️ Prioridad: ${analysis.prioridad}`;

        await sendMessage('56944095023', mensaje); // 👈 CAMBIA TU NÚMERO
      }

      // 💾 Guardar como procesado
      processed.push(msg.id);
      fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2));
    }

  } catch (error) {
    console.error(error);
  }
}

module.exports = { getEmails };