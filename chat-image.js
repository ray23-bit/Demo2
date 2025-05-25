 document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('user-input');
  const chatBtn = document.getElementById('chat-btn');
  const imageBtn = document.getElementById('image-btn');
  const responseDiv = document.getElementById('chat-response');
  const imageResult = document.getElementById('image-result');

  chatBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;
    responseDiv.textContent = 'Menjawab...';
    
    try {
      const res = await fetch(`https://api.example.com/chat?query=${encodeURIComponent(text)}`);
      const data = await res.text();
      responseDiv.textContent = data;
      imageResult.src = ''; // Kosongkan gambar
    } catch (err) {
      responseDiv.textContent = 'Gagal menjawab: ' + err.message;
    }
  });

  imageBtn.addEventListener('click', () => {
    const prompt = input.value.trim();
    if (!prompt) return;
    responseDiv.textContent = ''; // Kosongkan chat
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    imageResult.src = url;
  });
});
