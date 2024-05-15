const express = require('express');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Lista de eventos suportados
const events = [
  'application-startup', 'qrcode-updated', 'connection-update',
  'messages-set', 'messages-upsert', 'messages-update', 'messages-delete',
  'send-message', 'contacts-set', 'contacts-upsert', 'contacts-update',
  'presence-update', 'chats-set', 'chats-update', 'chats-upsert',
  'chats-delete', 'groups-upsert', 'groups-update', 'group-participants-update',
  'new-jwt'
];

// Criação dos endpoints para cada evento
events.forEach(event => {
  app.post(`/webhook/${event}`, (req, res) => {
    console.log(`Evento recebido: ${event}`);
    console.log(req.body);
    res.sendStatus(200);
  });
});

// Porta onde o servidor vai escutar
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
