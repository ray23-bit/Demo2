 document.addEventListener('DOMContentLoaded', () => {
  const enhanceBtn = document.getElementById('enhance-btn');
  const promptInput = document.getElementById('prompt');
  const output = document.getElementById('enhanced-output');

  if (!enhanceBtn || !promptInput || !output) return;

  enhanceBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    // Validasi input
    if (!prompt) {
      output.innerHTML = '<div class="error">Please enter a prompt to enhance</div>';
      return;
    }

    // Tampilkan loading state
    output.innerHTML = `
      <div class="loading-state">
        <span class="loading-spinner"></span>
        <span>Enhancing your prompt...</span>
      </div>
    `;
    enhanceBtn.disabled = true;

    try {
      const enhancementPrompt = `You are an AI prompt enhancer. Improve the following AI image generation prompt by:
      1. Adding vivid details (colors, lighting, textures).
      2. Specifying artistic style (e.g., "cinematic lighting, hyper-detailed, unreal engine 5").
      3. Ensuring clarity and coherence.
      4. Keeping the original intent.
      
      Return ONLY the enhanced prompt, no additional text.
      
      Original prompt: "${prompt}"`;

      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct", // Model terbaru untuk hasil lebih baik
          prompt: enhancementPrompt,
          temperature: 0.7,                // Sedikit lebih kreatif
          max_tokens: 300,                 // Lebih banyak ruang untuk detail
          top_p: 1.0,                      // Gunakan seluruh distribusi token
          frequency_penalty: 0.5,          // Kurangi pengulangan kata
          presence_penalty: 0.5,           // Dorong konsep baru
          stop: ["Original prompt:"]       // Hentikan generasi jika mengulang prompt awal
        }),
        timeout: 15000                     // Timeout lebih panjang
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const enhancedText = (result.choices?.[0]?.text || result.text || '').trim();

      // Format output
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
        
        // Tambahkan fungsi copy
        document.querySelector('.copy-btn')?.addEventListener('click', (e) => {
          const promptToCopy = e.target.getAttribute('data-prompt') || 
                              e.target.closest('.copy-btn').getAttribute('data-prompt');
          navigator.clipboard.writeText(promptToCopy);
          
          // Tampilkan notifikasi
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
