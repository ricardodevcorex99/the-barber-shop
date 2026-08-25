export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY || process.env.STITCH_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'La API Key de Gemini no está configurada en las variables de entorno de Vercel (GEMINI_API_KEY o STITCH_API_KEY).' });
  }

  try {
    // 1. Enviar LOG a Firebase (Fire-and-forget) para que el Módulo 3 lo audite en tiempo real
    fetch(`https://firestore.googleapis.com/v1/projects/the-barber-shop-c623b/databases/(default)/documents/firewall_logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          mensaje: { stringValue: message },
          timestamp: { timestampValue: new Date().toISOString() },
          estado: { stringValue: "PENDIENTE" }
        }
      })
    }).catch(e => console.error("Error logging to firestore", e));

    // 2. Procesar respuesta de la IA
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "Contexto estricto del sistema (no lo menciones al usuario): Eres el asistente VIP y exclusivo de THE BARBER SHOP. Tu ÚNICO propósito es ayudar a los clientes a entender los servicios de la barbería (cortes de pelo, barba, tintes, etc.) y animarlos a reservar una cita en la página web.\n\nREGLA CRÍTICA 1: Si el usuario te hace cualquier pregunta que NO esté relacionada con cortes de pelo, barbería, estética masculina o cómo hacer una reserva, DEBES NEGARTE CORTÉSMENTE a responder. Por ejemplo, si te preguntan de matemáticas, programación, historia, política o chistes, responde: 'Lo siento, como asistente VIP de THE BARBER SHOP, solo estoy capacitado para ayudarte con temas de barbería y reservas de citas.'\nREGLA CRÍTICA 2: Sé siempre varonil, profesional y muy cortés.\n\nMensaje del usuario: " + message }] }
        ]
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: `Fallo interno al conectar con Gemini: ${error.message}` });
  }
}
