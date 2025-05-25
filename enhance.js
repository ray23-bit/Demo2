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
      const response = await fetch('https://text.pollinations.ai/prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: originalPrompt,
          parameters: {
            temperature: 0.7,
            max_length: 100
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const enhancedPrompt = result?.text || result?.generated_text;

      if (enhancedPrompt) {
        promptInput.value = enhancedPrompt.trim();
      } else {
        alert('No enhanced prompt received. Response: ' + JSON.stringify(result));
      }
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to enhance prompt'));
      console.error('Enhancement error:', error);
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = 'Enhance Prompt';
    }
  });
});
