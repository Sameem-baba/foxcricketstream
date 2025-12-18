# 🏏 Fox Cricket Stream

A high-performance, self-hosted live streaming platform built with **Next.js**, **Express**, and **FFmpeg**.  
This project ingests a live stream source (IPTV/HLS), transcodes or relays it in real-time, and serves it to a premium web interface.

---

## ✨ Features

- **Live HLS Streaming:** Converts live input streams into browser-compatible HLS (`.m3u8`) format.  
- **Premium UI:** Cinematic, dark-themed player interface inspired by top-tier streaming services.  
- **Video.js Player:** Robust playback support with a custom Netflix-style centered play button.  
- **Auto-Recovery:** Automatically restarts FFmpeg if the stream drops or the source disconnects.  
- **Low Latency / High Quality Modes:** Tunable FFmpeg presets for performance vs quality.  
- **Responsive Design:** Optimized for both desktop and mobile devices.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 (React 19)
- Tailwind CSS
- Video.js
- Lucide Icons

**Backend**
- Node.js (Express)
- FFmpeg (spawned as a child process)

**Streaming Protocol**
- HLS (HTTP Live Streaming)

---

## 🚀 Prerequisites

Ensure the following are installed on your system:

1. **Node.js** (v18 or higher)
2. **FFmpeg** (must be available in PATH)

### FFmpeg Installation
- **Windows:** Download from https://www.gyan.dev/ffmpeg/builds/ and add `bin` to Environment Variables  
- **macOS:** `brew install ffmpeg`  
- **Linux:** `sudo apt install ffmpeg`  

Verify installation:
```bash
ffmpeg -version
```

---

## 📦 Installation

### 1. Navigate to Project Directory
```bash
cd foxcricketstream
```

### 2. Install Frontend Dependencies
```bash
npm install
# or
yarn install
```

### 3. Install Backend Dependencies
```bash
npm install express cors
```

---

## 🏃‍♂️ Running the Project

You must run **both** the backend and frontend simultaneously.

### 1. Start the Stream Server (Backend)
```bash
node stream-server.js
```

- **Port:** 8080  
- **Logs:**  
  - 🚀 Starting High-Quality Sports Engine...
  - 📥 Fetching live data...

### 2. Start the Web App (Frontend)
Open a new terminal:
```bash
npm run dev
```

- **Port:** 3000  
- **URL:** http://localhost:3000

---

## ⚙️ Configuration

### Change the Source Stream
Edit `stream-server.js`:

```js
const SOURCE_URL = "http://YOUR_NEW_IPTV_URL_HERE";
```

### Quality vs Performance Tuning

Inside `startFFmpeg()`:

**Low CPU / Low Latency**
- `-preset ultrafast`
- `-vf scale=1280:720`

**High Quality (Sports Optimized)**
- `-preset superfast`
- `-b:v 4500k`
- `-vf yadif,scale=1280:720`

> Note: High-quality presets require a capable CPU.

---

## ⚠️ Troubleshooting

### Black Screen / Infinite Loading
- Source may be offline or geo-blocked
- If audio plays but video is black, source is likely **interlaced (1080i)**  
  → Use transcoding with `yadif` filter

### Buffering Issues
- CPU overload during encoding
- Reduce bitrate (e.g., `4500k → 2500k`)
- Switch preset to `ultrafast`

### FFmpeg Not Found
```bash
ffmpeg -version
```
If not found, reinstall FFmpeg and ensure PATH is set correctly.

---

## 📄 License

This project is intended for **educational purposes only**.  
You are responsible for ensuring you have the legal rights to stream any content used with this platform.
