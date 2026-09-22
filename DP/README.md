# DailyFlow

DailyFlow is a local daily planner built with React and Vite. You can add, edit, complete, and filter tasks, switch between Today / Calendar / Tasks / Statistics, and persist everything in the browser with localStorage (no backend).

## Prerequisites

- Node.js 18 or newer
- npm (comes with Node.js)

## Run locally

From this folder (`DP`):

```bash
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open that in your browser.

The first time you open the app it will be empty. Use **Add Task** or the quick-add field on Today to create tasks. Theme, settings, and tasks stay in this browser.

## Other scripts

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # run oxlint
```

## Features

- Today view with progress, date picker, filters, and a timeline
- Calendar with per-day task dots; click a task to edit it
- All-tasks list grouped by date
- Statistics: completion rate, streak, weekly bars, category/priority breakdown
- Light/dark theme, default priority/category, display name
- Export / import JSON backups from Settings
- Data keys in localStorage: `dailyflow_tasks`, `dailyflow_theme`, `dailyflow_settings`
