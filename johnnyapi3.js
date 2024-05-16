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
  const messageId = messageData.key.id; // ID da mensagem original para reações

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
          media: 'https://johnnylove.com.br/wp-content/uploads/2024/05/OIG1.nRqKFmUtvlu2SJC69d.jpg'
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

      // Envia outra imagem
      const imagePostData2 = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        mediaMessage: {
          mediatype: 'image',
          caption: 'Aqui está outra imagem com o método dinamico',
          media: 'https://s3.typebot.io/public/workspaces/clsw9qe7b000b14ekulcmg8u5/typebots/clsw9rcai000di7ptvdbilasg/blocks/uqcak81acjhfukumj9pf2jic?v=1715874452937'
        }
      };

      const imageResponse2 = await axios.post(
        `http://localhost:8080/message/sendMedia/JohnnyEVO`,
        imagePostData2,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Imagem enviada com sucesso:', imageResponse2.data);

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
          media: 'https://johnnylove.com.br/wp-content/uploads/2024/01/vidjohnny01.mp4'
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
          fileName: 'nossodoc.pdf'
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

      // Envia uma reação
      const reactionPostData = {
        reactionMessage: {
          key: {
            remoteJid: remoteJid,
            fromMe: true,
            id: messageId
          },
          reaction: '👍' // Emoji de reação
        }
      };

      const reactionResponse = await axios.post(
        `http://localhost:8080/message/sendReaction/JohnnyEVO`,
        reactionPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Reação enviada com sucesso:', reactionResponse.data);

      // Envia um adesivo
      const stickerPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        stickerMessage: {
          image: 'https://s2-g1.glbimg.com/IMYOHWr1B4wi2rHTe7R4cLxQaLI=/0x0:384x384/600x0/smart/filters:gifv():strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2018/c/D/KLf6b3RpyygAYtwjO8dQ/palmeiras.gif'
        }
      };

      const stickerResponse = await axios.post(
        `http://localhost:8080/message/sendSticker/JohnnyEVO`,
        stickerPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Adesivo enviado com sucesso:', stickerResponse.data);

      // Envia uma localização
      const locationPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        locationMessage: {
          name: 'Localização de exemplo',
          address: 'Endereço de exemplo, 123',
          latitude: -23.550520,
          longitude: -46.633308
        }
      };

      const locationResponse = await axios.post(
        `http://localhost:8080/message/sendLocation/JohnnyEVO`,
        locationPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Localização enviada com sucesso:', locationResponse.data);

      // Envia um contato
      const contactPostData = {
        number: remoteJid,
        options: {
          delay: 1200,
          presence: 'composing'
        },
        contactMessage: [{
          fullName: 'Contato de Exemplo',
          wuid: '5511912790080@s.whatsapp.net',
          phoneNumber: '11912790080',
          organization: 'JohnnyZap',
          email: 'johnnysoul99@gmail.com',
          url: 'https://johnnylove.com.br'
        }]
      };

      const contactResponse = await axios.post(
        `http://localhost:8080/message/sendContact/JohnnyEVO`,
        contactPostData,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': event.apikey
          }
        }
      );

      console.log('Contato enviado com sucesso:', contactResponse.data);

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
