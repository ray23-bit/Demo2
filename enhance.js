 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  enhanceBtn?.addEventListener('click', async () => {
    const prompt = promptInput?.value.trim();
    if (!prompt) {
      output.textContent = 'Prompt tidak boleh kosong.';
      return;
    }

   // Tambahkan gaya berdasarkan konteks prompt
    const stylesByKeyword = [
      { keyword: /robot|android|machine/i, style: 'in a sci-fi cyberpunk style, with neon lights and dark shadows' },
      { keyword: /forest|mountain|nature|tree/i, style: 'in a natural landscape style, like a painting by Bob Ross' },
      { keyword: /city|urban|building/i, style: 'in a futuristic cityscape style, cinematic lighting' },
      { keyword: /anime|girl|boy|character/i, style: 'in anime style, vibrant colors and clean line art' },
      { keyword: /ocean|sea|water/i, style: 'with a dreamy underwater effect, soft lighting and flowing motion' }
    ];

    let matchedStyle = 'in a creative surrealist style, with high contrast and bold colors'; // default
    for (const item of stylesByKeyword) {
      if (item.keyword.test(prompt)) {
        matchedStyle = item.style;
        break;
      }
    }

    const enhancedPrompt = `${prompt}, ${matchedStyle}`;
   
    output.innerHTML = '<span class="loading-spinner"></span> Enhancing...';

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const result = await response.text();
      output.textContent = '';

      // DEBUG log
      console.log('Enhanced result:', result);

      // Ganti isi #prompt langsung
      promptInput.value = result;

    } catch (err) {
      output.textContent = 'Failed to enhance prompt: ' + err.message;
    }
  });
});
