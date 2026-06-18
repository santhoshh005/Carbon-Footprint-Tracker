# Carbon Footprint Tracker

Carbon Footprint Tracker is a premium, interactive sustainability platform designed to simplify personal carbon accounting, promote eco-friendly commuting habits, and track milestones toward carbon neutrality.

## 🚀 Key Features

* **Multi-Language System**: Full support for 6 languages (English, Hindi, Telugu, Tamil, Kannada, Malayalam) with real-time browser language detection.
* **Animated Circular Eco Gauge**: A beautiful, glowing SVG-based circular progress gauge that animates overall score metrics dynamically on page load.
* **Carbon Calculator & Telemetry**: Calculates daily footprints across transportation, diet, and energy, with an expandable **Formula Telemetry Matrix** illustrating calculations transparently in real-time.
* **4-Week Net-Zero Roadmap**: A structured, checklist-driven guide helping users transition from a starter tier to net-zero compliance, with persistent progress tracking.
* **Travel Mode Simulator**: A slider-driven comparative sandbox visualizing how carbon emissions differ across SUVs, gasoline cars, hybrids, public transit, EVs, and bicycles, mapped against equivalent tree absorption metrics.
* **Daily Eco-Trivia Quiz**: An interactive quiz with educational trivia matching the selected language, rewarding correct answers with challenge points.
* **Simulated Offsetting Sandbox**: Allows users to spend accumulated challenge points to sponsor virtual green projects (Reforestation, Solar Power, Ocean Plastic Cleanup) to lower their net impact.
* **Friendly Leaderboard**: A ranking grid showing global standings, with support for custom tab filtering to compare scores directly against added friends.
* **Offline Database Fallback**: Auto-detects if Firebase credentials are present. If absent, the app transparently falls back to a mock local database backed by `localStorage`, enabling full registration, logins, logs, and state persistence immediately.

---

## 🛠️ Technology Stack

* **Frontend**: React (Hooks, Context, Memoization), React Router DOM, Tailwind CSS (Vanilla CSS themes), Recharts.
* **Internationalization**: i18next & react-i18next.
* **Database & Auth**: Firebase (SDK v10+) with LocalStorage Mock Engine fallback.
* **Build System**: Vite (with custom Rollup vendor chunk code-splitting for fast load times).

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd Carbon-Footprint-Tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Verify production compilation**:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Configuration (Optional)

To connect the application to a live Firebase instance instead of the LocalStorage Mock fallback, create a `.env` file in the root directory and populate it with your Firebase project keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
