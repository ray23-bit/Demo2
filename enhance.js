 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  if (!enhanceBtn || !promptInput || !output) return;

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

      const result = await response.text();

      if (result) {
        output.textContent = result;
        promptInput.value = result; // Auto-fill the prompt input with enhanced result
      } else {
        output.textContent = 'No enhanced text received.';
      }
    } catch (error) {
      output.textContent = 'Failed to enhance prompt: ' + error.message;
    }
  });
});
