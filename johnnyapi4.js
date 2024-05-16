const express = require('express');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Lista de eventos suportados
const events = ['messages-upsert'];

// Função para imprimir mensagens específicas
const printMessageDetails = (data) => {
  if (data.message.audioMessage) {
    console.log("Audio Message:", JSON.stringify(data.message.audioMessage, null, 2));
  }
  if (data.message.imageMessage) {
    console.log("Image Message:", JSON.stringify(data.message.imageMessage, null, 2));
  }
  if (data.message.videoMessage) {
    console.log("Video Message:", JSON.stringify(data.message.videoMessage, null, 2));
  }
  if (data.message.documentMessage) {
    console.log("Document Message:", JSON.stringify(data.message.documentMessage, null, 2));
  }
  if (data.message.messageContextInfo) {
    console.log("Message Context Info:", JSON.stringify(data.message.messageContextInfo, null, 2));
  }
};

// Criação dos endpoints para cada evento
events.forEach(event => {
  app.post(`/webhook/${event}`, (req, res) => {
    console.log(`Evento recebido: ${event}`);
    if (event === 'messages-upsert') {
      const data = req.body.data;
      printMessageDetails(data);
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
