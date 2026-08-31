/* ==========================================
   AETHERPATH REACTIVE STATE STORE
   ========================================== */

const STORAGE_KEY = 'aetherpath_app_state';

const defaultState = {
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  userSession: null,
  currentTab: 'dashboard',
  profile: {
    name: 'Pathfinder Learner',
    level: 'Beginner',
    commitment: '5-10',
    style: 'practical',
    interests: ['Web Development', 'JavaScript', 'React', 'UI/UX', 'Portfolio Building'],
    history: ''
  },
  activeTrackId: null,
  roadmap: null, // Holds the current active path layout, nodes, and progress
  skillGap: null, // Stores { target: [], acquired: [], missing: [] }
  chatHistory: [
    {
      sender: 'bot',
      text: "Hello! I'm **Aetheria**, your personal learning path assistant. I'm here to help you sequence and target your learning objectives.\n\nWhat skills or career goals are you focusing on today? For example, you can tell me: \n* *\"I want to learn frontend development starting from scratch\"*\n* *\"I want to transition into Data Science and build Python projects.\"*",
      timestamp: new Date().toISOString()
    }
  ],
  settings: {
    engine: 'mock',
    groqKey: ''
  },
  theme: 'dark'
};

class StateStore {
  constructor() {
    this.state = this.loadFromStorage();
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure structure compatibility
        return { 
          ...defaultState, 
          ...parsed, 
          settings: { ...defaultState.settings, ...parsed.settings }, 
          profile: { ...defaultState.profile, ...parsed.profile } 
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(defaultState)); // Deep copy
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  // Pub/Sub pattern for reactive updates
  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(listener => listener(this.state));
  }

  // Auth Actions
  login(email, name = 'Pathfinder') {
    this.state.isLoggedIn = true;
    this.state.userSession = { email, name };
    this.state.profile.name = name;
    this.notify();
  }

  logout() {
    this.state.isLoggedIn = false;
    this.state.hasCompletedOnboarding = false;
    this.state.userSession = null;
    this.state.activeTrackId = null;
    this.state.roadmap = null;
    this.state.skillGap = null;
    this.clearChatHistory();
    this.notify();
  }

  completeOnboarding(profileData, trackId, roadmapData) {
    this.state.hasCompletedOnboarding = true;
    this.state.profile = { ...this.state.profile, ...profileData };
    this.state.activeTrackId = trackId;
    this.state.roadmap = roadmapData;
    
    this.recalculateRoadmapNodeStatuses();
    this.calculateSkillGap();
    this.notify();
  }

  // State Actions
  setTab(tab) {
    this.state.currentTab = tab;
    this.notify();
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.notify();
  }

  updateProfile(profileData) {
    this.state.profile = { ...this.state.profile, ...profileData };
    this.calculateSkillGap();
    this.notify();
  }

  setEngine(engine) {
    this.state.settings.engine = engine;
    this.notify();
  }

  setGroqKey(key) {
    this.state.settings.groqKey = key;
    this.notify();
  }

  addChatMessage(sender, text) {
    this.state.chatHistory.push({
      sender,
      text,
      timestamp: new Date().toISOString()
    });
    this.notify();
  }

  clearChatHistory() {
    this.state.chatHistory = [
      {
        sender: 'bot',
        text: "Hello! I'm **Aetheria**, your personal learning path assistant. I'm here to help you sequence and target your learning objectives.\n\nWhat skills or career goals are you focusing on today? For example, you can tell me: \n* *\"I want to learn frontend development starting from scratch\"*\n* *\"I want to transition into Data Science and build Python projects.\"*",
        timestamp: new Date().toISOString()
      }
    ];
    this.notify();
  }

  // Set the current learning path roadmap
  setRoadmap(trackId, roadmapData) {
    this.state.activeTrackId = trackId;
    this.state.roadmap = roadmapData;
    this.recalculateRoadmapNodeStatuses();
    this.calculateSkillGap();
    this.notify();
  }

  // Toggle node completion status
  toggleNodeStatus(nodeId) {
    if (!this.state.roadmap) return;

    let targetNode = null;
    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        if (node.id === nodeId) {
          targetNode = node;
        }
      });
    });

    if (!targetNode || targetNode.status === 'locked') return;

    if (targetNode.status === 'completed') {
      targetNode.status = 'unlocked';
    } else {
      targetNode.status = 'completed';
    }

    this.recalculateRoadmapNodeStatuses();
    this.calculateSkillGap();
    this.notify();
  }

  // Skip node status
  toggleNodeSkip(nodeId) {
    if (!this.state.roadmap) return;

    let targetNode = null;
    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        if (node.id === nodeId) {
          targetNode = node;
        }
      });
    });

    if (!targetNode || targetNode.status === 'locked') return;

    if (targetNode.status === 'skipped') {
      targetNode.status = 'unlocked';
    } else {
      targetNode.status = 'skipped';
    }

    this.recalculateRoadmapNodeStatuses();
    this.calculateSkillGap();
    this.notify();
  }

  // Process prerequisites recursively to set locks
  recalculateRoadmapNodeStatuses() {
    if (!this.state.roadmap) return;

    // Track completed node IDs
    const completedNodeIds = new Set();
    const skippedNodeIds = new Set();

    // Pass 1: Gather completed and skipped node IDs
    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        if (node.status === 'completed') {
          completedNodeIds.add(node.id);
        } else if (node.status === 'skipped') {
          skippedNodeIds.add(node.id);
        }
      });
    });

    // Pass 2: Evaluate locking and unlocking status
    // Prerequisite nodes must be marked completed or skipped to unlock downstream nodes.
    let changed = false;
    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        // If a node has no prerequisites, its status remains unlocked (unless already completed or skipped)
        if (!node.prerequisites || node.prerequisites.length === 0) {
          if (node.status === 'locked') {
            node.status = 'unlocked';
            changed = true;
          }
        } else {
          // Check if all prerequisites are completed or skipped
          const allPrereqsMet = node.prerequisites.every(prereqId => 
            completedNodeIds.has(prereqId) || skippedNodeIds.has(prereqId)
          );

          if (allPrereqsMet) {
            if (node.status === 'locked') {
              node.status = 'unlocked';
              changed = true;
            }
          } else {
            // Lock nodes whose prerequisites are not met
            if (node.status !== 'locked') {
              node.status = 'locked';
              changed = true;
            }
          }
        }
      });
    });

    // If something updated, recurse to handle nested dependencies
    if (changed) {
      this.recalculateRoadmapNodeStatuses();
    }
  }

  // Dynamic Skill Gap Analyzer
  calculateSkillGap() {
    if (!this.state.roadmap) {
      this.state.skillGap = null;
      return;
    }

    const allNodes = [];
    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        allNodes.push(node);
      });
    });

    // 1. Target Skills: Collect all skills taught in this track
    const targetSet = new Set();
    allNodes.forEach(node => {
      if (node.skills) {
        node.skills.forEach(s => targetSet.add(s));
      }
    });

    // 2. Acquired Skills: Collect skills from completed nodes, profile interests, or profile history
    const acquiredSet = new Set();
    
    // Skills from completed or skipped nodes
    allNodes.forEach(node => {
      if ((node.status === 'completed' || node.status === 'skipped') && node.skills) {
        node.skills.forEach(s => acquiredSet.add(s));
      }
    });

    // Check user profile history (text block search)
    const historyText = (this.state.profile.history || '').toLowerCase();
    targetSet.forEach(skill => {
      if (historyText.includes(skill.toLowerCase())) {
        acquiredSet.add(skill);
      }
    });

    // 3. Missing Skills: Target skills not yet acquired
    const missingSet = new Set();
    targetSet.forEach(skill => {
      if (!acquiredSet.has(skill)) {
        missingSet.add(skill);
      }
    });

    this.state.skillGap = {
      target: Array.from(targetSet),
      acquired: Array.from(acquiredSet),
      missing: Array.from(missingSet)
    };
  }

  // Adjust roadmap properties based on customization configurations
  reconfigureRoadmap(pace, focus, level) {
    if (!this.state.roadmap) return;

    this.state.roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        // Adapt duration based on pace
        if (pace === 'accelerated') {
          // e.g. Reduce hours by 30% representing accelerated learning path
          if (node.originalDuration === undefined) {
            node.originalDuration = node.duration;
          }
          const hours = parseInt(node.originalDuration);
          if (!isNaN(hours)) {
            node.duration = `${Math.ceil(hours * 0.7)} hrs`;
          }
        } else {
          if (node.originalDuration !== undefined) {
            node.duration = node.originalDuration;
          }
        }

        // Adapt difficulty filter or show core only
        if (level === 'core') {
          if (node.type === 'assessment') {
            // Hide or skip assessments
          }
        }
      });
    });

    this.calculateSkillGap();
    this.notify();
  }

  resetAllState() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveToStorage();
    this.notify();
  }
}

export const store = new StateStore();
