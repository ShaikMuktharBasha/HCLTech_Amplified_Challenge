/* ==========================================
   AETHERPATH INTELLIGENCE ENGINE (MOCK & GEMINI)
   ========================================== */

import { TRACKS } from './data.js';

export class AIEngine {
  constructor(settings = { engine: 'mock', groqKey: '' }) {
    this.engine = settings.engine || 'mock';
    this.groqKey = settings.groqKey || '';
  }

  updateSettings(engine, groqKey) {
    this.engine = engine;
    this.groqKey = groqKey;
  }

  // Primary method to process incoming user messages
  async processMessage(userMessage, profile) {
    if (this.engine === 'groq' && this.groqKey) {
      return await this.callGroqAPI(userMessage, profile);
    } else {
      return await this.simulateAI(userMessage, profile);
    }
  }

  // 1. MOCK AI SIMULATOR
  async simulateAI(userMessage, profile) {
    // Artificial small delay for typing realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const message = userMessage.toLowerCase();
    
    // Intent 1: Check for path generation requests
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
      // Clone track data
      const trackCopy = JSON.parse(JSON.stringify(originalTrack));
      
      // Customize based on user profile
      this.customizeRoadmapMock(trackCopy, profile);

      const explanation = this.generateTrackExplanation(trackCopy, profile);
      
      return {
        type: 'PATH_GENERATION',
        trackId: matchedTrackId,
        roadmap: trackCopy,
        explanation: explanation
      };
    }

    // Intent 2: Adapt path details (make it easier, harder, hands-on, fast-track)
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
        explanation: "Roger that! I have adjusted your learning style preference to **Project-focused (Practical)**. Your milestones will highlight building, repositories, and hands-on coding reviews over reading materials."
      };
    }

    if (message.includes('fast') || message.includes('accelerate') || message.includes('hurry') || message.includes('quick')) {
      return {
        type: 'ADAPT_CONFIG',
        configUpdate: { pace: 'accelerated' },
        explanation: "Got it! Toggling your pace setting to **Fast Track**. This reduces expected learning hours by about 30%, optimizing for intense modules and direct coding challenges. Make sure you dedicate ample time daily!"
      };
    }

    // Intent 3: General inquiries / questions about resources or terms
    if (message.includes('react')) {
      return {
        type: 'CHAT',
        explanation: "**React** is a popular component-based JavaScript library for building user interfaces. In our Frontend path, it is situated in **Phase 3** as it builds on core JS (async operations and DOM rendering) which you master in Phase 2. Is there a specific React concept you'd like to ask about?"
      };
    }

    if (message.includes('sql') || message.includes('database')) {
      return {
        type: 'CHAT',
        explanation: "**SQL (Structured Query Language)** is standard for relational database management. It allows you to select, aggregate, and join data. In our Data Science & Backend tracks, SQL is the foundational layer because modeling datasets and handling transactional tables is required before running analytics or serving web content."
      };
    }

    if (message.includes('pytorch') || message.includes('tensorflow')) {
      return {
        type: 'CHAT',
        explanation: "**TensorFlow** and **PyTorch** are open-source Python libraries for deep learning. They simplify creating artificial neural network layers and performing gradient calculations. PyTorch is heavily favored in academic research for its dynamic graphing, while TensorFlow is widely used in enterprise production pipelines."
      };
    }

    // Intent 4: Fallback conversational response
    return {
      type: 'CHAT',
      explanation: `I'd love to help you build or customize a learning path! 

Could you tell me which career domain you are pursuing? 
* **Frontend Web Dev**: HTML, CSS, JavaScript, React, and build tools.
* **Backend Web Dev**: Server structures, Express, databases, and Docker containerization.
* **Data Science**: Exploratory data analysis, SQL, statistics, and visualization.
* **AI & Machine Learning**: Classification models, deep learning, NLP, and RAG systems.

Simply specify which one you'd like to explore, or mention a skill goal!`
    };
  }

  // Customize roadmap based on profile level
  customizeRoadmapMock(roadmap, profile) {
    // If user is Advanced, mark early nodes as pre-completed or skip them
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
    
    // Set initial nodes to unlocked
    roadmap.phases.forEach((phase, pIdx) => {
      phase.nodes.forEach(node => {
        // If it is already marked skipped, don't change
        if (node.status === 'skipped') return;
        
        // Check prerequisites
        if (!node.prerequisites || node.prerequisites.length === 0) {
          node.status = 'unlocked';
        } else {
          node.status = 'locked';
        }
      });
    });
  }

  // Build a custom natural-language explanation card
  generateTrackExplanation(track, profile) {
    const totalNodes = track.phases.reduce((sum, p) => sum + p.nodes.length, 0);
    const totalProjects = track.phases.reduce((sum, p) => sum + p.nodes.filter(n => n.type === 'project').length, 0);
    
    return `### Personalized Learning Path: **${track.name}**
    
I have structured a customized learning roadmap consisting of **${track.phases.length} Phases**, containing **${totalNodes} total nodes** (including **${totalProjects} hands-on projects**).

**Why I made these recommendations for you:**
1. **Experience Alignment (${profile.level})**: 
   ${profile.level === 'Beginner' 
     ? 'Since you are starting as a beginner, I included extensive foundational modules and tutorials. We start with absolute syntax basics before introducing frameworks.' 
     : profile.level === 'Intermediate' 
     ? 'As an intermediate learner, we quickly brush up on fundamentals in Phase 1 and focus heavily on frameworks and system interfaces in Phase 2.'
     : 'As an advanced specialist, I have pre-skipped introductory modules and directed you straight into performance analysis, containerization, and advanced capstones.'}
2. **Weekly Commitment (${profile.commitment} hrs/week)**: 
   At this pace, this **${track.estimatedHours} hour** roadmap will take roughly **${Math.ceil(track.estimatedHours / parseFloat(profile.commitment.split('-')[0] || 5))} weeks** of consistent study.
3. **Prerequisite Sequencing**: 
   The roadmap enforces dependencies. Nodes remain **locked** until their preceding foundations are completed or marked as skipped, preventing skill-gap frustration.

*You can view your interactive visual roadmap in the **Roadmap** tab! Toggle nodes as completed to watch your Dashboard update.*`;
  }

  // 2. LIVE GROQ CLOUD API CLIENT
  async callGroqAPI(userMessage, profile) {
    const API_URL = `https://api.groq.com/openai/v1/chat/completions`;
    
    // Structure a highly detailed system instruction prompt
    const systemPrompt = `You are "Aetheria", an expert, premium AI Learning Coach. Your job is to analyze the user's request, check their profile details, and output a structured response in JSON format.
    
    User Profile Details:
    - Experience level: ${profile.level}
    - Commitment: ${profile.commitment} hours/week
    - Learning Style: ${profile.style}
    - Interests: ${profile.interests.join(', ')}
    - Prior Knowledge: ${profile.history || 'None declared'}
    
    You must output JSON matching the exact schema specified below:
    
    If the user wants to generate a new learning path, or update/customize their learning path, output a JSON object containing:
    {
      "type": "PATH_GENERATION",
      "trackId": "custom_path_id",
      "roadmap": {
        "name": "Title of the Path (e.g. Unity Game Development Pathfinder)",
        "description": "Short explanation of the path goals",
        "estimatedHours": 120, // estimated total hours
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "phases": [
          {
            "id": "phase-1",
            "name": "Phase 1: Foundations",
            "nodes": [
              {
                "id": "node-1",
                "name": "Name of Course or Milestone",
                "type": "course", // must be "course", "project", or "assessment"
                "duration": "10 hrs",
                "difficulty": "Beginner", // "Beginner", "Intermediate", "Advanced"
                "cost": "Free",
                "description": "Short summary of what is learned",
                "skills": ["Skill Name"],
                "prerequisites": [], // list of node IDs in this roadmap that must be completed first
                "resources": [
                  { "title": "Resource website title", "url": "https://example.com/learn" }
                ]
              }
            ]
          }
        ]
      },
      "explanation": "Conversational explanation explaining why you recommended this path, referencing their experience level, learning style, and highlight their SKILL GAP (what skills they target vs what they have) in markdown format."
    }
    
    Otherwise, if the user is just asking a question, making chat, or requesting clarification without generating/adjusting a roadmap, output:
    {
      "type": "CHAT",
      "explanation": "Your helpful conversational response answering their questions in markdown format."
    }
    
    Crucial Rules:
    1. Only return valid, parsable JSON.
    2. Try to provide REAL learning resource links (like freeCodeCamp, MDN Web Docs, Kaggle, Coursera, official docs) for resources.
    3. Respect prerequisites. First nodes in Phase 1 should have empty prerequisites. Subsequent nodes should reference the node IDs of their direct prerequisites.
    4. Keep the output clean, premium, and professional.`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.groqKey}`
        },
        body: JSON.stringify({
          model: 'groq/compound',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const json = await response.json();
      const textResponse = json.choices[0].message.content;
      
      // Parse the JSON response
      const parsed = JSON.parse(textResponse.trim());
      
      // Ensure node status keys are added for local renderer
      if (parsed.type === 'PATH_GENERATION' && parsed.roadmap) {
        parsed.roadmap.phases.forEach((phase, phaseIdx) => {
          phase.nodes.forEach(node => {
            node.status = (!node.prerequisites || node.prerequisites.length === 0) ? 'unlocked' : 'locked';
          });
        });
      }

      return parsed;

    } catch (e) {
      console.error('Groq API Error, falling back to Simulator:', e);
      return {
        type: 'CHAT',
        explanation: `*Note: I encountered an issue connecting to the Groq API (${e.message}). Falling back to Simulator.* \n\nI was unable to execute the query live, but I can process it with our built-in offline engine! Let me know if you would like me to generate one of our pre-populated tracks (Frontend, Backend, Data Science, AI/ML) or if you want to check your Settings.`
      };
    }
  }

  // Simple key validation routine
  static async validateKey(key) {
    const API_URL = `https://api.groq.com/openai/v1/chat/completions`;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'groq/compound',
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
