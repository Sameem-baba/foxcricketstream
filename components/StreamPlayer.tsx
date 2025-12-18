"use client";

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import the default Premium styles
import Player from 'video.js/dist/types/player';

export default function StreamPlayer() {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    // Configuration
    const streamUrl = "http://localhost:8080/live/stream.m3u8";

    useEffect(() => {
        // Make sure the player is only initialized once
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");

            // Add 'vjs-big-play-centered' to center the play button (Netflix style)
            videoElement.classList.add('vjs-big-play-centered');

            // Append the element to our div
            if (videoRef.current) {
                videoRef.current.appendChild(videoElement);
            }

            // Initialize the Video.js player
            const player = (playerRef.current = videojs(videoElement, {
                autoplay: 'muted', // Auto-play muted (browser policy friendly)
                controls: true,
                responsive: true,
                fluid: true, // Adapts to container size
                sources: [{
                    src: streamUrl,
                    type: 'application/x-mpegURL' // This tells it it's an HLS stream
                }],
                html5: {
                    vhs: {
                        // Low latency settings for HLS
                        overrideNative: true,
                        enableLowLatency: true,
                    }
                }
            }, () => {
                console.log('🎬 Player is ready');
            }));

            // Error handling
            player.on('error', () => {
                console.log('⚠️ Stream error, trying to recover...');
                player.src({ src: streamUrl, type: 'application/x-mpegURL' });
            });

        } else {
            // If player already exists, just update the URL if it changed
            const player = playerRef.current;
            player.src({ src: streamUrl, type: 'application/x-mpegURL' });
        }
    }, [streamUrl]);

    // Cleanup on unmount
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <div data-vjs-player>
                {/* The player will attach itself here */}
                <div ref={videoRef} />
            </div>

            {/* Custom CSS to make it look extra premium (Dark/Red Theme) */}
            <style jsx global>{`
        .video-js .vjs-big-play-button {
          background-color: rgba(220, 38, 38, 0.9); /* Red color */
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          line-height: 80px;
          font-size: 50px;
          margin-left: -40px; /* Center alignment fix */
          margin-top: -40px;
        }
        .video-js .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
        }
        .video-js .vjs-slider {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
}