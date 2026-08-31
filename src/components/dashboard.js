/* ==========================================
   AETHERPATH DASHBOARD COMPONENT
   ========================================== */

import { store } from '../state.js';

export class DashboardComponent {
  constructor() {
    this.progressPct = document.getElementById('dashboard-progress-pct');
    this.progressRatio = document.getElementById('dashboard-progress-ratio');
    this.progressFill = document.getElementById('dashboard-progress-fill');
    
    this.completedCourses = document.getElementById('dashboard-completed-courses');
    this.completedMilestones = document.getElementById('dashboard-completed-milestones');
    this.totalMilestones = document.getElementById('dashboard-total-milestones');
    
    this.skillsChartContainer = document.getElementById('skills-chart-container');
    this.nextActionContainer = document.getElementById('next-action-container');
    this.milestonesList = document.getElementById('dashboard-milestones-list');
    this.milestoneCounter = document.getElementById('dashboard-milestone-counter');
    this.skillsGapContainer = document.getElementById('skills-gap-container');
  }

  render(state) {
    if (!state.roadmap) {
      this.renderEmptyDashboard();
      return;
    }

    // 1. Gather all tasks/nodes
    const allNodes = [];
    state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        allNodes.push(node);
      });
    });

    const totalTasks = allNodes.length;
    const completedTasks = allNodes.filter(n => n.status === 'completed').length;
    const skippedTasks = allNodes.filter(n => n.status === 'skipped').length;
    
    // Effective progress counts skipped as completed/passed
    const progressPercent = totalTasks > 0 ? Math.round(((completedTasks + skippedTasks) / totalTasks) * 100) : 0;

    // 2. Update Progress metrics
    this.progressPct.textContent = `${progressPercent}%`;
    this.progressRatio.textContent = `${completedTasks + skippedTasks} / ${totalTasks} Tasks`;
    this.progressFill.style.width = `${progressPercent}%`;

    // 3. Completed courses count
    const completedCoursesCount = allNodes.filter(n => n.type === 'course' && n.status === 'completed').length;
    this.completedCourses.textContent = completedCoursesCount;

    // 4. Milestone metrics (Projects + Assessments)
    const milestoneNodes = allNodes.filter(n => n.type === 'project' || n.type === 'assessment');
    const totalMilestonesCount = milestoneNodes.length;
    const completedMilestonesCount = milestoneNodes.filter(n => n.status === 'completed' || n.status === 'skipped').length;
    
    this.completedMilestones.textContent = completedMilestonesCount;
    this.totalMilestones.textContent = `/ ${totalMilestonesCount} Total`;
    this.milestoneCounter.textContent = `${completedMilestonesCount}/${totalMilestonesCount}`;

    // 5. Render Next Best Action
    this.renderNextBestAction(allNodes);

    // 6. Render Milestone list
    this.renderMilestoneList(milestoneNodes);

    // 7. Render dynamic SVG Skills Radar Chart
    this.renderSkillsChart(allNodes, state.roadmap.skills || []);

    // 8. Render Skill-Gap Diagnostics
    this.renderSkillGap(state);
  }

  renderEmptyDashboard() {
    this.progressPct.textContent = '0%';
    this.progressRatio.textContent = '0/0 Tasks';
    this.progressFill.style.width = '0%';
    this.completedCourses.textContent = '0';
    this.completedMilestones.textContent = '0';
    this.totalMilestones.textContent = '/ 0 Total';
    this.milestoneCounter.textContent = '0/0';

    this.nextActionContainer.innerHTML = `
      <p class="empty-action">Describe your career objectives to the AI Coach in the tab below to generate your path.</p>
      <button class="btn btn-secondary w-full" id="dash-btn-go-chat" style="margin-top: 10px;">
        <i data-lucide="message-square-code"></i> AI Coach Chat
      </button>
    `;
    
    const goChat = document.getElementById('dash-btn-go-chat');
    if (goChat) {
      goChat.addEventListener('click', () => store.setTab('chat'));
    }

    this.milestonesList.innerHTML = `<p class="empty-list">No roadmap active yet.</p>`;

    this.skillsChartContainer.innerHTML = `
      <div class="no-data-msg">
        <i data-lucide="activity"></i>
        <p>Select or generate a path to visualize your skill development</p>
      </div>
    `;

    if (this.skillsGapContainer) {
      this.skillsGapContainer.innerHTML = `<p class="empty-list">Complete onboarding or select a path to analyze skill gaps.</p>`;
    }

    lucide.createIcons();
  }

  renderSkillGap(state) {
    if (!state.skillGap || !this.skillsGapContainer) return;

    const { target, acquired, missing } = state.skillGap;

    this.skillsGapContainer.innerHTML = `
      <div class="skill-gap-layout">
        <div class="skill-gap-section animate-fade-in" style="animation-delay: 0.1s;">
          <span class="skill-gap-title">Target capabilities</span>
          <div class="skill-gap-tags">
            ${target.map(s => `<span class="skill-gap-tag target">${s}</span>`).join('')}
          </div>
        </div>
        <div class="skill-gap-section animate-fade-in" style="animation-delay: 0.2s;">
          <span class="skill-gap-title">Your acquired skills</span>
          <div class="skill-gap-tags">
            ${acquired.length > 0
              ? acquired.map(s => `<span class="skill-gap-tag acquired"><i data-lucide="check"></i> ${s}</span>`).join('')
              : '<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding-left: 4px;">No matching skills acquired yet.</span>'}
          </div>
        </div>
        <div class="skill-gap-section animate-fade-in" style="animation-delay: 0.3s;">
          <span class="skill-gap-title">Outstanding Skill Gaps (Targeted in Roadmap)</span>
          <div class="skill-gap-tags">
            ${missing.length > 0
              ? missing.map(s => `<span class="skill-gap-tag missing"><i data-lucide="compass"></i> ${s}</span>`).join('')
              : '<span class="skill-gap-tag acquired"><i data-lucide="award"></i> No remaining gaps! You are fully qualified.</span>'}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
  }

  renderNextBestAction(allNodes) {
    // Find the first non-completed, non-skipped node that is 'unlocked'
    const nextActionNode = allNodes.find(n => n.status === 'unlocked');

    if (nextActionNode) {
      let icon = 'graduation-cap';
      let tagText = 'Next Module';
      if (nextActionNode.type === 'project') {
        icon = 'folder-git-2';
        tagText = 'Core Project';
      } else if (nextActionNode.type === 'assessment') {
        icon = 'award';
        tagText = 'Assessment';
      }

      this.nextActionContainer.innerHTML = `
        <div class="next-action-content">
          <div class="next-action-title">
            <i data-lucide="${icon}" style="width: 16px; height: 16px; color: var(--secondary); display: inline; vertical-align: middle; margin-right: 6px;"></i>
            ${nextActionNode.name}
          </div>
          <p class="next-action-desc">${nextActionNode.description}</p>
          <div class="next-action-meta">
            <span class="next-action-tag">${tagText}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);"><i data-lucide="clock" style="width: 12px; height: 12px; display: inline; vertical-align: middle;"></i> ${nextActionNode.duration}</span>
          </div>
          <button class="btn btn-primary w-full" id="dash-btn-complete-action" style="margin-top: 8px;">
            <i data-lucide="check"></i> Mark Complete
          </button>
        </div>
      `;

      document.getElementById('dash-btn-complete-action').addEventListener('click', () => {
        store.toggleNodeStatus(nextActionNode.id);
      });

    } else {
      // Check if everything is finished
      const unfinished = allNodes.filter(n => n.status !== 'completed' && n.status !== 'skipped');
      if (unfinished.length === 0) {
        this.nextActionContainer.innerHTML = `
          <div class="next-action-content" style="text-align: center; padding: 10px 0;">
            <i data-lucide="party-popper" class="glow-icon pulse" style="width: 36px; height: 36px; margin: 0 auto 10px auto;"></i>
            <div class="next-action-title">Path Fully Complete!</div>
            <p class="next-action-desc">Outstanding work! You have finished all courses, assessments, and projects in this path.</p>
          </div>
        `;
      } else {
        // Fallback (prerequisites locked)
        this.nextActionContainer.innerHTML = `
          <div class="next-action-content">
            <p class="empty-action">Prerequisites locked. Complete earlier nodes to unlock the next action.</p>
          </div>
        `;
      }
    }
    lucide.createIcons();
  }

  renderMilestoneList(milestoneNodes) {
    if (milestoneNodes.length === 0) {
      this.milestonesList.innerHTML = `<p class="empty-list">No milestones in this track configuration.</p>`;
      return;
    }

    this.milestonesList.innerHTML = '';
    
    milestoneNodes.forEach(node => {
      const isCompleted = node.status === 'completed' || node.status === 'skipped';
      const isLocked = node.status === 'locked';
      
      const itemEl = document.createElement('div');
      itemEl.className = `milestone-item ${isCompleted ? 'completed' : ''}`;
      
      // Determine status label
      let statusLabel = 'Locked';
      if (node.status === 'unlocked') statusLabel = 'Available';
      else if (node.status === 'completed') statusLabel = 'Completed';
      else if (node.status === 'skipped') statusLabel = 'Skipped';

      itemEl.innerHTML = `
        <input type="checkbox" class="milestone-checkbox" 
          ${isCompleted ? 'checked' : ''} 
          ${isLocked ? 'disabled' : ''} 
          data-id="${node.id}">
        <div class="milestone-details">
          <span class="milestone-name">${node.name}</span>
          <span class="milestone-status">${statusLabel} • ${node.type.toUpperCase()}</span>
        </div>
      `;

      // Tick checkbox event
      itemEl.querySelector('.milestone-checkbox').addEventListener('change', () => {
        store.toggleNodeStatus(node.id);
      });

      this.milestonesList.appendChild(itemEl);
    });
  }

  renderSkillsChart(allNodes, trackSkills) {
    if (trackSkills.length === 0) {
      this.skillsChartContainer.innerHTML = `
        <div class="no-data-msg">
          <i data-lucide="info"></i>
          <p>No predefined skills found in this path.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Calculate skill proficiencies:
    // For each skill, gather nodes that target it.
    // Proficiency = Completed nodes targeting it / Total nodes targeting it.
    const proficiencies = {};
    trackSkills.forEach(skill => {
      const skillNodes = allNodes.filter(node => node.skills && node.skills.includes(skill));
      
      if (skillNodes.length === 0) {
        proficiencies[skill] = 0.15; // baseline
      } else {
        const completedCount = skillNodes.filter(node => node.status === 'completed' || node.status === 'skipped').length;
        proficiencies[skill] = 0.15 + (completedCount / skillNodes.length) * 0.85; // Map to [0.15, 1.0] range for radar radius
      }
    });

    const skills = Object.keys(proficiencies);
    const N = skills.length;

    // Dimensions
    const width = 360;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;
    const r = 90; // maximum radar chart radius

    // Create SVG elements
    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="max-width: ${width}px; max-height: ${height}px;">`;
    
    // Define Grid Circles (concentric circles instead of polygon for premium look)
    const gridLevels = [0.3, 0.6, 1.0];
    gridLevels.forEach(level => {
      const radius = r * level;
      svgContent += `
        <circle cx="${cx}" cy="${cy}" r="${radius}" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.05)" 
          stroke-width="1" />
      `;
    });

    // Compute coordinate points for each axis and values
    const points = [];
    const axesLines = [];
    const labels = [];

    skills.forEach((skill, i) => {
      const angle = (i * 2 * Math.PI) / N - Math.PI / 2;
      
      // Outer axis end point
      const xOuter = cx + r * Math.cos(angle);
      const yOuter = cy + r * Math.sin(angle);
      axesLines.push(`<line x1="${cx}" y1="${cy}" x2="${xOuter}" y2="${yOuter}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`);

      // Proficiency Value point
      const val = proficiencies[skill];
      const xVal = cx + (r * val) * Math.cos(angle);
      const yVal = cy + (r * val) * Math.sin(angle);
      points.push({ x: xVal, y: yVal });

      // Label positioning
      const labelDistance = r + 24;
      const xLabel = cx + labelDistance * Math.cos(angle);
      const yLabel = cy + labelDistance * Math.sin(angle);
      
      // Adjust text anchors based on angle position
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      else if (Math.cos(angle) < -0.1) textAnchor = 'end';

      let dy = '0.35em';
      if (Math.sin(angle) > 0.8) dy = '0.85em';
      else if (Math.sin(angle) < -0.8) dy = '-0.3em';

      const displayProficiency = Math.round((val - 0.15) / 0.85 * 100);

      labels.push(`
        <text x="${xLabel}" y="${yLabel}" 
          fill="var(--text-muted)" 
          font-size="10" 
          font-weight="500" 
          text-anchor="${textAnchor}" 
          dy="${dy}"
          style="font-family: var(--font-body);">
          ${skill}
        </text>
        <text x="${xLabel}" y="${yLabel + 11}" 
          fill="var(--secondary)" 
          font-size="8" 
          font-weight="600" 
          text-anchor="${textAnchor}" 
          dy="${dy}"
          style="font-family: var(--font-body); opacity: 0.85;">
          ${displayProficiency}%
        </text>
      `);
    });

    // Draw axes lines
    svgContent += axesLines.join('');

    // Generate Path data for dynamic polygon shape
    const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    
    // Draw polygon fill and stroke
    svgContent += `
      <defs>
        <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--secondary)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      
      <!-- Skill Polygon -->
      <path d="${pathData}" 
        fill="url(#radar-gradient)" 
        stroke="var(--secondary)" 
        stroke-width="2" 
        style="filter: drop-shadow(0 0 4px var(--secondary-glow)); transition: all 0.5s ease;" />
    `;

    // Draw vertex points
    points.forEach(p => {
      svgContent += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--secondary)" stroke="#fff" stroke-width="1.5" />`;
    });

    // Draw labels
    svgContent += labels.join('');

    svgContent += '</svg>';

    this.skillsChartContainer.innerHTML = svgContent;
  }
}
export default DashboardComponent;
