# ✦ FinDashboard – Premium AI-Powered Financial Hub ✦


![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

## 🌟 Overview

FinDashboard isn't just another dry accounting spreadsheet—it's a living, breathing application. Built with **React** and styled via a custom **Tailwind v4** "glassmorphism" engine, this application bridges the gap between deep financial analytics and a beautiful, cinematic user experience.

### 🔥 Key Features
- **Intelligent AI Analysis**: Integration with OpenRouter allows the majestic **Nvidia Nemotron 3 Super (120B)** model to instantly analyze your transactions and spit out actionable financial insights natively in INR (₹). 
- **Awwwards-Level UI/UX**: Designed utilizing a completely transparent frosted-glass aesthetic. Immersive background neons, custom SVG orbitals, and smooth-spring `framer-motion` interactions on absolutely every click and hover.
- **Role-Based Access Control (RBAC)**: An integrated permission simulator. Instantly flip between 'Admin' (full edit rights) and 'Viewer' (read-only rights).
- **Intricate Data Visualization**: Utilizing Recharts to provide flawless responsive tracking. Contains a 7-day chronological Balance Trajectory area graph and an Expenses Matrix ring graph with explicitly collision-free color mapping.
- **Robust Transaction Engine**: Full Data Table logic. You can Add, Edit, Delete, Filter, and Sort elements live. Includes a highly optimized algorithmic local storage syncing utility.
- **Universal Data Export**: Instantly download your full local repository into formatted `.csv` or `.json` blobs to run manual backups securely in your browser.

---

## 🚀 Getting Started Locally

Getting the ecosystem up and running strictly requires Node.js.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/findashboard.git
   cd findashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Obtain an OpenRouter API key and place it inside the new `.env` file: `VITE_OPENROUTER_API_KEY=your_key_here`

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   > Head over to `http://localhost:5173` and admire your new dashboard!

---

## ☁️ Deployment to Vercel

This repository is strictly configured for 1-click deployment to **Vercel**. 

1. Push your local codebase to a GitHub repository. (🚨 **Important:** Ensure you never push your `.env` file! It is ignored by default in `.gitignore`).
2. Log into your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project** and import your GitHub repository.
4. **Environment Variables**: During the Vercel setup screen, under "Environment Variables", add:
   - `VITE_OPENROUTER_API_KEY` and paste your actual OpenRouter API key.
5. Hit **Deploy**. 

*Note: The included `vercel.json` automatically ensures Single Page Application (SPA) routing does not crash on reload.*

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 / Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Date Parsing**: Date-fns
- **AI Integration**: OpenRouter API (`nvidia/nemotron-3-super-120b`)

## 💡 About Local Storage
Currently, the entire application engine lives natively inside your browser. No backend databases are required. Your specific transactions, states, and setups rely on window.localStorage. To migrate machines, just export to JSON using the built-in Download mechanic!
