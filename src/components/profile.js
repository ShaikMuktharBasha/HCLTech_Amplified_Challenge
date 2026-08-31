/* ==========================================
   AETHERPATH PROFILE COMPONENT
   ========================================== */

import { store } from '../state.js';
import { aiEngine } from '../ai.js';

export class ProfileComponent {
  constructor() {
    this.form = document.getElementById('profile-edit-form');
    this.nameInput = document.getElementById('profile-name');
    this.levelSelect = document.getElementById('profile-level');
    this.commitmentSelect = document.getElementById('profile-commitment');
    this.styleSelect = document.getElementById('profile-style');
    this.interestsInput = document.getElementById('profile-interests');
    this.historyTextarea = document.getElementById('profile-history');
    
    this.initEvents();
  }

  initEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleProfileSave();
    });
  }

  handleProfileSave() {
    const name = this.nameInput.value.trim() || 'Pathfinder Learner';
    const level = this.levelSelect.value;
    const commitment = this.commitmentSelect.value;
    const style = this.styleSelect.value;
    
    // Parse comma separated list
    const interests = this.interestsInput.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
      
    const history = this.historyTextarea.value.trim();

    // Update store
    store.updateProfile({
      name,
      level,
      commitment,
      style,
      interests,
      history
    });

    // Notify user of success
    const button = document.getElementById('profile-save-btn');
    const originalHtml = button.innerHTML;
    
    button.innerHTML = `<i data-lucide="check-circle"></i> Changes Applied!`;
    button.className = 'btn btn-secondary';
    lucide.createIcons();

    // Reset button after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.className = 'btn btn-primary btn-with-icon';
      lucide.createIcons();
    }, 2000);

    // If an active track is already loaded, reconfigure the details dynamically
    const state = store.loadFromStorage();
    if (state.activeTrackId) {
      // Toggle pace configuration based on commitment
      const isAccelerated = commitment === '20+' || commitment === '10-20';
      store.reconfigureRoadmap(
        isAccelerated ? 'accelerated' : 'standard', 
        style, 
        'all'
      );
      
      // Post system announcement in chat
      store.addChatMessage('bot', `### Profile Synced
      
Hi **${name}**, I have updated your dashboard preferences and re-aligned your active roadmap nodes:
* **Target Focus**: Adjusted to **${style}** learning style.
* **Commitment Intensity**: Calibrated for **${commitment} hours/week** (Pace: ${isAccelerated ? 'Accelerated' : 'Standard'}).
* **Experience Tier**: Set to **${level}**.

Check the **Dashboard** and **Roadmap** tabs to view the customized timeline changes!`);
    } else {
      store.addChatMessage('bot', `Thank you for updating your profile, **${name}**! I have registered your interest in *${interests.slice(0, 3).join(', ')}* at a **${level}** skill level. Tell me what career path you'd like to unlock!`);
    }

    // Switch tab to dashboard so they see the result
    setTimeout(() => {
      store.setTab('dashboard');
    }, 800);
  }

  render(state) {
    this.nameInput.value = state.profile.name;
    this.levelSelect.value = state.profile.level;
    this.commitmentSelect.value = state.profile.commitment;
    this.styleSelect.value = state.profile.style;
    this.interestsInput.value = state.profile.interests.join(', ');
    this.historyTextarea.value = state.profile.history || '';
  }
}
export default ProfileComponent;
