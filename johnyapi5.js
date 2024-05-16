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

// Nome da instância
const instanceName = 'JohnnyEVO';

// Função para baixar e salvar mídias
const downloadAndSaveMedia = async (messageId, mimetype, fileName, convertToMp4 = false) => {
  try {
    // Chamada para o endpoint para converter o conteúdo da mídia para Base64
    const response = await axios.post(`/chat/getBase64FromMediaMessage/${instanceName}`, {
      message: {
        key: {
          id: messageId
        }
      },
      convertToMp4: convertToMp4
    });

    // Extrair dados da resposta
    const { base64Content } = response.data;
    const extension = mime.extension(mimetype);
    const filePath = path.join('media', `${fileName}.${extension}`);

    // Decodificar o conteúdo Base64 e salvar no arquivo
    const mediaBuffer = Buffer.from(base64Content, 'base64');
    fs.writeFileSync(filePath, mediaBuffer);
  } catch (error) {
    console.error('Erro ao baixar e salvar mídia:', error.message);
  }
};

// Função para imprimir mensagens específicas e baixar mídias
const printMessageDetails = async (data) => {
  if (data.message.audioMessage) {
    console.log("Audio Message:", JSON.stringify(data.message.audioMessage, null, 2));
    await downloadAndSaveMedia(data.key.id, data.message.audioMessage.mimetype, data.key.id);
  }
  if (data.message.imageMessage) {
    console.log("Image Message:", JSON.stringify(data.message.imageMessage, null, 2));
    await downloadAndSaveMedia(data.key.id, data.message.imageMessage.mimetype, data.key.id);
  }
  if (data.message.videoMessage) {
    console.log("Video Message:", JSON.stringify(data.message.videoMessage, null, 2));
    const convertToMp4 = data.message.videoMessage.mimetype !== 'video/mp4';
    await downloadAndSaveMedia(data.key.id, data.message.videoMessage.mimetype, data.key.id, convertToMp4);
  }
  if (data.message.documentMessage) {
    console.log("Document Message:", JSON.stringify(data.message.documentMessage, null, 2));
    await downloadAndSaveMedia(data.key.id, data.message.documentMessage.mimetype, data.key.id);
  }
  if (data.message.messageContextInfo) {
    console.log("Message Context Info:", JSON.stringify(data.message.messageContextInfo, null, 2));
  }
};

// Lista de eventos suportados
const events = ['messages-upsert'];

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
