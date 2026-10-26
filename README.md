# Giyako

**Find your people through what you love.**

Giyako is a campus social app where students log the movies, shows, anime, games, albums and books they love, then get matched with classmates who share their taste. Browse suggested people, message them, and keep up with what's happening on campus through the Campus Hub.

> **Demo project.** Accounts, logs, messages and posts are stored in your browser (`localStorage`), and the campus profiles are mock data. See [Demo notes](#demo-notes).

**Live demo:** _https://giyako.vercel.app/_

---

## Features

- **Media logs.** Search a catalog of movies, TV, anime, games, music and books, and add items to your personal log. The first log is your featured pick.
- **Taste matching.** The home feed ranks people on campus by how many logs you share, with a Refresh button to reshuffle ties.
- **Profiles.** Edit your own profile (name, program, pronouns, bio, socials) and view other students' profiles with the logs you have in common.
- **Messages.** Start chats from any profile, see unread counts, and get typing indicators and mock replies.
- **Campus Hub.** A community board with tagged posts (Lost & Found, Study Help, Events, Buy & Sell, Housing, Rides, Clubs, General), voting, comments and "resolved" states.
- **Notifications.** A bell with unread tracking that links back to messages and logs.
- **Settings.** Notification preferences, a reduced-motion toggle, password change, sign out and account deletion.
- **Accounts.** Sign up, log in, email verification and onboarding.

## Tech stack

| Layer    | Tools                                          |
| -------- | ---------------------------------------------- |
| Frontend | React 19, Vite, plain CSS                      |
| Backend  | Node.js, Express 4, CORS, dotenv (ES modules)  |
| Data     | `media_catalog.json` (read-only), `localStorage` for user data |
| Hosting  | Vercel (frontend and backend as separate projects) |

## Project structure

```
giyako/
├── backend/
│   ├── data/
│   │   └── media_catalog.json   # 42-item catalog
│   ├── routes/
│   │   └── mediaRoutes.js       # GET /api/media/search
│   ├── server.js                # Express app (exported for Vercel)
│   ├── vercel.json
│   └── package.json
├── public/
├── src/
│   ├── components/              # Header, Landing, AuthPage, MyLogs, Messages, CampusHub, ...
│   ├── lib/                     # auth, media, messages, notifications, settings, hub, mockProfiles
│   ├── App.jsx                  # Main app shell and state
│   ├── App.css
│   ├── animations.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── vercel.json
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### 1. Clone and install

```bash
git clone <your-repo-url>
cd giyako

# frontend dependencies
npm install

# backend dependencies
cd backend
npm install
cd ..
```

### 2. Run the backend

```bash
cd backend
npm run dev
```

The API starts on `http://localhost:5000` (override with the `PORT` environment variable). Check it at `http://localhost:5000/api/health`.

### 3. Run the frontend

In a second terminal, from the project root:

```bash
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

## Environment variables

| Variable       | Where    | Description                                             | Default                 |
| -------------- | -------- | ------------------------------------------------------- | ----------------------- |
| `VITE_API_URL` | Frontend | Base URL of the backend API, without a trailing slash   | `http://localhost:5000` |
| `PORT`         | Backend  | Port for the local dev server                           | `5000`                  |

For local development you don't need to set anything. Set `VITE_API_URL` when deploying so the frontend knows where the backend lives.

## API

### `GET /api/health`

Returns `{ "status": "ok" }`.

### `GET /api/media/search`

Searches the media catalog.

| Query param | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `query`     | Case-insensitive match on title or creator. Empty returns everything.       |
| `type`      | `all` (default), `movie`, `tv`, `anime`, `game`, `music` or `book`          |

Returns up to 60 results:

```json
[
  {
    "id": 4,
    "title": "Elden Ring",
    "media_type": "game",
    "creator": "FromSoftware",
    "year": 2022,
    "poster_url": "https://..."
  }
]
```

`poster_url` is `null` for items without artwork, and the UI falls back to a placeholder cover.

Example:

```bash
curl "http://localhost:5000/api/media/search?query=nolan&type=movie"
```

## Adding to the catalog

Edit `backend/data/media_catalog.json` and add an entry with a unique `id`:

```json
{
  "id": 43,
  "title": "Your Title",
  "media_type": "movie",
  "creator": "Director or Artist",
  "year": 2024,
  "poster_url": "https://example.com/poster.jpg"
}
```

`poster_url` must be a **direct link to an image file** (ending in `.jpg`, `.png` and so on), not a web page. If you add a new item that mock profiles should reference, also add it to the `MEDIA` list in `src/lib/mockProfiles.js`.

## Deployment (Vercel)

Giyako deploys as **two Vercel projects from the same repository**.

**Backend**

1. Import the repo into Vercel and set **Root Directory** to `backend`.
2. Vercel uses `backend/vercel.json` to run `server.js` as a serverless function and bundle `data/**`.
3. Deploy and copy the URL (for example `https://giyako-api.vercel.app`).

**Frontend**

1. Import the same repo and leave **Root Directory** as the project root. Vercel detects Vite automatically (`npm run build`, output `dist`).
2. Add the environment variable `VITE_API_URL` set to your backend URL.
3. Deploy.

> The server only opens a port when `NODE_ENV` is not `production`; on Vercel it exports the Express app instead.

## Demo notes

- **No real database.** Users, logs, messages, notifications, settings and Campus Hub posts all live in `localStorage`, so they are per browser and reset when site data is cleared.
- **Mock auth.** Passwords are hashed in the browser and never leave it. This is for demonstration only, not real security.
- **Email verification code:** `123456` (demo only).
- **Mock people.** The eight campus profiles and their chat replies are hard-coded in `src/lib/mockProfiles.js`.
- **Backend is read-only.** The API only serves the catalog, so it works fine on Vercel's read-only filesystem. If the backend is offline, the app still works, just without poster art.

## Roadmap

- Real authentication with a proper backend
- A database for users, logs, messages and Campus Hub posts
- Real-time messaging
- Poster art pulled from a media API (such as TMDB, IGDB or Open Library)

## Scripts

| Command           | Location | Description                     |
| ----------------- | -------- | ------------------------------- |
| `npm run dev`     | root     | Start the Vite dev server       |
| `npm run build`   | root     | Build the frontend for production |
| `npm run preview` | root     | Preview the production build    |
| `npm run lint`    | root     | Run ESLint                      |
| `npm run dev`     | backend  | Start the API with file watching |
| `npm start`       | backend  | Start the API                   |

## License

_Add a license here (for example MIT)._
