/* ==========================================
   AETHERPATH CHAT COMPONENT
   ========================================== */

import { store } from '../state.js';
import { aiEngine } from '../ai.js';

export class ChatComponent {
  constructor() {
    this.stream = document.getElementById('chat-message-stream');
    this.input = document.getElementById('chat-text-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.clearBtn = document.getElementById('chat-clear-history');
    this.quickReplies = document.getElementById('chat-quick-replies');

    this.isTyping = false;
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
      this.input.style.height = (this.input.scrollHeight) + 'px';
    });
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
      // Get bot response from AI engine
      const state = store.loadFromStorage(); // get latest state
      const response = await aiEngine.processMessage(text, state.profile);
      
      // Remove typing indicator
      this.removeTypingIndicator();
      this.isTyping = false;

      // Handle path generation or state adaptions
      if (response.type === 'PATH_GENERATION' && response.roadmap) {
        store.setRoadmap(response.trackId, response.roadmap);
        store.addChatMessage('bot', response.explanation);
        // Switch to roadmap tab so they can see the visual path
        setTimeout(() => {
          store.setTab('roadmap');
        }, 1500);
      } else if (response.type === 'ADAPT_PROFILE' && response.profileUpdate) {
        store.updateProfile(response.profileUpdate);
        store.addChatMessage('bot', response.explanation);
      } else if (response.type === 'ADAPT_CONFIG' && response.configUpdate) {
        const pace = response.configUpdate.pace || 'standard';
        store.reconfigureRoadmap(pace, 'balanced', 'all');
        store.addChatMessage('bot', response.explanation);
      } else {
        // Simple chat message
        store.addChatMessage('bot', response.explanation);
      }

    } catch (e) {
      console.error(e);
      this.removeTypingIndicator();
      this.isTyping = false;
      store.addChatMessage('bot', "Sorry, I had an error processing that message. Please try again.");
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
    // Clear stream first
    this.stream.innerHTML = '';

    // Render message logs
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

  // Simple, robust client-side Markdown rendering (supports headers, bold, lists)
  renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Escape HTML tags to prevent XSS (except specific safe patterns)
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace Bold headers (### Header)
    html = html.replace(/^###\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#\s+(.*)$/gm, '<h2>$1</h2>');

    // Replace Bold (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Replace Italic (*text* or _text_)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Replace Unordered Lists (* item)
    // Matches lines starting with * or - followed by space
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in <ul>
    // This regex wraps sequences of <li>...</li> in a <ul> tag
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // Fix double-wrapping of nested list items
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Replace Linebreaks with paragraphs
    // Splits text into paragraphs by double-newlines
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
      // If paragraph contains a block element (like ul, h2, h3, h4), don't wrap in <p>
      if (p.trim().startsWith('<h') || p.trim().startsWith('<ul') || p.trim().startsWith('<ol')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return html;
  }
}
