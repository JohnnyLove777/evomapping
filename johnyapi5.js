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

// Função para imprimir mensagens específicas e baixar mídias
const printMessageDetails = async (data) => {
  const downloadAndDecryptMedia = async (url, mimetype, fileName, mediaKey, type) => {
    const extension = mime.extension(mimetype);
    const filePath = path.join('media', `${fileName}.${extension}`);

    // Download the encrypted file
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    // Expand the media key
    const mediaKeyBuffer = Buffer.from(mediaKey, 'base64');
    const infoStr = `WhatsApp ${type.charAt(0).toUpperCase() + type.slice(1)} Keys`;
    const expandedMediaKey = crypto.createHmac('sha256', mediaKeyBuffer).update(infoStr).digest();
    const iv = expandedMediaKey.slice(0, 16);
    const cipherKey = expandedMediaKey.slice(16, 48);

    // Decrypt the media
    const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
    const encryptedMedia = Buffer.from(response.data);
    const decryptedMedia = Buffer.concat([decipher.update(encryptedMedia), decipher.final()]);

    fs.writeFileSync(filePath, decryptedMedia);
  };

  if (data.message.audioMessage) {
    console.log("Audio Message:", JSON.stringify(data.message.audioMessage, null, 2));
    await downloadAndDecryptMedia(data.message.audioMessage.url, data.message.audioMessage.mimetype, data.key.id, data.message.audioMessage.mediaKey, 'audio');
  }
  if (data.message.imageMessage) {
    console.log("Image Message:", JSON.stringify(data.message.imageMessage, null, 2));
    await downloadAndDecryptMedia(data.message.imageMessage.url, data.message.imageMessage.mimetype, data.key.id, data.message.imageMessage.mediaKey, 'image');
  }
  if (data.message.videoMessage) {
    console.log("Video Message:", JSON.stringify(data.message.videoMessage, null, 2));
    await downloadAndDecryptMedia(data.message.videoMessage.url, data.message.videoMessage.mimetype, data.key.id, data.message.videoMessage.mediaKey, 'video');
  }
  if (data.message.documentMessage) {
    console.log("Document Message:", JSON.stringify(data.message.documentMessage, null, 2));
    await downloadAndDecryptMedia(data.message.documentMessage.url, data.message.documentMessage.mimetype, data.key.id, data.message.documentMessage.mediaKey, 'document');
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
