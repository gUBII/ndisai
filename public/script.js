const button = document.getElementById('micButton');
const conversation = document.getElementById('conversation');

const synth = window.speechSynthesis;
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-AU';
  recognition.continuous = false;
} else {
  alert('Speech recognition not supported in this browser.');
}

button.addEventListener('click', () => {
  if (!recognition) return;
  recognition.start();
  button.disabled = true;
});

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  conversation.appendChild(msg);
  conversation.scrollTop = conversation.scrollHeight;
}

if (recognition) {
  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    conversation.textContent = `You: ${text}`;
    addMessage('user', text);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      conversation.textContent += `\nAI: ${data.reply}`;
      addMessage('ai', data.reply);
      speak(data.reply);
    } catch (err) {
      conversation.textContent += '\nError connecting to server.';
      addMessage('error', 'Error connecting to server.');
    } finally {
      button.disabled = false;
    }
  };

  recognition.onerror = () => {
    button.disabled = false;
  };
}