/* ==========================================
   AETHERPATH SETTINGS COMPONENT (GROQ API & CONFIGURATION)
   ========================================== */

import { store } from '../state.js';
import { aiEngine, AIEngine } from '../ai.js';

export class SettingsComponent {
  constructor() {
    this.mockOption = document.getElementById('engine-mock-option');
    this.groqOption = document.getElementById('engine-groq-option');
    this.keySection = document.getElementById('groq-key-section');
    this.keyInput = document.getElementById('settings-groq-key');
    this.modelSelect = document.getElementById('settings-groq-model');
    
    this.toggleVisibilityBtn = document.getElementById('settings-toggle-key-visibility');
    this.testKeyBtn = document.getElementById('settings-btn-test-key');
    this.testStatusMsg = document.getElementById('key-test-status-msg');
    
    this.resetAppBtn = document.getElementById('settings-btn-reset-app');
    this.googleClientIdInput = document.getElementById('settings-google-client-id');

    this.initEvents();
  }

  initEvents() {
    // Select Mock engine
    if (this.mockOption) {
      this.mockOption.addEventListener('click', () => {
        store.setEngine('mock');
        const st = store.loadFromStorage();
        aiEngine.updateSettings('mock', st.settings.groqKey, st.settings.groqModel);
      });
    }

    // Select Groq engine
    if (this.groqOption) {
      this.groqOption.addEventListener('click', () => {
        store.setEngine('groq');
        const st = store.loadFromStorage();
        aiEngine.updateSettings('groq', st.settings.groqKey, st.settings.groqModel);
      });
    }

    // Model selection change
    if (this.modelSelect) {
      this.modelSelect.addEventListener('change', () => {
        const selectedModel = this.modelSelect.value;
        store.setGroqModel(selectedModel);
        const st = store.loadFromStorage();
        aiEngine.updateSettings(st.settings.engine, st.settings.groqKey, selectedModel);
      });
    }

    // Save key on typing
    if (this.keyInput) {
      this.keyInput.addEventListener('input', () => {
        const key = this.keyInput.value.trim();
        store.setGroqKey(key);
        const st = store.loadFromStorage();
        aiEngine.updateSettings(st.settings.engine, key, st.settings.groqModel);
      });
    }

    // Save google client ID on typing
    if (this.googleClientIdInput) {
      this.googleClientIdInput.addEventListener('input', () => {
        const val = this.googleClientIdInput.value.trim();
        store.setGoogleClientId(val);
      });
    }

    // Toggle API Key visibility
    if (this.toggleVisibilityBtn && this.keyInput) {
      this.toggleVisibilityBtn.addEventListener('click', () => {
        const icon = this.toggleVisibilityBtn.querySelector('i');
        if (this.keyInput.type === 'password') {
          this.keyInput.type = 'text';
          if (icon) icon.setAttribute('data-lucide', 'eye-off');
        } else {
          this.keyInput.type = 'password';
          if (icon) icon.setAttribute('data-lucide', 'eye');
        }
        lucide.createIcons();
      });
    }

    // Test API Key connection with Groq
    if (this.testKeyBtn) {
      this.testKeyBtn.addEventListener('click', () => this.testGroqConnection());
    }

    // Reset application
    if (this.resetAppBtn) {
      this.resetAppBtn.addEventListener('click', () => {
        if (confirm('CRITICAL: This will reset all your course progress, custom roadmaps, message logs, and settings. Proceed?')) {
          store.resetAllState();
          window.location.reload();
        }
      });
    }
  }

  async testGroqConnection() {
    const key = this.keyInput ? this.keyInput.value.trim() : '';
    if (!key) {
      this.testStatusMsg.className = 'key-test-status error';
      this.testStatusMsg.textContent = 'Please enter a Groq API Key first (starts with gsk_).';
      return;
    }

    const model = this.modelSelect ? this.modelSelect.value : 'llama-3.3-70b-versatile';

    this.testStatusMsg.className = 'key-test-status';
    this.testStatusMsg.style.color = 'var(--text-muted)';
    this.testStatusMsg.textContent = `Testing connection to Groq Cloud (${model})...`;
    
    this.testKeyBtn.disabled = true;

    try {
      const isValid = await AIEngine.validateKey(key, model);
      
      this.testKeyBtn.disabled = false;
      if (isValid) {
        this.testStatusMsg.className = 'key-test-status success';
        this.testStatusMsg.style.color = 'var(--secondary)';
        this.testStatusMsg.textContent = `Success! Groq API connection established with ${model}.`;
      } else {
        this.testStatusMsg.className = 'key-test-status error';
        this.testStatusMsg.style.color = 'var(--danger)';
        this.testStatusMsg.textContent = 'Failed: The API key is invalid or returned an error from Groq.';
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
    if (this.keyInput) {
      this.keyInput.value = state.settings.groqKey || '';
    }
    if (this.modelSelect && state.settings.groqModel) {
      this.modelSelect.value = state.settings.groqModel;
    }
    if (this.googleClientIdInput) {
      this.googleClientIdInput.value = state.settings.googleClientId || '';
    }

    // Visual highlights for selected engine
    if (engine === 'mock') {
      if (this.mockOption) this.mockOption.classList.add('active');
      if (this.groqOption) this.groqOption.classList.remove('active');
      if (this.keySection) this.keySection.classList.add('hidden');
    } else {
      if (this.mockOption) this.mockOption.classList.remove('active');
      if (this.groqOption) this.groqOption.classList.add('active');
      if (this.keySection) this.keySection.classList.remove('hidden');
    }
  }
}
export default SettingsComponent;
