"use client";

import { useState } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

const CHANNELS = [
  {
    id: 'live-1',
    title: 'Fox Cricket',
    instructor: '',
    url: '/api/stream/active',
    category: 'Live Feed'
  }
];

export default function Home() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pt-24 pb-12 px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header Metadata */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
              {activeChannel.title}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-zinc-400 text-sm">
              {/* <span className="flex items-center gap-1.5">
                <GraduationCap size={16} /> {activeChannel.instructor}
              </span> */}
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} /> {activeChannel.category}
              </span>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 text-zinc-500 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Users size={16} />
            <span>1,248 attending</span>
          </div> */}
        </div>

        {/* The Player Component */}
        <StreamPlayer
          key={activeChannel.id} // Forces re-mount when channel changes
        />

        {/* Channel Selection Grid */}
        <div className="mt-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
            Available Seminars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${activeChannel.id === channel.id
                  ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/50"
                  : "bg-zinc-900/50 border-white/5 hover:bg-white/5"
                  }`}
              >
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">
                  {channel.category}
                </span>
                <span className="font-medium text-zinc-200">{channel.title}</span>
                <span className="text-xs text-zinc-500 mt-1">{channel.instructor}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-20 border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase">
            Academic Streaming Platform • Built with Next.js & HLS.js
          </p>
        </footer>
      </div>
    </main>
  );
}
