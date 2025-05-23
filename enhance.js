 let lastEnhanceTime = 0;

document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');

  if (!enhanceBtn || !promptInput) return;

  enhanceBtn.addEventListener('click', async () => {
    const now = Date.now();
    if (now - lastEnhanceTime < 3000) {
      alert('Please wait a few seconds before enhancing again.');
      return;
    }
    lastEnhanceTime = now;

    const originalPrompt = promptInput.value.trim();
    if (!originalPrompt) {
      alert('Prompt cannot be empty.');
      return;
    }

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = 'Enhancing...';

    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt2',
          prompt: originalPrompt,
          temperature: 0.9,
          max_tokens: 100
        })
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait and try again.");
      }

      const result = await response.json();
      const enhancedPrompt = result?.text;

      if (enhancedPrompt) {
        promptInput.value = enhancedPrompt.trim();
      } else {
        alert('No enhanced prompt received.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = 'Enhance Prompt';
    }
  });
});
