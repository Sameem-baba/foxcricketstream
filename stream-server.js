const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = 8080;

// Configuration
const STREAM_DIR = path.join(__dirname, 'public', 'live');
const SOURCE_URL = 'http://websafety101.net:5050/feltonsmith1961@icloud.com/VSq8gmsgkR/698956';

app.use(cors());

// Ensure directory exists
if (!fs.existsSync(STREAM_DIR)) {
    fs.mkdirSync(STREAM_DIR, { recursive: true });
}

let ffmpegProcess = null;

const startFFmpeg = () => {
    console.log('🚀 Starting High-Quality Sports Engine...');

    const ffmpegArgs = [
        '-re',
        '-i', 'pipe:0',

        // --- VIDEO SETTINGS (High Quality) ---
        '-c:v', 'libx264',

        // 1. Preset: 'superfast' gives better quality than 'ultrafast' without melting CPU
        '-preset', 'superfast',
        '-tune', 'zerolatency',

        // 2. Filter: 'yadif' deinterlaces (smooths motion), 'scale' keeps it 720p
        // Note: If this lags, remove "yadif," and just use "scale=1280:720"
        '-vf', 'yadif,scale=1280:720',

        // 3. Bitrate: 4500k is great for 720p 60fps sports
        '-b:v', '4500k',
        '-maxrate', '5000k',
        '-bufsize', '10000k',
        '-profile:v', 'main',

        // --- AUDIO SETTINGS ---
        '-c:a', 'aac',
        '-ar', '44100',
        '-b:a', '192k', // Higher audio quality

        // --- HLS OUTPUT ---
        '-f', 'hls',
        '-hls_time', '3',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments+append_list',

        path.join(STREAM_DIR, 'stream.m3u8')
    ];

    ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    ffmpegProcess.stderr.on('data', (data) => {
        // Log CPU speed once in a while to ensure we aren't lagging
        const msg = data.toString();
        if (msg.includes('speed=')) {
            // console.log(msg.match(/speed=.*?x/)[0]); // Uncomment to check speed
        }
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`⚠️ FFmpeg died (Code ${code}). Restarting engine...`);
        setTimeout(startFFmpeg, 1000);
    });

    fetchAndPipe(SOURCE_URL);
};

const fetchAndPipe = (url) => {
    console.log(`📥 Fetching live data...`);

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        }
    };

    const req = http.get(url, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`🔀 Redirecting...`);
            return fetchAndPipe(res.headers.location);
        }

        res.pipe(ffmpegProcess.stdin, { end: false });

        res.on('end', () => {
            console.log('🔄 Reconnecting source...');
            setTimeout(() => fetchAndPipe(SOURCE_URL), 500);
        });
    });

    req.on('error', (err) => {
        console.error('❌ Fetch Error:', err.message);
        setTimeout(() => fetchAndPipe(SOURCE_URL), 2000);
    });
};

app.use('/live', express.static(STREAM_DIR));

app.listen(PORT, () => {
    console.log(`📺 Stream Server running at http://localhost:${PORT}`);
    console.log(`🔗 Playlist: http://localhost:${PORT}/live/stream.m3u8`);

    if (fs.existsSync(STREAM_DIR)) {
        fs.rmSync(STREAM_DIR, { recursive: true, force: true });
        fs.mkdirSync(STREAM_DIR);
    }
    startFFmpeg();
});