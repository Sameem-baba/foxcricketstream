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

// 1. Start FFmpeg (Listening for piped input)
const startFFmpeg = () => {
    console.log('🚀 Starting FFmpeg Stream Engine...');

    ffmpegProcess = spawn('ffmpeg', [
        '-re',
        '-i', 'pipe:0',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-ar', '44100',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '6',
        '-hls_flags', 'delete_segments+append_list',
        '-g', '30',
        '-sc_threshold', '0',
        path.join(STREAM_DIR, 'stream.m3u8')
    ]);

    ffmpegProcess.on('close', (code) => {
        console.log(`⚠️ FFmpeg died (Code ${code}). Restarting engine...`);
        setTimeout(startFFmpeg, 1000);
    });

    // Start fetching data to feed into FFmpeg
    fetchAndPipe(SOURCE_URL);
};

// 2. Fetch Data and Feed FFmpeg
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
        // Handle Redirects (302)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`🔀 Following redirect...`);
            return fetchAndPipe(res.headers.location);
        }

        // Pipe data into FFmpeg
        // { end: false } is CRITICAL. It keeps FFmpeg alive when this request finishes.
        res.pipe(ffmpegProcess.stdin, { end: false });

        // When this chunk ends, fetch the next one immediately
        res.on('end', () => {
            console.log('🔄 Chunk finished. Reconnecting for more data...');
            // Small delay prevents hammering the server if it closes too fast
            setTimeout(() => fetchAndPipe(SOURCE_URL), 500);
        });

    });

    req.on('error', (err) => {
        console.error('❌ Fetch Error:', err.message);
        setTimeout(() => fetchAndPipe(SOURCE_URL), 2000);
    });
};

// 3. Serve the Files
app.use('/live', express.static(STREAM_DIR));

app.listen(PORT, () => {
    console.log(`📺 Stream Server running at http://localhost:${PORT}`);
    console.log(`🔗 HLS Playlist: http://localhost:${PORT}/live/stream.m3u8`);

    // Clean up old files on start
    if (fs.existsSync(STREAM_DIR)) {
        fs.rmSync(STREAM_DIR, { recursive: true, force: true });
        fs.mkdirSync(STREAM_DIR);
    }

    startFFmpeg();
});