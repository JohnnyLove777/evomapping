const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const API_BASE_URL = 'http://localhost:8080';

async function EnviarTexto(numeroId, mensagem, delay, apikey, instanceName) {
  const textPostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'composing'
    },
    textMessage: {
      text: mensagem
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendText/${instanceName}`,
    textPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarImagem(numeroId, linkImagem, legenda, delay, apikey, instanceName) {
  const imagePostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'composing'
    },
    mediaMessage: {
      mediatype: 'image',
      caption: legenda,
      media: linkImagem
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendMedia/${instanceName}`,
    imagePostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarVideo(numeroId, linkVideo, legenda, delay, apikey, instanceName) {
  const videoPostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'composing'
    },
    mediaMessage: {
      mediatype: 'video',
      caption: legenda,
      media: linkVideo
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendMedia/${instanceName}`,
    videoPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarAudio(numeroId, linkAudio, delay, apikey, instanceName) {
  const audioPostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'recording'
    },
    audioMessage: {
      audio: linkAudio
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendWhatsAppAudio/${instanceName}`,
    audioPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarDocumento(numeroId, linkDocumento, nomeArquivo, delay, apikey, instanceName) {
  const documentPostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'composing'
    },
    mediaMessage: {
      mediatype: 'document',
      media: linkDocumento,
      fileName: nomeArquivo
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendMedia/${instanceName}`,
    documentPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarReacao(numeroId, messageId, emoji, apikey, instanceName) {
  const reactionPostData = {
    reactionMessage: {
      key: {
        remoteJid: numeroId,
        fromMe: false,
        id: messageId
      },
      reaction: emoji
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendReaction/${instanceName}`,
    reactionPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function EnviarLocalizacao(numeroId, nome, endereco, latitude, longitude, delay, apikey, instanceName) {
  const locationPostData = {
    number: numeroId,
    options: {
      delay: delay,
      presence: 'composing'
    },
    locationMessage: {
      name: nome,
      address: endereco,
      latitude: latitude,
      longitude: longitude
    }
  };

  return axios.post(
    `${API_BASE_URL}/message/sendLocation/${instanceName}`,
    locationPostData,
    {
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      }
    }
  );
}

async function downloadAndSaveMedia(messageId, mimetype, fileName, apikey, instanceName, convertToMp4 = false) {
  try {
    const data = JSON.stringify({
      message: {
        key: {
          id: messageId
        }
      },
      convertToMp4: convertToMp4
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_BASE_URL}/chat/getBase64FromMediaMessage/${instanceName}`,
      headers: { 
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      data: data
    };

    const response = await axios.request(config);

    // Verificar a resposta da API
    console.log('Resposta da API:', response.data);

    // Extrair dados da resposta
    const base64Content = response.data.base64;
    if (!base64Content) {
      throw new Error('base64 não encontrado na resposta da API');
    }
    const extension = mime.extension(mimetype);
    const filePath = path.join('media', `${fileName}.${extension}`);

    // Decodificar o conteúdo Base64 e salvar no arquivo
    const mediaBuffer = Buffer.from(base64Content, 'base64');
    fs.writeFileSync(filePath, mediaBuffer);
    console.log(`Mídia salva em: ${filePath}`);
  } catch (error) {
    console.error('Erro ao baixar e salvar mídia:', error.message);
  }
}

module.exports = {
  EnviarTexto,
  EnviarImagem,
  EnviarVideo,
  EnviarAudio,
  EnviarDocumento,
  EnviarReacao,
  EnviarLocalizacao,
  downloadAndSaveMedia
};
