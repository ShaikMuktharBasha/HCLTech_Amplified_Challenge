# 🌌 AetherPath — AI Personalized Learning Path Recommender

AetherPath is a modern, premium, and interactive web application designed to act as an intelligent copilot for learners. It dynamically maps your career goals, detects your current skills and capabilities, and recommends a structured, sequential, step-by-step visual learning path packed with project milestones, resources, and prerequisite blocks.

---

## ✨ Features

*   🤖 **AI Coach Guidance**: Chat in real-time with **Aetheria**, an intelligent learning copilot powered by LLMs (via Groq API / client-side simulation), to outline, adapt, and refine your study curriculum.
*   ⚡ **Skill Gap Diagnostics**: Analyze your educational and professional background to bypass topics you already know and target missing advanced competencies.
*   🗺️ **Interactive Milestone Maps**: View a beautifully formatted, sequential node flow chart representing your path, complete with resources (articles, docs, tutorials) and hands-on repository projects.
*   🔒 **Google OAuth 2.0 Sign-In**: Secure and seamless sign-in using Google Identity Services (GIS), displaying your profile picture and name directly in the dashboard sidebar.
*   📊 **Student Dashboard**: Track your overall progress, active learning path, milestones completed, hours spent, and easily resume your current node.
*   ⚙️ **Dynamic Settings Panel**: Configure your own custom Groq API key, choose preferred model types (e.g. Llama 3), customize your learning preferences, or update your Google Client ID.

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
