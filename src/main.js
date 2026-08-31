/* ==========================================
   AETHERPATH MAIN APPLICATION ENTRY
   ========================================== */

import { store } from './state.js';
import { aiEngine } from './ai.js';
import { TRACKS } from './data.js';
import { DashboardComponent } from './components/dashboard.js';
import { ChatComponent } from './components/chat.js';
import { RoadmapComponent } from './components/roadmap.js';
import { ProfileComponent } from './components/profile.js';
import { SettingsComponent } from './components/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Google Sign-In helper functions
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  };

  let lastGoogleClientId = '';

  const initGoogleSignIn = (clientId, theme) => {
    const container = document.getElementById('google-btn-container');
    const mockGoogleBtn = document.getElementById('auth-google-btn');
    if (!container || !mockGoogleBtn) return;

    if (clientId && window.google) {
      mockGoogleBtn.classList.add('hidden');
      container.classList.remove('hidden');

      if (clientId !== lastGoogleClientId) {
        lastGoogleClientId = clientId;
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              const payload = decodeJwt(response.credential);
              if (payload) {
                store.login(payload.email, payload.name, payload.picture);
                const authOverlay = document.getElementById('auth-overlay');
                if (authOverlay) authOverlay.classList.remove('active');
              }
            }
          });
        } catch (e) {
          console.error('Failed to initialize Google accounts client ID', e);
        }
      }

      // Re-render button with proper theme/dimensions
      container.innerHTML = '';
      try {
        window.google.accounts.id.renderButton(
          container,
          {
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            width: mockGoogleBtn.offsetWidth || 300,
            text: 'signup_with'
          }
        );
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error('Failed to render Google button', err);
      }
    } else {
      mockGoogleBtn.classList.remove('hidden');
      container.classList.add('hidden');
    }
  };

  const checkGoogleLoaded = () => {
    const state = store.loadFromStorage();
    if (state.settings.googleClientId) {
      if (window.google) {
        initGoogleSignIn(state.settings.googleClientId, state.theme);
      } else {
        setTimeout(checkGoogleLoaded, 500);
      }
    }
  };

  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Initialize Components
  const dashboard = new DashboardComponent();
  const chat = new ChatComponent();
  const roadmap = new RoadmapComponent();
  const profile = new ProfileComponent();
  const settings = new SettingsComponent();

  // Force logout on page load to ensure entering the link always prompts signup/signin
  store.logout();

  // 3. Sync AI Engine with stored configurations
  const initialState = store.loadFromStorage();
  aiEngine.updateSettings(initialState.settings.engine, initialState.settings.groqKey);

  // Set initial tab from URL path if logged in
  const getTabFromPath = () => {
    const path = window.location.pathname.replace(/^\/+/g, '');
    const validTabs = ['dashboard', 'chat', 'roadmap', 'profile', 'settings'];
    return validTabs.includes(path) ? path : 'dashboard';
  };

  const initialTab = getTabFromPath();
  if (initialTab && initialState.isLoggedIn && initialState.hasCompletedOnboarding) {
    store.state.currentTab = initialTab;
  }

  // 4. Onboarding wizard step counter
  let onboardingStep = 1;

  // 5. Subscribe to state updates (UI Reactive bindings)
  store.subscribe((state) => {
    // A. View Router (Landing vs Onboarding vs Workspace)
    const landingView = document.getElementById('landing-view');
    const onboardingOverlay = document.getElementById('onboarding-overlay');
    const workspaceView = document.getElementById('workspace-view');

    if (!state.isLoggedIn) {
      landingView.classList.remove('hidden');
      onboardingOverlay.classList.add('hidden');
      workspaceView.classList.add('hidden');
    } else if (state.isLoggedIn && !state.hasCompletedOnboarding) {
      landingView.classList.add('hidden');
      onboardingOverlay.classList.remove('hidden');
      workspaceView.classList.add('hidden');
      syncOnboardingStepView();
    } else {
      landingView.classList.add('hidden');
      onboardingOverlay.classList.add('hidden');
      workspaceView.classList.remove('hidden');
    }

    // B. Handle tab panel activation (Workspace sidebar)
    if (state.isLoggedIn && state.hasCompletedOnboarding) {
      const tabs = ['dashboard', 'chat', 'roadmap', 'profile', 'settings'];
      tabs.forEach(tab => {
        const panel = document.getElementById(`${tab}-panel`);
        const btn = document.getElementById(`btn-tab-${tab}`);
        if (panel && btn) {
          if (state.currentTab === tab) {
            panel.classList.add('active');
            btn.classList.add('active');
          } else {
            panel.classList.remove('active');
            btn.classList.remove('active');
          }
        }
      });

      // Update Page Header Titles & Subtitles dynamically
      const titleEl = document.getElementById('page-title');
      const subtitleEl = document.getElementById('page-subtitle');
      if (titleEl && subtitleEl) {
        if (state.currentTab === 'dashboard') {
          titleEl.textContent = 'Dashboard';
          subtitleEl.textContent = 'Track your learning journey and next actions';
        } else if (state.currentTab === 'chat') {
          titleEl.textContent = 'AI Learning Coach';
          subtitleEl.textContent = 'Converse with Aetheria to outline and adapt goals';
        } else if (state.currentTab === 'roadmap') {
          titleEl.textContent = 'Roadmap Explorer';
          subtitleEl.textContent = 'Inspect sequencing, prerequisites, and resource details';
        } else if (state.currentTab === 'profile') {
          titleEl.textContent = 'Learner Profile';
          subtitleEl.textContent = 'Personalize your skill targets and commitment settings';
        } else if (state.currentTab === 'settings') {
          titleEl.textContent = 'System Settings';
          subtitleEl.textContent = 'Configure AI models and core application parameters';
        }
      }

      // Update Header Active Path Title Tag
      const headerPathVal = document.getElementById('header-active-path');
      if (headerPathVal) {
        headerPathVal.textContent = state.roadmap ? state.roadmap.name : 'Not Started';
      }

      // Update Sidebar User Profile info card
      const badgeName = document.getElementById('badge-user-name');
      const badgeLevel = document.getElementById('badge-user-level');
      const avatarBadge = document.getElementById('sidebar-avatar');
      
      if (badgeName) badgeName.textContent = state.profile.name;
      if (badgeLevel) badgeLevel.textContent = state.profile.level;
      if (avatarBadge && state.profile.name) {
        if (state.userSession && state.userSession.avatarUrl) {
          avatarBadge.innerHTML = `<img src="${state.userSession.avatarUrl}" alt="${state.profile.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
          const initials = state.profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          avatarBadge.textContent = initials || 'AP';
        }
      }
    }

    // C. Apply active theme (dark / light)
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeToggleBtn = document.getElementById('header-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = `<i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
      lucide.createIcons();
    }

    // Trigger individual component renders
    dashboard.render(state);
    chat.render(state);
    roadmap.render(state);
    profile.render(state);
    settings.render(state);

    // Dynamic Google Sign-In setup
    initGoogleSignIn(state.settings.googleClientId, state.theme);

    // E. Update browser URL path based on current state
    let targetPath = '/';
    if (state.isLoggedIn) {
      if (!state.hasCompletedOnboarding) {
        targetPath = '/onboarding';
      } else {
        targetPath = '/' + state.currentTab;
      }
    }
    if (window.location.pathname !== targetPath) {
      history.pushState(null, '', targetPath);
    }
  });

  // 6. Landing & Authentication Click Handlers
  const landingGetStarted = document.getElementById('landing-btn-get-started');
  const landingLogin = document.getElementById('landing-btn-login');
  const authOverlay = document.getElementById('auth-overlay');
  const authClose = document.getElementById('auth-close-btn');
  const authTabLogin = document.getElementById('auth-tab-btn-login');
  const authTabSignup = document.getElementById('auth-tab-btn-signup');
  const authForm = document.getElementById('auth-form');
  const signupConfirmGroup = document.getElementById('signup-confirm-group');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authGoogleBtn = document.getElementById('auth-google-btn');

  let authMode = 'login'; // 'login' | 'signup'

  const openAuth = (mode) => {
    authMode = mode;
    if (authOverlay) authOverlay.classList.add('active');
    if (mode === 'signup') {
      if (authTabSignup) authTabSignup.classList.add('active');
      if (authTabLogin) authTabLogin.classList.remove('active');
      if (signupConfirmGroup) signupConfirmGroup.classList.remove('hidden');
      if (authSubmitBtn) authSubmitBtn.textContent = 'Create Account';
    } else {
      if (authTabLogin) authTabLogin.classList.add('active');
      if (authTabSignup) authTabSignup.classList.remove('active');
      if (signupConfirmGroup) signupConfirmGroup.classList.add('hidden');
      if (authSubmitBtn) authSubmitBtn.textContent = 'Login';
    }
  };

  if (landingGetStarted) landingGetStarted.addEventListener('click', () => openAuth('signup'));
  if (landingLogin) landingLogin.addEventListener('click', () => openAuth('login'));
  
  const landingLoginNav = document.getElementById('landing-btn-login-nav');
  if (landingLoginNav) {
    landingLoginNav.addEventListener('click', () => openAuth('login'));
  }
  
  if (authClose) {
    authClose.addEventListener('click', () => {
      if (authOverlay) authOverlay.classList.remove('active');
    });
  }
  
  if (authTabLogin) authTabLogin.addEventListener('click', () => openAuth('login'));
  if (authTabSignup) authTabSignup.addEventListener('click', () => openAuth('signup'));

  // Open Sign Up modal automatically on initial load if not logged in
  if (!initialState.isLoggedIn) {
    openAuth('signup');
  }

  // Auth Submit logic
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;

      if (authMode === 'signup') {
        const confirmPass = document.getElementById('auth-confirm-password').value;
        if (password !== confirmPass) {
          alert('Passwords do not match.');
          return;
        }
        store.login(email, email.split('@')[0]);
      } else {
        store.login(email, email.split('@')[0]);
      }
      
      if (authOverlay) authOverlay.classList.remove('active');
      authForm.reset();
    });
  }

  // Google OAuth Simulation
  if (authGoogleBtn) {
    authGoogleBtn.addEventListener('click', () => {
      store.login('google.user@domain.com', 'Google Explorer');
      if (authOverlay) authOverlay.classList.remove('active');
    });
  }

  // 7. Onboarding wizard steps logic
  const onboardingNextBtn = document.getElementById('onboarding-next-btn');
  const onboardingPrevBtn = document.getElementById('onboarding-prev-btn');

  const syncOnboardingStepView = () => {
    // Hide all panes
    document.querySelectorAll('.onboarding-step-pane').forEach(pane => pane.classList.remove('active'));
    // Show current pane
    const activePane = document.querySelector(`.onboarding-step-pane[data-step="${onboardingStep}"]`);
    if (activePane) activePane.classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
      const step = parseInt(indicator.getAttribute('data-step'));
      indicator.className = 'step-indicator';
      if (step === onboardingStep) {
        indicator.classList.add('active');
      } else if (step < onboardingStep) {
        indicator.classList.add('completed');
      }
    });

    // Update step line backgrounds
    document.querySelectorAll('.step-line').forEach((line, idx) => {
      if (idx < onboardingStep - 1) {
        line.classList.add('completed');
      } else {
        line.classList.remove('completed');
      }
    });

    // Toggle Back button visibility
    if (onboardingStep === 1) {
      onboardingPrevBtn.classList.add('hidden');
    } else {
      onboardingPrevBtn.classList.remove('hidden');
    }

    // Toggle Next button label
    if (onboardingStep === 3) {
      onboardingNextBtn.innerHTML = `Build My Path <i data-lucide="sparkles"></i>`;
    } else {
      onboardingNextBtn.innerHTML = `Next <i data-lucide="arrow-right"></i>`;
    }
    lucide.createIcons();
  };

  onboardingNextBtn.addEventListener('click', () => {
    if (onboardingStep < 3) {
      onboardingStep++;
      syncOnboardingStepView();
    } else {
      // Step 3 build trigger
      handleOnboardingSubmit();
    }
  });

  onboardingPrevBtn.addEventListener('click', () => {
    if (onboardingStep > 1) {
      onboardingStep--;
      syncOnboardingStepView();
    }
  });

  const handleOnboardingSubmit = () => {
    const profileData = {
      name: store.loadFromStorage().profile.name || 'Pathfinder Learner',
      level: document.getElementById('onboarding-level').value,
      commitment: document.getElementById('onboarding-commitment').value,
      style: document.getElementById('onboarding-style').value,
      interests: document.getElementById('onboarding-interests').value.split(',').map(s => s.trim()).filter(s => s),
      history: document.getElementById('onboarding-history').value.trim()
    };

    const trackId = document.getElementById('onboarding-track').value;
    const baseTrack = TRACKS[trackId];
    
    // Copy and customize track layout
    const trackCopy = JSON.parse(JSON.stringify(baseTrack));
    
    // Skill scaling based on Advanced experience level
    if (profileData.level === 'Advanced') {
      trackCopy.phases[0].nodes.forEach(node => {
        if (node.type !== 'assessment') {
          node.status = 'skipped';
        }
      });
    }

    // Initialize statuses
    trackCopy.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        if (node.status !== 'skipped') {
          node.status = (!node.prerequisites || node.prerequisites.length === 0) ? 'unlocked' : 'locked';
        }
      });
    });

    // Complete onboarding state
    store.completeOnboarding(profileData, trackId, trackCopy);
    
    // Dynamic Skill Gap Welcomer Message
    const skillGap = store.loadFromStorage().skillGap;
    const missingText = skillGap && skillGap.missing.length > 0 
      ? `Based on your goal, I identified the following outstanding **skill gaps** we need to target: \n* **${skillGap.missing.join('**\n* **')}**`
      : `Outstanding! You already possess the baseline capabilities required. We will focus on advanced validations.`;

    store.addChatMessage('bot', `### Onboarding Complete! Welcome to your visual learning path.
    
Hi **${profileData.name}**, I have mapped a personalized **${trackCopy.name}** path tailored to your profile:
* **Experience Tier**: ${profileData.level}
* **Learning Preference**: Project-focused (${profileData.style})
* **Pace Intensity**: ${profileData.commitment} hours/week

#### Skill Gap Analysis
${missingText}

I have loaded your visual milestones and sequenced prerequisites in the **Roadmap** view. Let me know if you would like me to adjust elements or add specific details!`);

    // Reset onboarding step counter
    onboardingStep = 1;
    store.setTab('dashboard');
  };

  // 8. Navigation Menu click bindings
  document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      store.setTab(tab);
    });
  });

  // Logout click binding
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }

  // 9. Header Theme Toggle click binding
  const themeToggleBtn = document.getElementById('header-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      store.toggleTheme();
    });
  }

  // 10. Initial render trigger
  store.notify();

  // Listen for browser back/forward navigation
  window.addEventListener('popstate', () => {
    const tab = getTabFromPath();
    const state = store.loadFromStorage();
    if (state.isLoggedIn && state.hasCompletedOnboarding && state.currentTab !== tab) {
      store.setTab(tab);
    }
  });

  // Check and run Google Sign-In if library loads late
  checkGoogleLoaded();
});
