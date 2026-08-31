/* ==========================================
   AETHERPATH SETTINGS COMPONENT
   ========================================== */

import { store } from '../state.js';
import { aiEngine } from '../ai.js';

export class SettingsComponent {
  constructor() {
    this.mockOption = document.getElementById('engine-mock-option');
    this.groqOption = document.getElementById('engine-groq-option');
    this.keySection = document.getElementById('groq-key-section');
    this.keyInput = document.getElementById('settings-groq-key');
    
    this.toggleVisibilityBtn = document.getElementById('settings-toggle-key-visibility');
    this.testKeyBtn = document.getElementById('settings-btn-test-key');
    this.testStatusMsg = document.getElementById('key-test-status-msg');
    
    this.resetAppBtn = document.getElementById('settings-btn-reset-app');

    this.initEvents();
  }

  initEvents() {
    // Select Mock engine
    this.mockOption.addEventListener('click', () => {
      store.setEngine('mock');
      aiEngine.updateSettings('mock', store.loadFromStorage().settings.groqKey);
    });

    // Select Groq engine
    this.groqOption.addEventListener('click', () => {
      store.setEngine('groq');
      const key = store.loadFromStorage().settings.groqKey;
      aiEngine.updateSettings('groq', key);
    });

    // Save key on typing
    this.keyInput.addEventListener('input', () => {
      const key = this.keyInput.value.trim();
      store.setGroqKey(key);
      aiEngine.updateSettings(store.loadFromStorage().settings.engine, key);
    });

    // Toggle API Key visibility
    this.toggleVisibilityBtn.addEventListener('click', () => {
      const icon = this.toggleVisibilityBtn.querySelector('i');
      if (this.keyInput.type === 'password') {
        this.keyInput.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        this.keyInput.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
      }
      lucide.createIcons();
    });

    // Test API Key connection
    this.testKeyBtn.addEventListener('click', () => this.testGroqConnection());

    // Reset application
    this.resetAppBtn.addEventListener('click', () => {
      if (confirm('CRITICAL: This will reset all your courses progress, custom roadmaps, message logs, and settings. Proceed?')) {
        store.resetAllState();
        window.location.reload();
      }
    });
  }

  async testGroqConnection() {
    const key = this.keyInput.value.trim();
    if (!key) {
      this.testStatusMsg.className = 'key-test-status error';
      this.testStatusMsg.textContent = 'Please enter an API Key first.';
      return;
    }

    this.testStatusMsg.className = 'key-test-status';
    this.testStatusMsg.style.color = 'var(--text-muted)';
    this.testStatusMsg.textContent = 'Testing connection, sending secure request to Groq...';
    
    this.testKeyBtn.disabled = true;

    try {
      const isValid = await import('../ai.js').then(module => module.AIEngine.validateKey(key));
      
      this.testKeyBtn.disabled = false;
      if (isValid) {
        this.testStatusMsg.className = 'key-test-status success';
        this.testStatusMsg.style.color = 'var(--secondary)';
        this.testStatusMsg.textContent = 'Success! Groq API connection established successfully.';
      } else {
        this.testStatusMsg.className = 'key-test-status error';
        this.testStatusMsg.style.color = 'var(--danger)';
        this.testStatusMsg.textContent = 'Failed. The API key is invalid or returned a request error.';
      }
    } catch (e) {
      this.testKeyBtn.disabled = false;
      this.testStatusMsg.className = 'key-test-status error';
      this.testStatusMsg.style.color = 'var(--danger)';
      this.testStatusMsg.textContent = `Error: ${e.message}`;
    }
  }

  render(state) {
    const engine = state.settings.engine;
    this.keyInput.value = state.settings.groqKey || '';

    // Adjust active visual highlights
    if (engine === 'mock') {
      this.mockOption.classList.add('active');
      this.groqOption.classList.remove('active');
      this.keySection.classList.add('hidden');
    } else {
      this.mockOption.classList.remove('active');
      this.groqOption.classList.add('active');
      this.keySection.classList.remove('hidden');
    }
  }
}
export default SettingsComponent;
