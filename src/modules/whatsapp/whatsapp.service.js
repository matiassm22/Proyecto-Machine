const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth()
});

let isReady = false;

// QR
client.on('qr', (qr) => {
  console.log('Escanea el QR:');
  qrcode.generate(qr, { small: true });
});

// READY
client.on('ready', () => {
  console.log('WhatsApp conectado ✅');
  isReady = true;
});

// INIT
client.initialize();

// FUNCIÓN SEGURA
async function sendMessage(number, message) {
  if (!isReady) {
    console.log('⚠️ WhatsApp aún no está listo...');
    return;
  }

  const chatId = `${number}@c.us`;

  try {
    await client.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error enviando mensaje:', error.message);
  }
}

module.exports = { sendMessage };