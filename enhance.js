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
          model: 'text-davinci-002',  // Updated model
          prompt: originalPrompt,
          temperature: 0.7,           // Adjusted for better results
          max_tokens: 150,            // Increased token limit
          top_p: 1.0,                 // Added parameter
          frequency_penalty: 0.0,     // Added parameter
          presence_penalty: 0.0      // Added parameter
        })
      });

      if (response.status === 429) {
        throw new Error("Too many requests. Please wait and try again.");
      }

      const result = await response.json();
      const enhancedPrompt = result?.choices?.[0]?.text || result?.text; // Handle different response formats

      if (enhancedPrompt) {
        promptInput.value = enhancedPrompt.trim();
      } else {
        alert('No enhanced prompt received.');
      }
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to enhance prompt'));
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = 'Enhance Prompt';
    }
  });
});
