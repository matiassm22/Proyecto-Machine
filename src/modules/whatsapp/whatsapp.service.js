const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth()
});

// 👇 mostrar QR en consola
client.on('qr', (qr) => {
  console.log('Escanea este QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// 👇 cuando esté listo
client.on('ready', () => {
  console.log('WhatsApp conectado ✅');
});

// iniciar cliente
client.initialize();

// 👇 función para enviar mensaje
async function sendMessage(number, message) {
  const chatId = `${number}@c.us`;

  await client.sendMessage(chatId, message);
}

module.exports = { sendMessage };