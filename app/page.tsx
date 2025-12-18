"use client";

import { useState } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import { BookOpen, User } from 'lucide-react';

const CHANNELS = [
  {
    id: 'live-1',
    title: 'Fox Cricket Main Event',
    category: 'Sports',
    viewers: '12.4k'
  }
];

export default function Home() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center py-10">

      <div className="w-full max-w-6xl px-6">

        {/* The Player Section */}
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <StreamPlayer key={activeChannel.id} />

          {/* Live Badge Overlay */}
          <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg z-10 animate-pulse pointer-events-none">
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
            LIVE
          </div>
        </div>

        {/* Video Metadata */}
        <div className="mt-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{activeChannel.title}</h1>
            <div className="flex items-center gap-4 text-zinc-400 text-sm">
              <span className="text-red-500 font-semibold px-2 py-0.5 bg-red-500/10 rounded">{activeChannel.category}</span>
              <span>•</span>
              <span>{activeChannel.viewers} watching</span>
              <span>•</span>
              <span className="text-green-400">Excellent Connection</span>
            </div>
          </div>

          {/* Simple Share Button */}
          <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition text-zinc-400 hover:text-white">
            <BookOpen size={20} />
          </button>
        </div>

        {/* Channel List (Simplified) */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Up Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHANNELS.map(ch => (
              <div key={ch.id} className="bg-zinc-900/30 hover:bg-zinc-900 p-4 rounded-xl border border-white/5 cursor-pointer transition flex gap-4 items-center group">
                <div className="w-12 h-12 bg-zinc-800 group-hover:bg-red-600/20 text-zinc-500 group-hover:text-red-500 rounded-lg flex items-center justify-center transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition">{ch.title}</h4>
                  <p className="text-xs text-zinc-500">Live now</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}