const axios = require('axios');

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

module.exports = {
  EnviarTexto,
  EnviarImagem,
  EnviarVideo,
  EnviarAudio,
  EnviarDocumento,
  EnviarReacao,
  EnviarLocalizacao
};
