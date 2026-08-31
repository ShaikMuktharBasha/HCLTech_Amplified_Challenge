/* ==========================================
   AETHERPATH ROADMAP COMPONENT
   ========================================== */

import { store } from '../state.js';

export class RoadmapComponent {
  constructor() {
    this.canvas = document.getElementById('roadmap-canvas-container');
    this.titleDisplay = document.getElementById('roadmap-title-display');
    this.descDisplay = document.getElementById('roadmap-desc-display');
    this.statHours = document.getElementById('roadmap-stat-hours');
    this.statProjects = document.getElementById('roadmap-stat-projects');
    
    // Sidebar Controls
    this.recalcBtn = document.getElementById('roadmap-btn-recalculate');
    this.goChatBtn = document.getElementById('roadmap-btn-go-chat');
    
    // Modal Elements
    this.modal = document.getElementById('node-modal');
    this.modalClose = document.getElementById('modal-close-btn');
    this.modalTitle = document.getElementById('modal-node-title');
    this.modalType = document.getElementById('modal-node-type');
    this.modalDuration = document.getElementById('modal-node-duration');
    this.modalDifficulty = document.getElementById('modal-node-difficulty');
    this.modalCost = document.getElementById('modal-node-cost');
    this.modalDesc = document.getElementById('modal-node-description');
    this.modalSkills = document.getElementById('modal-node-skills');
    this.modalResources = document.getElementById('modal-node-resources');
    this.modalToggleStatusBtn = document.getElementById('modal-btn-toggle-status');
    this.modalSkipBtn = document.getElementById('modal-btn-skip');

    this.activeNodeId = null;
    
    this.initEvents();
  }

  initEvents() {
    // Recalculate event
    if (this.recalcBtn) {
      this.recalcBtn.addEventListener('click', () => {
        this.applySidebarConfigurations();
      });
    }

    // Go to Chat event (on empty placeholder)
    if (this.goChatBtn) {
      this.goChatBtn.addEventListener('click', () => {
        store.setTab('chat');
      });
    }

    // Sidebar config item click
    document.querySelectorAll('.segmented-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = e.target.parentElement;
        parent.querySelectorAll('.segmented-item').forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
        
        // Instant updates on toggle
        this.applySidebarConfigurations();
      });
    });

    // Close Modal Events
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Modal Status Toggle
    this.modalToggleStatusBtn.addEventListener('click', () => {
      if (this.activeNodeId) {
        store.toggleNodeStatus(this.activeNodeId);
        this.closeModal();
      }
    });

    // Modal Skip Toggle
    this.modalSkipBtn.addEventListener('click', () => {
      if (this.activeNodeId) {
        store.toggleNodeSkip(this.activeNodeId);
        this.closeModal();
      }
    });
  }

  applySidebarConfigurations() {
    const paceBtn = document.querySelector('.segmented-item[data-config="pace"].active');
    const focusBtn = document.querySelector('.segmented-item[data-config="focus"].active');
    const levelBtn = document.querySelector('.segmented-item[data-config="level"].active');

    const pace = paceBtn ? paceBtn.getAttribute('data-val') : 'standard';
    const focus = focusBtn ? focusBtn.getAttribute('data-val') : 'balanced';
    const level = levelBtn ? levelBtn.getAttribute('data-val') : 'all';

    store.reconfigureRoadmap(pace, focus, level);
  }

  openModal(node) {
    this.activeNodeId = node.id;
    
    // Fill text
    this.modalTitle.textContent = node.name;
    this.modalType.textContent = node.type.toUpperCase();
    
    // Set type tag styles on modal
    this.modalType.className = 'value node-type-tag';
    if (node.type === 'course') this.modalType.classList.add('type-course');
    else if (node.type === 'project') this.modalType.classList.add('type-project');
    else this.modalType.classList.add('type-assessment');

    this.modalDuration.textContent = node.duration;
    this.modalDifficulty.textContent = node.difficulty;
    this.modalCost.textContent = node.cost || 'Free';
    this.modalDesc.textContent = node.description;

    // Fill skills tags
    this.modalSkills.innerHTML = '';
    if (node.skills && node.skills.length > 0) {
      node.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        this.modalSkills.appendChild(tag);
      });
    } else {
      this.modalSkills.innerHTML = '<span class="skill-tag">Knowledge Transfer</span>';
    }

    // Fill resources list
    this.modalResources.innerHTML = '';
    if (node.resources && node.resources.length > 0) {
      node.resources.forEach(res => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = res.url;
        link.target = '_blank';
        link.innerHTML = `<i data-lucide="external-link"></i> ${res.title}`;
        li.appendChild(link);
        this.modalResources.appendChild(li);
      });
    } else {
      this.modalResources.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">No external links required. Rely on core materials.</p>';
    }

    // Update Action Button states
    if (node.status === 'locked') {
      this.modalToggleStatusBtn.disabled = true;
      this.modalToggleStatusBtn.textContent = 'Locked (Prerequisites needed)';
      this.modalSkipBtn.disabled = true;
      this.modalSkipBtn.textContent = 'Skip Resource';
    } else {
      this.modalToggleStatusBtn.disabled = false;
      this.modalSkipBtn.disabled = false;

      if (node.status === 'completed') {
        this.modalToggleStatusBtn.textContent = 'Mark as Incomplete';
        this.modalToggleStatusBtn.className = 'btn btn-secondary';
        this.modalSkipBtn.disabled = true; // cannot skip completed
      } else {
        this.modalToggleStatusBtn.textContent = 'Mark as Completed';
        this.modalToggleStatusBtn.className = 'btn btn-primary';
      }

      if (node.status === 'skipped') {
        this.modalSkipBtn.textContent = 'Restore Resource';
        this.modalToggleStatusBtn.disabled = true; // cannot complete skipped
      } else {
        this.modalSkipBtn.textContent = 'Skip Resource';
      }
    }

    // Open Modal Overlay
    this.modal.classList.add('active');
    lucide.createIcons();
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.activeNodeId = null;
  }

  render(state) {
    if (!state.roadmap) {
      // Empty State
      this.titleDisplay.textContent = 'Structured Learning Roadmap';
      this.descDisplay.textContent = 'Generate a path to view resource prerequisites and milestones.';
      this.statHours.textContent = '0 hrs';
      this.statProjects.textContent = '0 Projects';

      this.canvas.innerHTML = `
        <div class="empty-roadmap-message">
          <i data-lucide="milestone" class="pulse"></i>
          <h3>No Active Roadmap</h3>
          <p>Ask the AI Coach in the tab below to recommend a roadmap tailored to your experience and goals, or type a topic to generate it.</p>
          <button class="btn btn-primary btn-with-icon" id="roadmap-btn-go-chat-dynamic">
            <i data-lucide="message-square-code"></i> Talk to AI Coach
          </button>
        </div>
      `;
      
      const dynBtn = document.getElementById('roadmap-btn-go-chat-dynamic');
      if (dynBtn) {
        dynBtn.addEventListener('click', () => store.setTab('chat'));
      }
      
      lucide.createIcons();
      return;
    }

    // Populate Headers and Stats
    const totalHours = state.roadmap.phases.reduce((sum, p) => {
      return sum + p.nodes.reduce((pSum, n) => {
        const hours = parseInt(n.duration);
        return pSum + (isNaN(hours) ? 0 : hours);
      }, 0);
    }, 0);

    const totalProjects = state.roadmap.phases.reduce((sum, p) => {
      return sum + p.nodes.filter(n => n.type === 'project').length;
    }, 0);

    this.titleDisplay.textContent = state.roadmap.name;
    this.descDisplay.textContent = state.roadmap.description;
    this.statHours.textContent = `${totalHours} hrs total`;
    this.statProjects.textContent = `${totalProjects} Projects`;

    // Clear Canvas
    this.canvas.innerHTML = '';

    // Render Phases
    state.roadmap.phases.forEach((phase, phaseIdx) => {
      const phaseWrapper = document.createElement('div');
      phaseWrapper.className = 'roadmap-phase animate-fade-in';
      phaseWrapper.style.animationDelay = `${phaseIdx * 0.1}s`;

      const header = document.createElement('div');
      header.className = 'roadmap-phase-header';
      header.innerHTML = `
        <div class="phase-number">${phaseIdx + 1}</div>
        <h4 class="phase-title">${phase.name}</h4>
      `;
      phaseWrapper.appendChild(header);

      const nodesContainer = document.createElement('div');
      nodesContainer.className = 'roadmap-nodes-container';

      // Level configuration filtering
      const levelBtn = document.querySelector('.segmented-item[data-config="level"].active');
      const levelVal = levelBtn ? levelBtn.getAttribute('data-val') : 'all';

      phase.nodes.forEach(node => {
        // Core only filter hides assessments
        if (levelVal === 'core' && node.type === 'assessment') return;

        const nodeEl = document.createElement('div');
        
        // Status class mapping
        const statusClass = `status-${node.status}`;
        nodeEl.className = `roadmap-node glass-panel ${statusClass}`;

        // Get Status Icon
        let iconName = 'circle';
        if (node.status === 'locked') iconName = 'lock';
        else if (node.status === 'completed') iconName = 'check-circle';
        else if (node.status === 'skipped') iconName = 'skip-forward';

        // Get Type Tag Label
        let typeTagClass = 'type-course';
        if (node.type === 'project') typeTagClass = 'type-project';
        else if (node.type === 'assessment') typeTagClass = 'type-assessment';

        nodeEl.innerHTML = `
          <div class="node-status-icon">
            <i data-lucide="${iconName}"></i>
          </div>
          <div class="node-details-brief">
            <div class="node-title-row">
              <span class="node-name">${node.name}</span>
              <span class="node-type-tag ${typeTagClass}">${node.type}</span>
            </div>
            <div class="node-meta-row">
              <span><i data-lucide="clock"></i> ${node.duration}</span>
              <span><i data-lucide="sliders"></i> ${node.difficulty}</span>
              <span><i data-lucide="dollar-sign"></i> ${node.cost || 'Free'}</span>
            </div>
          </div>
        `;

        // Click event to open Modal
        nodeEl.addEventListener('click', () => {
          this.openModal(node);
        });

        nodesContainer.appendChild(nodeEl);
      });

      phaseWrapper.appendChild(nodesContainer);
      this.canvas.appendChild(phaseWrapper);
    });

    lucide.createIcons();
  }
}
export default RoadmapComponent;
