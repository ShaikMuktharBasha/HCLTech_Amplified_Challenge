/* ==========================================
   AETHERPATH CHAT COMPONENT (GROQ POWERED AI COACH)
   ========================================== */

import { store } from '../state.js';
import { aiEngine, AIEngine } from '../ai.js';

export class ChatComponent {
  constructor() {
    this.stream = document.getElementById('chat-message-stream');
    this.input = document.getElementById('chat-text-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.clearBtn = document.getElementById('chat-clear-history');
    this.quickReplies = document.getElementById('chat-quick-replies');

    // Groq UI Header & Banner Controls
    this.groqPill = document.getElementById('chat-groq-pill');
    this.groqPillText = document.getElementById('chat-groq-pill-text');
    this.groqPillDot = document.getElementById('chat-groq-pill-dot');
    this.configKeyBtn = document.getElementById('chat-config-key-btn');
    this.configKeyBtnText = document.getElementById('chat-config-key-btn-text');

    this.groqBanner = document.getElementById('chat-groq-banner');
    this.inlineKeyInput = document.getElementById('chat-inline-groq-key');
    this.toggleInlineKeyVis = document.getElementById('chat-toggle-inline-key-vis');
    this.inlineSaveBtn = document.getElementById('chat-inline-save-btn');
    this.inlineSimulatorBtn = document.getElementById('chat-inline-simulator-btn');
    this.inlineFeedback = document.getElementById('chat-inline-feedback');

    this.isTyping = false;
    this.bannerManuallyToggled = false;
    this.initEvents();
  }

  initEvents() {
    // Send message on button click
    this.sendBtn.addEventListener('click', () => this.handleSendMessage());

    // Send message on Enter key (without Shift)
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Clear history
    this.clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your conversation history?')) {
        store.clearChatHistory();
      }
    });

    // Quick replies click delegation
    this.quickReplies.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-reply-btn');
      if (btn) {
        const query = btn.getAttribute('data-query');
        this.input.value = query;
        this.handleSendMessage();
      }
    });

    // Auto-resize textarea
    this.input.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = Math.min(this.input.scrollHeight, 180) + 'px';
    });

    // Copy code button delegation on message stream
    this.stream.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.copy-code-btn');
      if (copyBtn) {
        const codeBlock = copyBtn.closest('.code-block');
        const codeEl = codeBlock ? codeBlock.querySelector('code') : null;
        if (codeEl) {
          navigator.clipboard.writeText(codeEl.innerText).then(() => {
            const origHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i data-lucide="check"></i> Copied!`;
            copyBtn.classList.add('copied');
            lucide.createIcons();
            setTimeout(() => {
              copyBtn.innerHTML = origHtml;
              copyBtn.classList.remove('copied');
              lucide.createIcons();
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy code: ', err);
          });
        }
      }
    });

    // Toggle inline key banner on pill click or config key btn click
    if (this.groqPill) {
      this.groqPill.addEventListener('click', () => this.toggleKeyBanner());
    }
    if (this.configKeyBtn) {
      this.configKeyBtn.addEventListener('click', () => this.toggleKeyBanner());
    }

    // Toggle inline password visibility
    if (this.toggleInlineKeyVis && this.inlineKeyInput) {
      this.toggleInlineKeyVis.addEventListener('click', () => {
        const isPass = this.inlineKeyInput.type === 'password';
        this.inlineKeyInput.type = isPass ? 'text' : 'password';
        const icon = this.toggleInlineKeyVis.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
          lucide.createIcons();
        }
      });
    }

    // Save Groq key directly from inline banner
    if (this.inlineSaveBtn && this.inlineKeyInput) {
      this.inlineSaveBtn.addEventListener('click', () => this.handleSaveInlineKey());
      this.inlineKeyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSaveInlineKey();
        }
      });
    }

    // Switch to simulator from inline banner
    if (this.inlineSimulatorBtn) {
      this.inlineSimulatorBtn.addEventListener('click', () => {
        store.setEngine('mock');
        aiEngine.updateSettings('mock', store.loadFromStorage().settings.groqKey);
        this.setInlineFeedback('Switched to Local Simulator mode.', 'info');
        setTimeout(() => {
          if (this.groqBanner) this.groqBanner.classList.add('hidden');
        }, 1200);
      });
    }
  }

  toggleKeyBanner() {
    if (!this.groqBanner) return;
    this.bannerManuallyToggled = true;
    this.groqBanner.classList.toggle('hidden');
    if (!this.groqBanner.classList.contains('hidden') && this.inlineKeyInput) {
      this.inlineKeyInput.focus();
    }
  }

  setInlineFeedback(msg, type = 'info') {
    if (!this.inlineFeedback) return;
    this.inlineFeedback.className = `groq-banner-feedback ${type}`;
    this.inlineFeedback.textContent = msg;
  }

  async handleSaveInlineKey() {
    const key = this.inlineKeyInput.value.trim();
    if (!key) {
      this.setInlineFeedback('Please enter a Groq API key (starts with gsk_)', 'error');
      return;
    }

    this.setInlineFeedback('Validating key with Groq Cloud API...', 'info');
    this.inlineSaveBtn.disabled = true;

    try {
      const state = store.loadFromStorage();
      const model = state.settings.groqModel || 'llama-3.3-70b-versatile';
      const isValid = await AIEngine.validateKey(key, model);

      this.inlineSaveBtn.disabled = false;
      if (isValid) {
        store.setGroqKey(key);
        store.setEngine('groq');
        aiEngine.updateSettings('groq', key, model);

        this.setInlineFeedback('Connected! Groq API is active with ' + model, 'success');
        setTimeout(() => {
          if (this.groqBanner) this.groqBanner.classList.add('hidden');
        }, 1500);
      } else {
        // Still save key in case user wants to try anyway or network had a momentary blip
        store.setGroqKey(key);
        store.setEngine('groq');
        aiEngine.updateSettings('groq', key, model);
        this.setInlineFeedback('Key saved. (Validation ping returned non-200; verify key at console.groq.com)', 'warning');
      }
    } catch (e) {
      this.inlineSaveBtn.disabled = false;
      this.setInlineFeedback(`Error: ${e.message}`, 'error');
    }
  }

  async handleSendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    // Reset input
    this.input.value = '';
    this.input.style.height = 'auto';

    // Add user message to state
    store.addChatMessage('user', text);
    
    // Set typing state
    this.isTyping = true;
    this.renderTypingIndicator();

    try {
      // Get bot response from AI engine with full context
      const state = store.loadFromStorage();
      const response = await aiEngine.processMessage(
        text, 
        state.profile, 
        state.chatHistory, 
        state.roadmap
      );
      
      // Remove typing indicator
      this.removeTypingIndicator();
      this.isTyping = false;

      // Handle path generation or state adaptions
      if (response.type === 'PATH_GENERATION' && response.roadmap) {
        store.setRoadmap(response.trackId, response.roadmap);
        store.addChatMessage('bot', response.explanation);
        // Switch to roadmap tab after a moment so they can view the visual canvas
        setTimeout(() => {
          store.setTab('roadmap');
        }, 1800);
      } else if (response.type === 'ADAPT_PROFILE' && response.profileUpdate) {
        store.updateProfile(response.profileUpdate);
        store.addChatMessage('bot', response.explanation);
      } else if (response.type === 'ADAPT_CONFIG' && response.configUpdate) {
        const pace = response.configUpdate.pace || 'standard';
        store.reconfigureRoadmap(pace, 'balanced', 'all');
        store.addChatMessage('bot', response.explanation);
      } else {
        // Standard conversational answer
        store.addChatMessage('bot', response.explanation);
      }

    } catch (e) {
      console.error('Chat error:', e);
      this.removeTypingIndicator();
      this.isTyping = false;
      store.addChatMessage('bot', `⚠️ I encountered an error while processing that message: ${e.message}`);
    }
  }

  renderTypingIndicator() {
    const indicatorHtml = `
      <div class="chat-message bot typing-indicator-msg" id="chat-typing-msg">
        <div class="msg-avatar"><i data-lucide="bot"></i></div>
        <div class="msg-content">
          <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
    this.stream.insertAdjacentHTML('beforeend', indicatorHtml);
    lucide.createIcons();
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('chat-typing-msg');
    if (el) el.remove();
  }

  render(state) {
    // 1. Sync Groq UI Status Elements
    const isGroq = state.settings.engine === 'groq';
    const activeKey = state.settings.groqKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
    const hasKey = !!(activeKey && activeKey.trim());
    const model = state.settings.groqModel || 'llama-3.3-70b-versatile';
    const shortModelName = model.includes('70b') ? 'Llama 3.3 70B' : model.includes('8b') ? 'Llama 3.1 8B' : model;

    if (this.groqPill && this.groqPillText && this.groqPillDot) {
      if (isGroq) {
        if (hasKey) {
          this.groqPillText.textContent = `Groq: ${shortModelName}`;
          this.groqPillDot.className = 'pill-dot active';
          this.groqPill.className = 'groq-model-pill connected';
        } else {
          this.groqPillText.textContent = `Set Groq API Key`;
          this.groqPillDot.className = 'pill-dot pending';
          this.groqPill.className = 'groq-model-pill pending';
        }
      } else {
        this.groqPillText.textContent = `Offline Simulator`;
        this.groqPillDot.className = 'pill-dot mock';
        this.groqPill.className = 'groq-model-pill mock';
      }
    }

    if (this.configKeyBtnText) {
      if (isGroq) {
        this.configKeyBtnText.textContent = hasKey ? 'Groq Key ✓' : 'Connect Groq';
      } else {
        this.configKeyBtnText.textContent = 'Switch to Groq';
      }
    }

    // Auto-show inline banner if Groq engine is active but no key is present, unless dismissed
    if (this.groqBanner) {
      if (isGroq && !hasKey && !this.bannerManuallyToggled) {
        this.groqBanner.classList.remove('hidden');
      } else if (hasKey && !this.bannerManuallyToggled) {
        this.groqBanner.classList.add('hidden');
      }
      if (this.inlineKeyInput && !this.inlineKeyInput.value && activeKey) {
        this.inlineKeyInput.value = activeKey;
      }
    }

    // 2. Render Message Stream
    this.stream.innerHTML = '';

    state.chatHistory.forEach(msg => {
      const isBot = msg.sender === 'bot';
      const bubbleClass = isBot ? 'bot' : 'user';
      const avatarIcon = isBot ? 'bot' : 'user';
      const formattedText = this.renderMarkdown(msg.text);

      const html = `
        <div class="chat-message ${bubbleClass} animate-fade-in">
          <div class="msg-avatar"><i data-lucide="${avatarIcon}"></i></div>
          <div class="msg-content">${formattedText}</div>
        </div>
      `;
      this.stream.insertAdjacentHTML('beforeend', html);
    });

    // Re-initialize icons inside stream
    lucide.createIcons();
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.stream.scrollTop = this.stream.scrollHeight;
  }

  // Enhanced Client-Side Markdown Renderer with Fenced Code Blocks, Links & Lists
  renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    // 1. Extract and preserve fenced code blocks (```language ... ```)
    const codeBlocks = [];
    html = html.replace(/```([a-zA-Z0-9_\-\.\+]*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      const id = `__CODE_BLOCK_${codeBlocks.length}__`;
      const displayLang = (lang || 'code').toUpperCase();
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const codeHtml = `
        <div class="code-block">
          <div class="code-header">
            <span class="code-lang">${displayLang}</span>
            <button class="copy-code-btn" type="button" title="Copy code">
              <i data-lucide="copy"></i> Copy
            </button>
          </div>
          <pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>
        </div>
      `;
      codeBlocks.push(codeHtml);
      return id;
    });

    // 2. Escape any remaining raw HTML outside code blocks
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 3. Inline code (`code`)
    html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

    // 4. Markdown links [title](url)
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <i data-lucide="external-link" class="link-icon"></i></a>');

    // 5. Blockquotes (> quote)
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
    // Group consecutive blockquotes
    html = html.replace(/(<\/blockquote>\s*<blockquote>)/g, '<br>');

    // 6. Headers
    html = html.replace(/^####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^###\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#\s+(.*)$/gm, '<h2>$1</h2>');

    // 7. Bold (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // 8. Italic (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // 9. Ordered list items (1. item)
    html = html.replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li class="ol-item">$2</li>');
    html = html.replace(/(<li class="ol-item">.*?<\/li>(\s*<li class="ol-item">.*?<\/li>)*)/gs, '<ol>$1</ol>');

    // 10. Unordered list items (* item or - item)
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '<li class="ul-item">$1</li>');
    html = html.replace(/(<li class="ul-item">.*?<\/li>(\s*<li class="ul-item">.*?<\/li>)*)/gs, '<ul>$1</ul>');

    // 11. Paragraphs
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Don't wrap block elements in <p>
      if (
        trimmed.startsWith('<h') || 
        trimmed.startsWith('<ul') || 
        trimmed.startsWith('<ol') || 
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('__CODE_BLOCK_')
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    // 12. Restore code blocks
    codeBlocks.forEach((blockHtml, idx) => {
      html = html.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
    });

    return html;
  }
}
export default ChatComponent;
