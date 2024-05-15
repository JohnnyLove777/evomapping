const express = require('express');
const axios = require('axios');
const app = express();

// Middleware para processar JSON
app.use(express.json());

app.post('/webhook/messages-upsert', async (req, res) => {
  const event = req.body;
  
    const messageData = event.data;
    const conversation = messageData.message.conversation;
    const remoteJid = messageData.key.remoteJid;

    console.log(`Evento recebido: ${event.event}`);
    console.log(`Mensagem: ${conversation}`);
    console.log(`Remetente: ${remoteJid}`);

    // Verifica se a mensagem recebida é "Recebeu?"
    if (conversation === 'Recebeu?') {
      // Configura os dados para a requisição POST
      const postData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        textMessage: {
          text: 'Eu recebi sua mensagem'
        }
      };

      try {
        // Envia a mensagem de resposta
        const response = await axios.post(
          `http://localhost:8080/message/sendText/JohnnyEVO`,
          postData,
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': event.apikey // Inclui o apikey no cabeçalho
            }
          }
        );

        console.log('Mensagem enviada com sucesso:', response.data);
        res.sendStatus(200);
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(200);
    } 
});

// Porta onde o servidor vai escutar
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
