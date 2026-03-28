const express = require('express');
const router = express.Router();
const oauth2Client = require('../config/gmail');
const fs = require('fs');
const path = require('path');

//  Ruta para iniciar login con Google
router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',      //  necesario para refresh_token
    prompt: 'consent',           //  fuerza que Google lo entregue
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  res.redirect(url);
});

//  Callback
router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    //  guardar tokens
    fs.writeFileSync(
      path.join(__dirname, '../../tokens.json'),
      JSON.stringify(tokens, null, 2)
    );

    console.log('TOKENS GUARDADOS:', tokens);

    res.send('Gmail conectado correctamente');
  } catch (error) {
    console.error(error);
    res.send('Error al conectar Gmail');
  }
});

module.exports = router;