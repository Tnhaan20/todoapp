# ✅ My Tasks — To-Do App

A clean, feature-rich To-Do list app built with **Vite + React + TypeScript + Tailwind CSS v4**.
All data is persisted in your browser's `localStorage` — no backend required.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | v18 or higher |
| npm | v9 or higher (comes with Node.js) |

### Install & Run

```bash
# 1. Clone or navigate to the project folder
cd "ToDoApp"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser at **[http://localhost:5173](http://localhost:5173)**

### Build for Production

```bash
# Compile and bundle for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🐳 Running with Docker

Make sure [Docker](https://www.docker.com/) is installed, then:

```bash
# Build and start the container
docker compose up --build
```

Then open your browser at **[http://localhost:3000](http://localhost:3000)**

```bash
# Stop the container
docker compose down
```

The image is built in two stages:
1. **Builder** — Node 20 Alpine installs dependencies and runs `npm run build`
2. **Runner** — Node 20 Alpine with `serve` serves the static `dist/` folder on port `3000`

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Add tasks** | Title (required) + notes/description (optional) |
| **Edit tasks** | Inline edit — title, content, priority, deadline |
| **Delete tasks** | With confirmation dialog to prevent accidents |
| **Complete tasks** | Toggle done/undone; completed tasks cannot be edited |
| **Priority levels** | None / Medium / High — color-coded badges |
| **Deadlines** | Set a deadline per task; badges show Overdue / Due soon / Upcoming |
| **Deadline alarm** | In-app toast + browser notification when a deadline is reached |
| **Filter** | View All / Active / Completed tasks |
| **Persistence** | All tasks auto-saved to `localStorage` |
| **Live status** | Deadline badges refresh every minute automatically |

---

## 🗂️ Project Structure

```
src/
├── types/
│   └── task.ts                  # Task interface & shared types (Priority, FilterType, etc.)
│
├── utils/
│   ├── date.ts                  # now(), formatDate(), formatDeadline(), getDeadlineStatus()
│   └── storage.ts               # loadFromStorage(), saveToStorage(), schema migration
│
├── hooks/
│   ├── useTasks.ts              # Core CRUD logic + localStorage persistence
│   ├── useToast.ts              # Toast queue (add / auto-dismiss / remove)
│   └── useDeadlineAlarm.ts      # Deadline polling + browser notification
│
├── components/
│   ├── TaskInput/               # Add-task form (title, content, deadline, priority)
│   ├── FilterTabs/              # All / Active / Completed filter buttons
│   ├── TaskList/                # Renders the task list or empty state
│   ├── TaskItem/                # Individual task card (view + inline edit)
│   ├── ConfirmDialog/           # Reusable confirmation modal
│   └── Toast/                   # Slide-in toast notification + container
│
├── App.tsx                      # Root — wires all hooks and components together
├── main.tsx                     # React entry point
└── index.css                    # Tailwind v4 import + custom keyframes
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Storage | Browser `localStorage` |
| Notifications | [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) |
| Container | [Docker](https://www.docker.com/) + `serve` |

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:5173` |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## 🔔 Deadline Alarm Notes

- The app will **request browser notification permission** on first load.
- Deadlines are checked **every 30 seconds** in the background.
- When a task deadline is reached, you'll see an **in-app toast** and a **browser notification**.
- Each task only alarms **once per session**. If you edit the deadline, the alarm resets automatically.
- Notifications also appear even if you're on a different browser tab.
