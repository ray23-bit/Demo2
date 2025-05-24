 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');

  if (!enhanceBtn || !promptInput) return;

  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Prompt cannot be empty.');
      return;
    }

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = 'Enhancing...';

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text();
      if (result) {
        promptInput.value = result; // Replace original prompt with enhanced text
      } else {
        alert('No enhanced text received.');
      }
    } catch (error) {
      alert('Failed to enhance prompt: ' + error.message);
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = 'Enhance Prompt';
    }
  });
});
