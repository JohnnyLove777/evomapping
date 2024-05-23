const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const {
  EnviarTexto,
  EnviarImagem,
  EnviarVideo,
  EnviarAudio,
  EnviarDocumento,
  EnviarReacao,
  EnviarLocalizacao,
  EnviarLista,
  downloadAndSaveMedia,
  isFromMe
} = require('./messageFunctions');

const instanceName = 'JohnnyEVO';

// Middleware para processar JSON
app.use(express.json());

// Servir a pasta "media" estaticamente
app.use('/media', express.static(path.join(__dirname, 'media')));

// Cria a pasta "media" se não existir
if (!fs.existsSync('media')) {
  fs.mkdirSync('media');
}

// Listener de Mensagem Recebida
app.post('/webhook/messages-upsert', async (req, res) => {
    const event = req.body;
  
    const messageData = event.data;
    const conversation = messageData.message.conversation;
    const remoteJid = messageData.key.remoteJid;
    const messageId = messageData.key.id; // ID da mensagem original para reações

    // Exemplo de uso da função EnviarLista
    const secoes = [
      {
        title: "Entradas",
        rows: [
          {
            title: "Salada Caesar",
            description: "Uma clássica salada Caesar com alface romana, croutons e molho especial.",
            rowId: "rowId_entradas_001"
          },
          {
            title: "Sopa de Tomate",
            description: "Sopa cremosa de tomate com manjericão fresco.",
            rowId: "rowId_entradas_002"
          }
        ]
      },
      {
        title: "Pratos Principais",
        rows: [
          {
            title: "Filé Mignon",
            description: "Filé mignon grelhado servido com batatas rústicas e legumes ao vapor.",
            rowId: "rowId_pratos_001"
          },
          {
            title: "Lasanha à Bolonhesa",
            description: "Lasanha tradicional com molho bolonhesa, queijo derretido e molho bechamel.",
            rowId: "rowId_pratos_002"
          }
        ]
      },
      {
        title: "Sobremesas",
        rows: [
          {
            title: "Cheesecake de Morango",
            description: "Cheesecake cremoso com cobertura de morangos frescos.",
            rowId: "rowId_sobremesas_001"
          },
          {
            title: "Tiramisu",
            description: "Tradicional tiramisu italiano com café, mascarpone e cacau.",
            rowId: "rowId_sobremesas_002"
          }
        ]
      }
    ];
  
    console.log(`Evento recebido: ${event.event}`);
    console.log(`Mensagem: ${conversation}`);
    console.log(`Remetente: ${remoteJid}`);
      
    try {
      const fromMe = await isFromMe(event);
      console.log(`fromMe: ${fromMe}`);

      console.log("---------------------------------------------------------");
      console.log(event.data);
      console.log("---------------------------------------------------------");
  
      if (fromMe) {
        console.log(`Enviei a mensagem:`);
        console.log(`Mensagem: ${conversation}`);
        console.log(`Para o numero:`);
        console.log(`Numero: ${remoteJid}`);
      } else if (conversation === 'Recebeu?' && !fromMe) {        
        
        await EnviarTexto(remoteJid, 'Recebi sim', 1200, event.apikey, instanceName);
        console.log('Mensagem de texto enviada com sucesso');
  
        await EnviarImagem(remoteJid, 'https://johnnylove.com.br/wp-content/uploads/2024/05/OIG1.nRqKFmUtvlu2SJC69d.jpg', 'Aqui está uma imagem', 1200, event.apikey, instanceName);
        console.log('Imagem enviada com sucesso');

        await EnviarLista(remoteJid,"Restaurante do Johnny", "Escolha uma das opções abaixo para saber mais detalhes", "Ver Menu", "Obrigado por visitar o restaurante do Johnny\nhttps://johnnylove.com.br", secoes, 3000, event.apikey, instanceName);
        console.log('Lista enviada com sucesso');
  
        /*await EnviarImagem(remoteJid, 'https://s3.typebot.io/public/workspaces/clsw9qe7b000b14ekulcmg8u5/typebots/clsw9rcai000di7ptvdbilasg/blocks/uqcak81acjhfukumj9pf2jic?v=1715874452937', 'Aqui está outra imagem com o método dinamico', 1200, event.apikey, instanceName);
        console.log('Outra imagem enviada com sucesso');
  
        await EnviarVideo(remoteJid, 'https://johnnylove.com.br/wp-content/uploads/2024/01/vidjohnny01.mp4', 'Aqui está um vídeo', 1200, event.apikey, instanceName);
        console.log('Vídeo enviado com sucesso');
  
        await EnviarAudio(remoteJid, 'https://johnnylove.com.br/wp-content/uploads/2023/12/audio_base.ogg', 1200, event.apikey, instanceName);
        console.log('Áudio gravado na hora enviado com sucesso');
  
        await EnviarDocumento(remoteJid, 'https://johnnylove.com.br/wp-content/uploads/2023/11/Guia-Fantastico-1.0.pdf', 'nossodoc.pdf', 1200, event.apikey, instanceName);
        console.log('Documento enviado com sucesso');
  
        await EnviarReacao(remoteJid, messageId, '👍', event.apikey, instanceName);
        console.log('Reação enviada com sucesso');
  
        await EnviarLocalizacao(remoteJid, 'Localização de exemplo', 'Endereço de exemplo, 123', -23.550520, -46.633308, 1200, event.apikey, instanceName);
        console.log('Localização enviada com sucesso');*/
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      res.sendStatus(500);
    }
  });

// Porta onde o servidor vai escutar
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
