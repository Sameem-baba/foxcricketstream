"use client";

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function StreamPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Point to your local stream
        const streamUrl = "http://localhost:8080/live/stream.m3u8";

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,

                // 1. DISABLE Low Latency (Crucial for stitched streams)
                lowLatencyMode: false,

                // 2. Safety Buffer: Wait for 3 segments (3 * 2s = 6s delay) before playing
                // This gives the backend time to stitch the files without the user noticing.
                liveSyncDurationCount: 3,

                // 3. Keep a healthy buffer in memory
                maxBufferLength: 30,
                maxMaxBufferLength: 60,

                // 4. Be patient with network requests
                manifestLoadingTimeOut: 10000,
                manifestLoadingMaxRetry: 5,
                levelLoadingTimeOut: 10000,
                fragLoadingTimeOut: 20000,
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Try to play, but mute first to allow autoplay policies
                video.muted = true;
                video.play().catch(e => console.log("Autoplay blocked:", e));
            });

            // Error Handling: Auto-recover if it stalls
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("Network error, recovering...");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("Media error, recovering...");
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            // Cleanup
            return () => {
                hls.destroy();
            };

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari Native HLS Fallback
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }
    }, []);

    return (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <video
                ref={videoRef}
                className="h-full w-full object-contain"
                controls
                muted // Muted needed for autoplay
            />
        </div>
    );
}