# VidVault 🎬

A full-stack video upload platform. Upload, stream, search, and delete videos with a clean dark UI.

## Stack
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express + Multer
- **Database:** MongoDB (Mongoose)
- **Streaming:** HTTP Range Requests (native browser seeking)

## Features
- Drag-and-drop upload with real-time progress bar
- Auto-generated video thumbnails (canvas snapshot)
- HTTP video streaming with seek support
- Search videos by title
- Delete videos (removes file + DB record)
- Responsive grid layout

## Run Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Clone
```bash
git clone https://github.com/rohit-khadwal/vidvault
cd vidvault
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Open **http://localhost:5173**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | List all videos |
| GET | `/api/videos?search=q` | Search videos |
| POST | `/api/videos` | Upload video (multipart) |
| GET | `/api/videos/:id` | Get video metadata |
| GET | `/api/videos/:id/stream` | Stream video (range supported) |
| DELETE | `/api/videos/:id` | Delete video |
| PATCH | `/api/videos/:id` | Update title |

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vidvault
CLIENT_URL=http://localhost:5173
```

## File Limits
- Max size: **500 MB**
- Allowed types: MP4, MOV, AVI, WebM, MKV
