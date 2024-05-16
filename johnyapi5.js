const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Servir a pasta "media" estaticamente
app.use('/media', express.static(path.join(__dirname, 'media')));

// Cria a pasta "media" se não existir
if (!fs.existsSync('media')) {
  fs.mkdirSync('media');
}

// Lista de eventos suportados
const events = [
  'application-startup', 'qrcode-updated', 'connection-update',
  'messages-set', 'messages-upsert', 'messages-update', 'messages-delete',
  'send-message', 'contacts-set', 'contacts-upsert', 'contacts-update',
  'presence-update', 'chats-set', 'chats-update', 'chats-upsert',
  'chats-delete', 'groups-upsert', 'groups-update', 'group-participants-update',
  'new-jwt'
];

// Função para imprimir mensagens específicas e baixar mídias
const printMessageDetails = async (data) => {
  const downloadAndSaveMedia = async (url, mimetype, fileName) => {
    const extension = mime.extension(mimetype);
    const filePath = path.join('media', `${fileName}.${extension}`);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(fs.createWriteStream(filePath));
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve();
      });
      response.data.on('error', err => {
        reject(err);
      });
    });
  };

  if (data.message.audioMessage) {
    console.log("Audio Message:", JSON.stringify(data.message.audioMessage, null, 2));
    await downloadAndSaveMedia(data.message.audioMessage.url, data.message.audioMessage.mimetype, data.key.id);
  }
  if (data.message.imageMessage) {
    console.log("Image Message:", JSON.stringify(data.message.imageMessage, null, 2));
    await downloadAndSaveMedia(data.message.imageMessage.url, data.message.imageMessage.mimetype, data.key.id);
  }
  if (data.message.videoMessage) {
    console.log("Video Message:", JSON.stringify(data.message.videoMessage, null, 2));
    await downloadAndSaveMedia(data.message.videoMessage.url, data.message.videoMessage.mimetype, data.key.id);
  }
  if (data.message.documentMessage) {
    console.log("Document Message:", JSON.stringify(data.message.documentMessage, null, 2));
    await downloadAndSaveMedia(data.message.documentMessage.url, data.message.documentMessage.mimetype, data.key.id);
  }
  if (data.message.messageContextInfo) {
    console.log("Message Context Info:", JSON.stringify(data.message.messageContextInfo, null, 2));
  }
};

// Criação dos endpoints para cada evento
events.forEach(event => {
  app.post(`/webhook/${event}`, async (req, res) => {
    console.log(`Evento recebido: ${event}`);
    if (event === 'messages-upsert') {
      const data = req.body.data;
      await printMessageDetails(data);
    } else {
      console.log(req.body);
    }
    res.sendStatus(200);
  });
});

// Porta onde o servidor vai escutar
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
