const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const tokenPath = path.join(__dirname, '../../tokens.json');

// 👇 DEBUG
console.log('Buscando tokens en:', tokenPath);

if (fs.existsSync(tokenPath)) {
  const tokens = JSON.parse(fs.readFileSync(tokenPath));

  console.log('TOKENS ENCONTRADOS:', tokens);

  oauth2Client.setCredentials(tokens);
  console.log('TOKENS CARGADOS ✅');
} else {
  console.log('NO SE ENCONTRARON TOKENS ❌');
}

module.exports = oauth2Client;