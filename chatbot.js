document.addEventListener('DOMContentLoaded', () => {
  const chatBubbleBtn = document.getElementById('chat-bubble-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  // Toggle chat window
  chatBubbleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
  });

  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Mostrar el mensaje del usuario
    appendMessage(text, 'user');
    chatInput.value = '';
    
    // 2. Mostrar indicador de "escribiendo..."
    showTyping();

    // 3. (Módulo 3) - Aquí enviaremos el texto a nuestro "Escudo / Firewall"
    // o directamente a la IA para responder.
    // Por ahora, simulamos una respuesta rápida de la IA.
    setTimeout(() => {
      removeTyping();
      appendMessage("Hola, soy el asistente IA de la barbería. (En construcción: Conectando con Gemini API...)", 'bot');
    }, 1500);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
