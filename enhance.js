 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');

  if (!enhanceBtn || !promptInput) return;

  enhanceBtn.addEventListener('click', async () => {
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
          model: 'openai',  // or 'openai-reasoning' for deeper output
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that rewrites prompts to be more descriptive and creative for AI image generation.'
            },
            {
              role: 'user',
              content: originalPrompt
            }
          ],
          temperature: 0.9,
          max_tokens: 100
        })
      });

      const result = await response.json();
      const enhancedPrompt = result?.choices?.[0]?.message?.content;

      if (enhancedPrompt) {
        promptInput.value = enhancedPrompt.trim();
      } else {
        alert('No enhanced prompt received.');
      }
    } catch (error) {
      alert('Failed to enhance prompt: ' + error.message);
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = 'Enhance Prompt';
    }
  });
});
