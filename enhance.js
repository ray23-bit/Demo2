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

    output.innerHTML = '<span class="loading-spinner"></span> Enhancing...';

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const result = await response.text();
      output.textContent = result || 'No enhanced text received.';

      // DEBUG log
      console.log('Enhanced result:', result);

      // Ganti isi #prompt langsung
      promptInput.value = result;

    } catch (err) {
      output.textContent = 'Failed to enhance prompt: ' + err.message;
    }
  });
});
