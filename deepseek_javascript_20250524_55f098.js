document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  if (!enhanceBtn || !promptInput || !output) return;

  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    // Validate input
    if (!prompt) {
      output.innerHTML = '<div class="error">Please enter a prompt to enhance</div>';
      return;
    }

    // Show loading state
    output.innerHTML = `
      <div class="loading-state">
        <span class="loading-spinner"></span>
        <span>Enhancing your prompt...</span>
      </div>
    `;
    enhanceBtn.disabled = true;

    try {
      const enhancementPrompt = `Improve the following AI image generation prompt by making it more detailed, specific, and clear while maintaining the original intent. 
      Add relevant artistic style details if needed. Return only the enhanced prompt without additional commentary.
      
      Original prompt: "${prompt}"
      
      Enhanced prompt:`;

      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: "text-davinci-003",  // Better model for enhancement
          prompt: enhancementPrompt,
          temperature: 0.6,          // Balanced creativity
          max_tokens: 250,           // More room for detailed enhancements
          top_p: 0.9,                // Better response quality
          frequency_penalty: 0.2,    // Encourages varied wording
          presence_penalty: 0.1      // Slightly encourages new concepts
        }),
        timeout: 10000              // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const enhancedText = (result.choices?.[0]?.text || result.text || '').trim();

      // Format the output
      if (enhancedText) {
        output.innerHTML = `
          <div class="enhanced-prompt">
            <h4>Enhanced Prompt:</h4>
            <p>${enhancedText.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="original-prompt">
            <h4>Original Prompt:</h4>
            <p>${prompt}</p>
          </div>
          <button class="copy-btn neumorph-btn" data-prompt="${enhancedText.replace(/"/g, '&quot;')}">
            <i class="fas fa-copy"></i> Copy Enhanced Prompt
          </button>
        `;
        
        // Add copy functionality
        document.querySelector('.copy-btn')?.addEventListener('click', (e) => {
          const promptToCopy = e.target.getAttribute('data-prompt') || 
                              e.target.closest('.copy-btn').getAttribute('data-prompt');
          navigator.clipboard.writeText(promptToCopy);
          
          // Show notification
          const notification = document.createElement('div');
          notification.className = 'notification';
          notification.innerHTML = '<i class="fas fa-check-circle"></i> Copied to clipboard!';
          output.appendChild(notification);
          
          setTimeout(() => notification.remove(), 2000);
        });
      } else {
        output.innerHTML = '<div class="error">No enhanced text received from the server</div>';
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      output.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-triangle"></i>
          Failed to enhance prompt: ${error.message || 'Network error'}
        </div>
      `;
    } finally {
      enhanceBtn.disabled = false;
    }
  });
});