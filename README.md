# Dream Journaling & Reflection App 🌙✨

A beautiful, calming web app for daily journaling, task tracking, and monthly reflections.

## Features

- 📝 Daily journal entries with reflection prompts
- ✅ Task management with completion tracking
- 📅 Interactive month calendar
- 🌙 Monthly reflection themes
- 💾 Local storage persistence (no backend needed)
- 🎨 Warm, calming design with smooth animations

## Installation

1. Open terminal in the project folder
2. Install dependencies:
```bash
   npm install
```

## Running the App
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Building for Production
```bash
npm run build
```

## How It Works

### Data Storage
- **Tasks**: Stored per date (`tasks_2025-01-15`)
- **Journal**: Stored per date (`journal_2025-01-15`)
- **Monthly Reflection**: Stored per month (`monthly_2025-01`)

### Key Behaviors
- Each date starts with an empty task list
- No task carry-forward between days
- Calendar shows indicators for dates with data
- All data persists in browser's localStorage

## Customization

To change the user name, edit line 15 in `src/App.jsx`:
```javascript
const [userName, setUserName] = useState('YourName');
```

## Technologies

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- LocalStorage API
