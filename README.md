# 🌌 AetherPath — AI Personalized Learning Path Recommender

AetherPath is a modern, premium, and interactive web application designed to act as an intelligent copilot for learners. It dynamically maps your career goals, detects your current skills and capabilities, and recommends a structured, sequential, step-by-step visual learning path packed with project milestones, resources, and prerequisite blocks.

---

## 🚀 Feature Showcase

AetherPath comes loaded with rich, premium features designed to make learning personalized and highly visual:

### 🤖 AI Coach Guidance (Aetheria)
*   **Real-time Copilot Chat**: Interact directly with **Aetheria**, our Groq-powered AI learning coach. Ask questions about nodes, clarify confusing topics, or request customization of your generated learning paths.
*   **Adaptive Curriculum Generation**: Tell Aetheria what you want to learn, and watch her dynamically generate prerequisite modules, topics, and code project challenges tailored to your goals.
*   **Flexible AI Settings**: Choose from multiple pre-loaded models (like Meta's Llama 3) and adjust temperature or system prompt parameters in the Settings tab.

### ⚡ Skill Gap Diagnostics
*   **Step-by-Step Onboarding Wizard**: Upon first signup, the wizard guides you to select your career track (e.g., Frontend Developer, AI Engineer, Data Scientist).
*   **Background Profiling**: Input your existing experience (Beginner, Intermediate, Advanced) and specify weekly time commitments.
*   **Intelligent Skipping**: AetherPath uses your profile to automatically customize the roadmap, highlighting prerequisites you can skip and focusing on missing competencies.

### 🗺️ Interactive Milestone Maps
*   **Visual Roadmap Grid**: See your entire career journey laid out as sequential progress nodes. Clicking any node focuses your study space.
*   **Curated Resources & Projects**: Each milestone node lists handpicked reading materials, video tutorials, official documentation, and a hands-on project description to build in your repository.
*   **Interactive Node Checkmarking**: Track your progress step-by-step by checking off nodes. Watch your dashboard metrics update in real-time as you check off items!

### 🔒 Google OAuth 2.0 Sign-In
*   **Modern Auth Panel**: Standard password/email signup & login tab, backed by a beautifully aligned, responsive **Continue with Google** button.
*   **Client-side Profile Decoding**: Integrates client-side JWT token parsing (Google Identity Services API) to securely read and present user names, emails, and profile picture avatars.
*   **Dynamic Avatar Rendering**: Displays your Google account profile picture in the sidebar menu and dashboard welcome header once logged in.

### 📊 Student Dashboard & Metrics
*   **Visual Stat Trackers**: Track your learning progress with key analytics, including **Overall Completion Percentage**, **Milestones Finished**, and **Learning Hours Logged**.
*   **Quick Resume Action**: Displays your current active path directly on the dashboard home screen with a single click button to jump right back to your next uncompleted node.

---

## 🛠️ Technology Stack

*   **Bundler/Dev Server**: [Vite](https://vitejs.dev/) (Runs on port `3000` by default)
*   **Structure**: Semantic HTML5
*   **Styling**: Pure Vanilla CSS (Sleek dark/light theme systems, custom glowing linear gradients, glassmorphism UI, and fluid micro-animations)
*   **Logic**: Modern Vanilla JavaScript (SPA History API Routing, Reactive State Store, and JWT decoding)
*   **Icons**: [Lucide Icons](https://lucide.dev/)
*   **Auth**: Google Identity Services SDK

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and npm installed.

### 📥 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ShaikMuktharBasha/HCLTech_Amplified_Challenge.git
    cd HCLTech_Amplified_Challenge
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### 💻 Running Locally

Launch the Vite local development server:
```bash
npm run dev
```
The application will automatically open in your default browser at **`http://localhost:3000`**.

> [!NOTE]
> If your browser redirects you or opens the site via `http://127.0.0.1:3000`, make sure you add **both** `http://localhost:3000` and `http://127.0.0.1:3000` to your Google Cloud Console **Authorized JavaScript origins** to prevent `origin_mismatch` errors.

### 🏗️ Building for Production

Compile the optimized static bundle for deployment:
```bash
npm run build
```
The output files will be built inside the `/dist` directory.

---

## ⚙️ Google OAuth Configuration

To configure your own Google Sign-In button:
1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** credential configured for a Web Application.
3. Add the following to **Authorized JavaScript origins**:
    *   `http://localhost:3000`
    *   `http://127.0.0.1:3000`
    *   *(Your production Vercel URL, if deployed)*
4. Paste the generated Client ID inside the settings panel of AetherPath or update the default state in [`src/state.js`](file:///c:/Users/mukht/OneDrive/Desktop/hcl_amplified/src/state.js).

---

## 🌐 Deployment (Vercel)

The project includes a [`vercel.json`](file:///c:/Users/mukht/OneDrive/Desktop/hcl_amplified/vercel.json) configuration mapping all subpaths to `index.html` to support Single Page Application (SPA) client-side routing.

To deploy in one command:
```bash
npx vercel --prod
```
