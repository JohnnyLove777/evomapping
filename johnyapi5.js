const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const crypto = require('crypto');
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
const events = ['messages-upsert'];

const downloadAndDecryptMedia = async (url, mimetype, fileName, mediaKey) => {
  const extension = mime.extension(mimetype);
  const filePath = path.join('media', `${fileName}.${extension}`);

  // Download the encrypted file
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  // Descrypt the media
  const encryptedMedia = Buffer.from(response.data, 'binary');
  const mediaKeyExpanded = crypto.createHash('sha256').update(mediaKey).digest();
  const iv = mediaKeyExpanded.slice(0, 16);
  const cipherKey = mediaKeyExpanded.slice(16, 48);

  const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
  const decryptedMedia = Buffer.concat([decipher.update(encryptedMedia), decipher.final()]);

  fs.writeFileSync(filePath, decryptedMedia);
};

// Função para imprimir mensagens específicas e baixar mídias
const printMessageDetails = async (data) => {
  if (data.message.audioMessage) {
    console.log("Audio Message:", JSON.stringify(data.message.audioMessage, null, 2));
    await downloadAndDecryptMedia(data.message.audioMessage.url, data.message.audioMessage.mimetype, data.key.id, data.message.audioMessage.mediaKey);
  }
  if (data.message.imageMessage) {
    console.log("Image Message:", JSON.stringify(data.message.imageMessage, null, 2));
    await downloadAndDecryptMedia(data.message.imageMessage.url, data.message.imageMessage.mimetype, data.key.id, data.message.imageMessage.mediaKey);
  }
  if (data.message.videoMessage) {
    console.log("Video Message:", JSON.stringify(data.message.videoMessage, null, 2));
    await downloadAndDecryptMedia(data.message.videoMessage.url, data.message.videoMessage.mimetype, data.key.id, data.message.videoMessage.mediaKey);
  }
  if (data.message.documentMessage) {
    console.log("Document Message:", JSON.stringify(data.message.documentMessage, null, 2));
    await downloadAndDecryptMedia(data.message.documentMessage.url, data.message.documentMessage.mimetype, data.key.id, data.message.documentMessage.mediaKey);
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
