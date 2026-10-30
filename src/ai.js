/* ==========================================
   AETHERPATH INTELLIGENCE ENGINE (GROQ CLOUD API & OFFLINE SIMULATOR)
   ========================================== */

import { TRACKS } from './data.js';

export class AIEngine {
  constructor(settings = {}) {
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
    this.engine = settings.engine || 'groq';
    this.groqKey = settings.groqKey || envKey;
    this.model = settings.groqModel || 'llama-3.3-70b-versatile';
  }

  updateSettings(engine, groqKey, model) {
    if (engine) this.engine = engine;
    if (groqKey !== undefined) this.groqKey = groqKey;
    if (model) this.model = model;
  }

  getActiveKey() {
    if (this.groqKey && this.groqKey.trim()) {
      return this.groqKey.trim();
    }
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
    return envKey.trim();
  }

  // Primary method to process incoming user messages
  async processMessage(userMessage, profile, history = [], currentRoadmap = null) {
    const key = this.getActiveKey();

    if (this.engine === 'groq') {
      if (!key) {
        return {
          type: 'CHAT',
          explanation: `### ⚡ Groq Cloud API Setup Required

Hello **${profile.name || 'Learner'}**! The AI Coach is configured to answer using **Groq Cloud API** (` + this.model + `), but no API key was detected.

To enable live Groq-powered answers:
1. Paste your **Groq API key** in the setup bar at the top of this chat or in the **Settings** tab.
2. If you don't have one yet, you can get a free, instant Groq API key at **[console.groq.com/keys](https://console.groq.com/keys)**.

*(Tip: You can also toggle the offline **Local Simulator** in Settings if you'd like to test without an API key).*`
        };
      }
      return await this.callGroqAPI(userMessage, profile, history, currentRoadmap);
    } else {
      return await this.simulateAI(userMessage, profile);
    }
  }

  // 1. LIVE GROQ CLOUD API CLIENT
  async callGroqAPI(userMessage, profile, history = [], currentRoadmap = null) {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const activeKey = this.getActiveKey();
    const modelToUse = this.model || 'llama-3.3-70b-versatile';

    // Construct active roadmap summary if available
    let roadmapSummary = 'No active roadmap selected yet.';
    if (currentRoadmap && currentRoadmap.phases) {
      const totalNodes = currentRoadmap.phases.reduce((sum, p) => sum + (p.nodes?.length || 0), 0);
      const completedNodes = currentRoadmap.phases.reduce(
        (sum, p) => sum + (p.nodes?.filter(n => n.status === 'completed')?.length || 0), 
        0
      );
      const phaseNames = currentRoadmap.phases.map(p => p.name).join(', ');
      roadmapSummary = `Active Track: "${currentRoadmap.name}" (${completedNodes}/${totalNodes} nodes completed). Phases: ${phaseNames}`;
    }

    const systemPrompt = `You are "Aetheria", an elite, world-class AI Learning Coach and Curriculum Architect within the AetherPath learning platform.
You analyze learners' goals, diagnose skill gaps, provide rich educational guidance, answer technical and career questions, and generate or adapt tailored learning roadmaps.

Learner Profile:
- Name: ${profile.name || 'Learner'}
- Experience Level: ${profile.level || 'Beginner'}
- Weekly Commitment: ${profile.commitment || '5-10'} hours/week
- Learning Style: ${profile.style || 'practical'} (practical = hands-on projects, balanced = mix, theoretical = deep documentation)
- Target Career Goals & Interests: ${(profile.interests || []).join(', ') || 'Web & Software Engineering'}
- Existing Knowledge & Completed Courses: ${profile.history || 'None declared'}
- Current Roadmap Status: ${roadmapSummary}

You MUST output a valid JSON object matching ONE of these 3 schemas:

Case 1: ROADMAP CREATION OR FULL ROADMAP RE-STRUCTURING
When the user wants to generate, recommend, or structure a complete new learning path or roadmap (e.g. "Create a fullstack path", "Teach me Rust from scratch", "I want an AI engineer roadmap"):
{
  "type": "PATH_GENERATION",
  "trackId": "custom_path_slug",
  "roadmap": {
    "name": "Comprehensive Title of the Path",
    "description": "High-level vision, career outcomes, and competencies of this roadmap",
    "estimatedHours": 120,
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "phases": [
      {
        "id": "phase-1",
        "name": "Phase 1: Foundations",
        "nodes": [
          {
            "id": "node-1-1",
            "name": "Milestone / Course Title",
            "type": "course", // must be "course", "project", or "assessment"
            "duration": "10 hrs",
            "difficulty": "Beginner", // "Beginner", "Intermediate", or "Advanced"
            "cost": "Free",
            "description": "Concise summary of learning goals and deliverables",
            "skills": ["Skill Name"],
            "prerequisites": [], // list of previous node IDs that must be completed first
            "resources": [
              { "title": "Resource Name (e.g. MDN, freeCodeCamp, official docs)", "url": "https://example.com" }
            ]
          }
        ]
      }
    ]
  },
  "explanation": "A friendly, comprehensive markdown explanation explaining why this path fits their experience (${profile.level}) and commitment (${profile.commitment} hrs/week). Include a clear Skill Gap Diagnostics section highlighting target vs missing competencies."
}

Case 2: LEARNER PROFILE OR CONFIG ADAPTATION
When the user asks to modify their experience level, pace, or learning style (e.g. "make it harder", "I am advanced", "change pace to accelerated", "focus on projects"):
{
  "type": "ADAPT_PROFILE", // use "ADAPT_CONFIG" if modifying pace/focus
  "profileUpdate": { "level": "Advanced" }, // optional profile fields
  "configUpdate": { "pace": "accelerated" }, // optional config fields
  "explanation": "Clear markdown confirmation detailing what settings changed and how their roadmap updates."
}

Case 3: GENERAL AI COACHING, ADVICE, CODE EXPLANATION, OR TOPIC QUESTIONS (DEFAULT)
When the user asks questions, seeks coding help, asks about specific technologies, frameworks, career decisions, or requests concept explanations:
{
  "type": "CHAT",
  "explanation": "Your thorough, insightful, and motivating answer in markdown format. Use code snippets, bullet points, and formatting where helpful."
}

RULES:
1. Always output ONLY a valid JSON object. Do not wrap in conversational prefixes or suffixes.
2. In all explanations, speak warmly, encouragingly, and expertly as Aetheria.
3. For resources, recommend real, reputable learning links (MDN Web Docs, freeCodeCamp, Coursera, Kaggle, official documentation, GitHub).
4. For roadmaps, ensure logical prerequisite chaining. Nodes in Phase 1 should have empty prerequisites. Subsequent nodes must reference prior node IDs.`;

    // Construct conversation messages with history
    const messages = [{ role: 'system', content: systemPrompt }];

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-8);
      for (const msg of recentHistory) {
        if (msg.sender === 'user' && msg.text) {
          messages.push({ role: 'user', content: msg.text });
        } else if (msg.sender === 'bot' && msg.text) {
          messages.push({ role: 'assistant', content: msg.text });
        }
      }
    }

    messages.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: modelToUse,
          response_format: { type: 'json_object' },
          messages: messages,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const errMsg = errorJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }

      const json = await response.json();
      const rawText = json.choices?.[0]?.message?.content || '';

      let parsed = null;
      try {
        parsed = JSON.parse(rawText.trim());
      } catch (parseErr) {
        // Strip markdown code fences if present (```json ... ```)
        const stripped = rawText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        try {
          parsed = JSON.parse(stripped);
        } catch (innerErr) {
          parsed = {
            type: 'CHAT',
            explanation: rawText
          };
        }
      }

      // Ensure proper structure and default node statuses for roadmaps
      if (parsed.type === 'PATH_GENERATION' && parsed.roadmap) {
        if (!parsed.trackId) {
          parsed.trackId = 'custom-' + Date.now();
        }
        if (Array.isArray(parsed.roadmap.phases)) {
          parsed.roadmap.phases.forEach((phase, pIdx) => {
            if (!phase.id) phase.id = `phase-${pIdx + 1}`;
            if (Array.isArray(phase.nodes)) {
              phase.nodes.forEach((node, nIdx) => {
                if (!node.id) node.id = `node-${pIdx + 1}-${nIdx + 1}`;
                node.status = (!node.prerequisites || node.prerequisites.length === 0) ? 'unlocked' : 'locked';
              });
            }
          });
        }
      }

      if (!parsed.explanation) {
        parsed.explanation = "I have processed your request. Let me know if you would like to explore or adapt your roadmap further!";
      }

      return parsed;

    } catch (e) {
      console.error('Groq API Error:', e);
      return {
        type: 'CHAT',
        explanation: `### ⚠️ Groq API Request Notice

I encountered an issue communicating with the **Groq API**:
> **${e.message}**

**Suggested fixes:**
* Verify that your Groq API key is valid and active at [console.groq.com/keys](https://console.groq.com/keys).
* Check your internet connection or Groq rate limits.
* You can update your API key in the chat banner above or in **Settings**.
* Alternatively, switch to the **Local Simulator** in Settings to continue exploring offline.`
      };
    }
  }

  // 2. MOCK AI SIMULATOR (Fallback / Offline Mode)
  async simulateAI(userMessage, profile) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const message = userMessage.toLowerCase();
    
    // Check for path generation requests
    let matchedTrackId = null;
    
    if (message.includes('front') || message.includes('web') || message.includes('html') || message.includes('react') || message.includes('css')) {
      matchedTrackId = 'frontend';
    } else if (message.includes('data') || message.includes('pandas') || message.includes('sql') || message.includes('analysis') || message.includes('statistic')) {
      matchedTrackId = 'datascience';
    } else if (message.includes('ai') || message.includes('machine') || message.includes('model') || message.includes('nlp') || message.includes('deep learning') || message.includes('tensorflow') || message.includes('pytorch')) {
      matchedTrackId = 'aiml';
    } else if (message.includes('back') || message.includes('node') || message.includes('express') || message.includes('server') || message.includes('docker') || message.includes('api')) {
      matchedTrackId = 'backend';
    }

    if (matchedTrackId) {
      const originalTrack = TRACKS[matchedTrackId];
      const trackCopy = JSON.parse(JSON.stringify(originalTrack));
      this.customizeRoadmapMock(trackCopy, profile);
      const explanation = this.generateTrackExplanation(trackCopy, profile);
      
      return {
        type: 'PATH_GENERATION',
        trackId: matchedTrackId,
        roadmap: trackCopy,
        explanation: explanation
      };
    }

    if (message.includes('easier') || message.includes('beginner') || message.includes('simple')) {
      return {
        type: 'ADAPT_PROFILE',
        profileUpdate: { level: 'Beginner' },
        explanation: "Understood! I have updated your experience level to **Beginner**. I am tailoring the roadmap to focus on core concepts, adding foundational tutorials, and reducing complexity in early milestones."
      };
    }

    if (message.includes('harder') || message.includes('advanced') || message.includes('expert')) {
      return {
        type: 'ADAPT_PROFILE',
        profileUpdate: { level: 'Advanced' },
        explanation: "Excellent! I have bumped your profile to **Advanced**. I will adjust your timeline, skip introductory materials, and emphasize complex engineering topics, profiling, and production deployment."
      };
    }

    if (message.includes('project') || message.includes('hands-on') || message.includes('practical') || message.includes('build')) {
      return {
        type: 'ADAPT_PROFILE',
        profileUpdate: { style: 'practical' },
        explanation: "Roger that! I have adjusted your learning style preference to **Project-focused (Practical)**. Your milestones will highlight building repositories and hands-on coding reviews."
      };
    }

    if (message.includes('fast') || message.includes('accelerate') || message.includes('hurry') || message.includes('quick')) {
      return {
        type: 'ADAPT_CONFIG',
        configUpdate: { pace: 'accelerated' },
        explanation: "Got it! Toggling your pace setting to **Fast Track**. This reduces expected learning hours by about 30%, optimizing for intense modules and direct coding challenges."
      };
    }

    if (message.includes('react')) {
      return {
        type: 'CHAT',
        explanation: "**React** is a popular component-based JavaScript library for building user interfaces. In our Frontend path, it is situated in **Phase 3** as it builds on core JS (async operations and DOM rendering) which you master in Phase 2. Is there a specific React concept you'd like to ask about?"
      };
    }

    if (message.includes('sql') || message.includes('database')) {
      return {
        type: 'CHAT',
        explanation: "**SQL (Structured Query Language)** is standard for relational database management. In our Data Science & Backend tracks, SQL is a foundational layer because modeling datasets and handling transactional tables is required before running analytics or serving web content."
      };
    }

    if (message.includes('pytorch') || message.includes('tensorflow')) {
      return {
        type: 'CHAT',
        explanation: "**TensorFlow** and **PyTorch** are open-source Python libraries for deep learning. PyTorch is favored for its dynamic graphing and research agility, while TensorFlow is widely used in enterprise production pipelines."
      };
    }

    return {
      type: 'CHAT',
      explanation: `I'd love to help you build or customize a learning path! *(Simulator Mode)*

Tell me which domain you are pursuing:
* **Frontend Web Dev**: HTML, CSS, JavaScript, React, and build tools.
* **Backend Web Dev**: Server architecture, Node/Express, databases, and Docker.
* **Data Science**: Exploratory data analysis, SQL, statistics, and visualization.
* **AI & Machine Learning**: Classification models, deep learning, NLP, and PyTorch.

*💡 Tip: Connect a Groq API key in Settings or the chat header to ask any custom question and receive live AI answers with Llama 3.3 70B!*`
    };
  }

  customizeRoadmapMock(roadmap, profile) {
    if (profile.level === 'Advanced') {
      roadmap.phases.forEach((phase, phaseIdx) => {
        if (phaseIdx === 0) {
          phase.nodes.forEach(node => {
            if (node.type !== 'assessment') {
              node.status = 'skipped';
              node.description = `[Skipped - Verified Advanced Background] ${node.description}`;
            }
          });
        }
      });
    }
    
    roadmap.phases.forEach(phase => {
      phase.nodes.forEach(node => {
        if (node.status === 'skipped') return;
        if (!node.prerequisites || node.prerequisites.length === 0) {
          node.status = 'unlocked';
        } else {
          node.status = 'locked';
        }
      });
    });
  }

  generateTrackExplanation(track, profile) {
    const totalNodes = track.phases.reduce((sum, p) => sum + p.nodes.length, 0);
    const totalProjects = track.phases.reduce((sum, p) => sum + p.nodes.filter(n => n.type === 'project').length, 0);
    
    return `### Personalized Learning Path: **${track.name}**
    
I have structured a customized learning roadmap consisting of **${track.phases.length} Phases**, containing **${totalNodes} total nodes** (including **${totalProjects} hands-on projects**).

**Personalized Insights for ${profile.name}:**
1. **Experience Alignment (${profile.level})**: 
   ${profile.level === 'Beginner' 
     ? 'Starting as a beginner, foundational modules and syntax are emphasized before introducing advanced frameworks.' 
     : profile.level === 'Intermediate' 
     ? 'As an intermediate learner, we quickly review essentials and dive into frameworks and architecture.'
     : 'As an advanced specialist, introductory modules are skipped, directing you straight into high-performance engineering.'}
2. **Weekly Commitment (${profile.commitment} hrs/week)**: 
   At this pace, this **${track.estimatedHours} hour** roadmap will take roughly **${Math.ceil(track.estimatedHours / parseFloat(profile.commitment.split('-')[0] || 5))} weeks** of consistent study.
3. **Prerequisite Sequencing**: 
   Nodes remain locked until preceding foundations are completed or marked as skipped.

*View your interactive visual roadmap in the **Roadmap** tab!*`;
  }

  // Simple key validation routine
  static async validateKey(key, model = 'llama-3.3-70b-versatile') {
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    if (!key || !key.trim()) return false;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key.trim()}`
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

export const aiEngine = new AIEngine();
export default aiEngine;
