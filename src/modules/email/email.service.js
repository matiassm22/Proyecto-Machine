const { google } = require('googleapis');
const oauth2Client = require('../../config/gmail');
const { analyzeEmail } = require('../ai/ai.service');
const { sendMessage } = require('../whatsapp/whatsapp.service');
const { addTask } = require('../tasks/task.service');

const fs = require('fs');
const path = require('path');

//  Ruta al archivo de correos procesados
const processedPath = path.join(__dirname, '../../../processedEmails.json');

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function getEmails() {
  try {
    let processed = [];

    //  Leer correos ya procesados
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

      //  Evitar duplicados
      if (processed.includes(msg.id)) continue;

      const email = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
      });

      const headers = email.data.payload.headers;

      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';

      //  EXTRAER CONTENIDO
      let body = '';
      const payload = email.data.payload;

      if (payload.parts) {
        const part = payload.parts.find(p => p.mimeType === 'text/plain');

        if (part && part.body && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      } else if (payload.body && payload.body.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }

      //  ANALIZAR
      const analysis = await analyzeEmail(subject, from, body);

      console.log('📩 Email:');
      console.log('De:', from);
      console.log('Asunto:', subject);
      console.log('Contenido:', body);
      console.log('Análisis:', analysis);
      console.log('----------------------');

      //  SI ES TAREA
      if (analysis.es_tarea) {

        const mensaje = `📌 Nueva tarea detectada

📌 ${analysis.titulo}
📅 ${analysis.fecha_real || analysis.fecha || 'Sin fecha'}
⏰ ${analysis.hora || 'Sin hora'}
⚠️ Prioridad: ${analysis.prioridad}`;

        try {
          console.log('📤 Enviando mensaje a WhatsApp...');
          await sendMessage('56944095023', mensaje);
          console.log('✅ Mensaje enviado');
        } catch (err) {
          console.error('❌ Error enviando WhatsApp:', err.message);
        }

        //  GUARDAR SOLO SI TIENE FECHA Y HORA
        if (analysis.fecha_real && analysis.hora) {
          addTask({
            titulo: analysis.titulo,
            fecha: analysis.fecha_real,
            hora: analysis.hora
          });

          console.log('💾 Tarea guardada para recordatorio');
        } else {
          console.log('⚠️ No se guardó (sin fecha u hora)');
        }
      }

      //  Guardar como procesado
      processed.push(msg.id);
      fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2));
    }

  } catch (error) {
    console.error('🔥 ERROR GENERAL:', error);
  }
}

module.exports = { getEmails };