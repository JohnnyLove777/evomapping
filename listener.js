// Requer a biblioteca socket.io-client
const io = require("socket.io-client");

// Substitua pela URL da sua instância específica da Evolution API
const socket = io("wss://143.198.55.162:8080/JohnnyEVO", {
  transports: ["websocket"], // Especifica que apenas WebSockets devem ser usados
});

// Evento de atualização da conexão
socket.on("connection.update", (status) => {
  console.log("Status da conexão atualizado:", status);
  // Aqui você pode adicionar lógica adicional para lidar com a atualização da conexão
});

// Listener para mensagens recebidas (evento messages.upsert)
socket.on("messages.upsert", (data) => {
  // Processa os dados da mensagem recebida
  console.log("Mensagem recebida:", data);
  // Aqui você pode adicionar lógica adicional para lidar com a mensagem recebida
});

// Listener para mensagens enviadas (evento send.message)
socket.on("send.message", (data) => {
    // Processa os dados da mensagem enviada
    console.log("Mensagem enviada:", data);
    // Aqui você pode adicionar lógica adicional para lidar com a mensagem enviada
});

// Tratamento de erros de conexão
socket.on("connect_error", (error) => {
  console.log("Erro de conexão:", error.message);
});
