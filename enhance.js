 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const imagePromptInput = document.getElementById('image-prompt'); // Tambahan
  const output = document.getElementById('enhanced-output');

  if (!enhanceBtn || !promptInput || !output || !imagePromptInput) return;

  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      output.textContent = 'Prompt cannot be empty.';
      return;
    }

    output.innerHTML = '<span class="loading-spinner"></span>Enhancing...';

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text(); // Assuming plain text
      output.textContent = result || 'No enhanced text received.';

      // Taruh hasil enhancement ke kotak image prompt
      if (result) {
        imagePromptInput.value = result;
      }
    } catch (error) {
      output.textContent = 'Failed to enhance prompt: ' + error.message;
    }
  });
});
