document.addEventListener('DOMContentLoaded', () => {
  const chatBubbleBtn = document.getElementById('chat-bubble-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  // Load history from session storage
  const savedHistory = sessionStorage.getItem('barberChatHistory');
  if (savedHistory) {
    chatMessages.innerHTML = savedHistory;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Load chat window state
  if (sessionStorage.getItem('barberChatOpen') === 'true') {
    chatWindow.classList.add('active');
  }

  function saveChatState() {
    sessionStorage.setItem('barberChatHistory', chatMessages.innerHTML);
    sessionStorage.setItem('barberChatOpen', chatWindow.classList.contains('active'));
  }

  // Toggle chat window
  chatBubbleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    saveChatState();
  });

  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    saveChatState();
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatState();
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
    if (typingDiv) {
      typingDiv.remove();
      saveChatState();
    }
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Mostrar el mensaje del usuario
    appendMessage(text, 'user');
    chatInput.value = '';
    
    // 2. Mostrar indicador de "escribiendo..."
    showTyping();

    // 3. Conexión Segura al Backend (Vercel Serverless Function)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      removeTyping();

      if (response.ok) {
        const respuestaIA = data.candidates[0].content.parts[0].text;
        appendMessage(respuestaIA, 'bot');
      } else {
        appendMessage("Error de conexión con el servidor.", 'bot');
      }
    } catch (error) {
      removeTyping();
      appendMessage("Lo siento, estoy fuera de servicio.", 'bot');
    }
  }

  chatSendBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
