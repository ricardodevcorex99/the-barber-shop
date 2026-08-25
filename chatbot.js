document.addEventListener('DOMContentLoaded', () => {
  const chatBubbleBtn = document.getElementById('chat-bubble-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  // Load history from session storage
  const savedHistory = localStorage.getItem('barberChatHistory');
  if (savedHistory) {
    chatMessages.innerHTML = savedHistory;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Load chat window state
  if (localStorage.getItem('barberChatOpen') === 'true') {
    chatWindow.classList.add('active');
  }

  function saveChatState() {
    localStorage.setItem('barberChatHistory', chatMessages.innerHTML);
    localStorage.setItem('barberChatOpen', chatWindow.classList.contains('active'));
  }

  function showGreetingIfNeeded() {
    if (chatWindow.classList.contains('active') && chatMessages.children.length === 0) {
        if (!window.currentUserId) {
            appendMessage("👋 ¡Hola! Para conversar conmigo y ayudarte con tus reservas, primero necesitas **Iniciar Sesión** usando el menú de arriba a la derecha. ¡Te espero!", 'bot');
        } else {
            appendMessage("Hola, soy el asistente inteligente de THE BARBER SHOP. ¿En qué te puedo ayudar hoy?", 'bot');
        }
    }
  }

  // Toggle chat window
  chatBubbleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    showGreetingIfNeeded();
    saveChatState();
  });

  // Si la ventana se abrió automáticamente por persistencia, revisar saludo tras 1s (esperando a Firebase Auth)
  if (chatWindow.classList.contains('active')) {
      setTimeout(showGreetingIfNeeded, 1000);
  }

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

  async function sendMessage(text, retryCount = 0) {
    if (!text) {
      text = chatInput.value.trim();
      if (!text) return;
      // 1. Mostrar el mensaje del usuario solo la primera vez
      appendMessage(text, 'user');
      chatInput.value = '';
    }
    
    // Verificación de Autenticación
    if (!window.currentUserId) {
      appendMessage("👋 ¡Hola! Para conversar conmigo y ayudarte con tus reservas, primero necesitas **Iniciar Sesión** usando el menú de arriba a la derecha. ¡Te espero!", 'bot');
      return;
    }
    
    // 2. Mostrar indicador de "escribiendo..."
    showTyping();

    // 3. Conexión Segura al Backend con Retry Automático
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      removeTyping();

      if (response.ok) {
        if (data.candidates && data.candidates.length > 0) {
          const respuestaIA = data.candidates[0].content.parts[0].text;
          appendMessage(respuestaIA, 'bot');
        } else {
          appendMessage("Error: La IA no devolvió ninguna respuesta.", 'bot');
        }
      } else {
        let errMsg = "Error desconocido del servidor.";
        if (data.error) {
          if (typeof data.error === 'string') errMsg = data.error;
          else if (data.error.message) errMsg = data.error.message;
          else errMsg = JSON.stringify(data.error);
        }
        
        // Auto-Retry para errores de saturación (high demand, 503) y límites de cuota (429, quota exceeded)
        const isRateLimit = errMsg.toLowerCase().includes("quota exceeded") || errMsg.toLowerCase().includes("429");
        const isServerBusy = errMsg.toLowerCase().includes("high demand") || errMsg.toLowerCase().includes("503");
        
        if ((isServerBusy || isRateLimit) && retryCount < 3) {
           showTyping();
           
           let delay = 3000;
           if (isRateLimit) {
               // Google a veces dice "retry in 43.31s". Vamos a extraer ese número para esperar el tiempo exacto.
               const match = errMsg.match(/retry in ([\d\.]+)s/);
               if (match && match[1]) {
                   delay = (parseFloat(match[1]) * 1000) + 1000; // Extraer segundos + 1 seg de margen
               } else {
                   delay = 5000;
               }
           }
           
           setTimeout(() => {
               removeTyping();
               sendMessage(text, retryCount + 1);
           }, delay);
           return;
        }

        appendMessage(`Error de servidor: ${errMsg}`, 'bot');
      }
    } catch (error) {
      removeTyping();
      appendMessage("Lo siento, estoy fuera de servicio.", 'bot');
    }
  }

  chatSendBtn.addEventListener('click', () => sendMessage());
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
