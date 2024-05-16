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

  if (conversation === 'Recebeu?') {
    try {
      // Envia a mensagem de texto
      const textPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        textMessage: {
          text: 'Recebi sim'
        }
      };

      const textResponse = await axios.post(
        `http://localhost:8080/message/sendText/JohnnyEVO`,
        textPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Mensagem de texto enviada com sucesso:', textResponse.data);

      // Envia a imagem
      const imagePostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'image',
          caption: 'Aqui está uma imagem',
          media: 'https://johnnylove.com.br/wp-content/uploads/2023/12/imagem_base.png'
        }
      };

      const imageResponse = await axios.post(
        `http://localhost:8080/message/sendMedia/JohnnyEVO`,
        imagePostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Imagem enviada com sucesso:', imageResponse.data);

      // Envia o áudio
      const audioPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'audio',
          media: 'https://johnnylove.com.br/wp-content/uploads/2024/01/typebotarrasta.ogg'
        }
      };

      const audioResponse = await axios.post(
        `http://localhost:8080/message/sendMedia/JohnnyEVO`,
        audioPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Áudio enviado com sucesso:', audioResponse.data);

      // Envia o vídeo
      const videoPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'video',
          caption: 'Aqui está um vídeo',
          media: 'https://johnnylove.com.br/wp-content/uploads/2023/11/vidtype.mp4'
        }
      };

      const videoResponse = await axios.post(
        `http://localhost:8080/message/sendMedia/JohnnyEVO`,
        videoPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Vídeo enviado com sucesso:', videoResponse.data);

      // Envia o áudio como se fosse gravado na hora
      const recordedAudioPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'recording'
        },
        audioMessage: {
          audio: 'https://johnnylove.com.br/wp-content/uploads/2023/12/audio_base.ogg'
        }
      };

      const recordedAudioResponse = await axios.post(
        `http://localhost:8080/message/sendWhatsAppAudio/JohnnyEVO`,
        recordedAudioPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Áudio gravado na hora enviado com sucesso:', recordedAudioResponse.data);

      // Envia um documento
      const documentPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'document',
          media: 'https://johnnylove.com.br/wp-content/uploads/2023/11/Guia-Fantastico-1.0.pdf',
          fileName: 'guiafantatico.pdf'
        }
      };

      const documentResponse = await axios.post(
        `http://localhost:8080/message/sendMedia/JohnnyEVO`,
        documentPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Documento enviado com sucesso:', documentResponse.data);

      res.sendStatus(200);
    } catch (error) {
      console.error('Erro ao enviar as mensagens:', error);
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
