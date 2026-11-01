"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  Download,
  Play,
  Pause,
  Music,
  Video,
  Image as ImageIcon,
  Award,
  X,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Gauge,
  Headphones,
  Shuffle,
  Clock,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { getMediaContent, getPublicNotices } from "../actions";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  size?: string;
  quality?: string;
  cover: string;
  category: string;
  audioUrl?: string;
  type?: string;
};

type VideoItem = {
  id: string;
  title: string;
  duration: string;
  cover: string;
  category: string;
  videoUrl?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getExt(url: string | undefined, defaultLabel: string): string {
  if (!url) return defaultLabel;
  try {
    const pathname = new URL(url, "http://x").pathname;
    const parts = pathname.split(".");
    if (parts.length < 2) return defaultLabel;
    const ext = parts[parts.length - 1].toUpperCase();
    const audioExts = ["MP3", "WAV", "OGG", "AAC", "FLAC", "M4A", "OPUS", "WMA"];
    const videoExts = ["MP4", "MPEG", "MPG", "MOV", "AVI", "WEBM", "MKV", "M4V"];
    if ([...audioExts, ...videoExts].includes(ext)) return ext;
    return defaultLabel;
  } catch {
    return defaultLabel;
  }
}

function fmtTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO PLAYER MODAL  (Spotify-style, full-featured)
// ─────────────────────────────────────────────────────────────────────────────

function AudioPlayerModal({ song, onClose, songs, onChangeSong }: {
  song: Song;
  onClose: () => void;
  songs: Song[];
  onChangeSong: (s: Song) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wavePhase, setWavePhase] = useState(0);
  const waveRef = useRef<number | null>(null);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const currentIndex = songs.findIndex((s) => s.id === song.id);

  // Waveform animation
  useEffect(() => {
    if (playing) {
      const tick = () => { setWavePhase((p) => p + 0.10); waveRef.current = requestAnimationFrame(tick); };
      waveRef.current = requestAnimationFrame(tick);
    } else {
      if (waveRef.current) cancelAnimationFrame(waveRef.current);
    }
    return () => { if (waveRef.current) cancelAnimationFrame(waveRef.current); };
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => { setDuration(audio.duration || 0); setLoading(false); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
      // Auto-advance to next song
      if (currentIndex < songs.length - 1) onChangeSong(songs[currentIndex + 1]);
    };
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentIndex, songs, onChangeSong]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { await audio.play().catch(() => {}); setPlaying(true); }
  }, [playing]);

  const seek = (val: number) => {
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const changeVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val > 0) setMuted(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  const skip = (sec: number) => {
    if (audioRef.current)
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + sec));
  };

  const prevSong = () => { if (currentIndex > 0) onChangeSong(songs[currentIndex - 1]); };
  const nextSong = () => { if (currentIndex < songs.length - 1) onChangeSong(songs[currentIndex + 1]); };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;
    audio.volume = volume;
    audio.playbackRate = speed;
    setCurrentTime(0);
    setPlaying(false);
    setLoading(true);
    const t = setTimeout(() => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audioUrl]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && e.target === document.body) { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, togglePlay]);

  const BAR_COUNT = 40;
  const waveHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const base = 0.25 + 0.55 * Math.abs(Math.sin((i / BAR_COUNT) * Math.PI * 1.5));
    const anim = playing ? 0.45 * Math.abs(Math.sin(wavePhase + i * 0.35)) : 0;
    return base + anim;
  });

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(18px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {song.audioUrl && (
        <audio ref={audioRef} src={song.audioUrl} preload="auto" crossOrigin="anonymous" />
      )}

      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)" }}
      >
        {/* Blurred cover as bg accent */}
        <div className="absolute inset-0 overflow-hidden opacity-25">
          <img src={song.cover} alt="" className="w-full h-full object-cover scale-150"
            style={{ filter: "blur(40px) saturate(2)" }} />
        </div>

        {/* Top drag indicator (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-4 pb-0">
          <button onClick={onClose}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <ChevronDown className="size-4 text-white" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Now Streaming</p>
            <p className="text-xs text-white/70 font-medium truncate max-w-[200px]">{song.category}</p>
          </div>
          <a
            href={song.audioUrl}
            download={song.audioUrl ? `${song.title}.${getExt(song.audioUrl, "MP3").toLowerCase()}` : undefined}
            className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            title="Download"
          >
            <Download className="size-3.5 text-white/70" />
          </a>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-6 py-5 space-y-5">
          {/* Cover + Info */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0 size-28 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
              <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
              {playing && (
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/40"
                  style={{ animation: "pulse-ring 2s ease-in-out infinite" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-xl leading-tight line-clamp-2"
                style={{ fontFamily: "Sora, ui-sans-serif" }}>{song.title}</h2>
              <p className="text-white/55 text-sm mt-1">{song.artist}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/20">
                  {song.category}
                </span>
                {song.quality && (
                  <span className="text-[10px] text-white/30">{song.quality}</span>
                )}
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div className="flex items-end gap-[2px] h-10">
            {waveHeights.map((h, i) => {
              const isPlayed = i / BAR_COUNT < (progress / 100);
              return (
                <div key={i} className="flex-1 rounded-full transition-none"
                  style={{
                    height: `${Math.max(10, h * 40)}px`,
                    background: isPlayed
                      ? "linear-gradient(to top, #f59e0b, #fcd34d)"
                      : "rgba(255,255,255,0.12)",
                    opacity: playing ? 1 : 0.6,
                  }}
                />
              );
            })}
          </div>

          {/* Seek bar */}
          <div className="space-y-1">
            <div className="relative h-1.5 rounded-full overflow-hidden cursor-pointer bg-white/15"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                seek(pct * duration);
              }}
            >
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-none"
                style={{ width: `${progress}%` }} />
              <div className="absolute inset-y-0 -translate-y-[2px] top-0 size-3 rounded-full bg-white shadow-md transition-none"
                style={{ left: `calc(${progress}% - 6px)` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/35 font-medium">
              <span>{fmtTime(currentTime)}</span>
              <span>{fmtTime(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={prevSong} disabled={currentIndex === 0}
              className="text-white/50 hover:text-white disabled:opacity-25 transition-colors">
              <SkipBack className="size-5" />
            </button>
            <button onClick={() => skip(-10)}
              className="text-white/50 hover:text-white transition-colors text-[10px] font-bold flex flex-col items-center gap-0.5">
              <SkipBack className="size-4" />
            </button>

            <button onClick={togglePlay}
              disabled={loading && !song.audioUrl}
              className="size-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
              {loading ? (
                <span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : playing ? (
                <Pause className="size-6 text-white" />
              ) : (
                <Play className="size-6 text-white ml-0.5" />
              )}
            </button>

            <button onClick={() => skip(10)}
              className="text-white/50 hover:text-white transition-colors">
              <SkipForward className="size-4" />
            </button>
            <button onClick={nextSong} disabled={currentIndex === songs.length - 1}
              className="text-white/50 hover:text-white disabled:opacity-25 transition-colors">
              <SkipForward className="size-5" />
            </button>
          </div>

          {/* Volume + Speed */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors">
                  {muted || volume === 0 ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                </button>
                <span className="text-[10px] text-white/35 font-semibold uppercase tracking-widest">Volume</span>
              </div>
              <div className="relative h-1 rounded-full bg-white/15 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  changeVolume((e.clientX - rect.left) / rect.width);
                }}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/70"
                  style={{ width: `${(muted ? 0 : volume) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Gauge className="size-3.5 text-white/40" />
                <span className="text-[10px] text-white/35 font-semibold uppercase tracking-widest">Speed</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {speeds.map((s) => (
                  <button key={s} onClick={() => changeSpeed(s)}
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold transition-all"
                    style={{
                      background: speed === s ? "rgba(245,158,11,0.85)" : "rgba(255,255,255,0.08)",
                      color: speed === s ? "#fff" : "rgba(255,255,255,0.4)",
                    }}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO PLAYER MODAL
// ─────────────────────────────────────────────────────────────────────────────

function VideoPlayerModal({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(20px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 ring-1 ring-white/10">
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 size-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition-all">
          <X className="size-4 text-white" />
        </button>
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black">{video.category}</span>
        </div>
        <video ref={videoRef} src={video.videoUrl} poster={video.cover} controls
          className="w-full aspect-video bg-black" style={{ maxHeight: "72vh" }} />
        <div className="p-4 flex items-center justify-between gap-4 border-t border-white/8">
          <div>
            <h3 className="font-bold text-white text-sm">{video.title}</h3>
            <p className="text-white/40 text-xs mt-0.5">{video.duration} · {video.category}</p>
          </div>
          {video.videoUrl && (
            <a href={video.videoUrl}
              download={`${video.title}.${getExt(video.videoUrl, "MP4").toLowerCase()}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/18 text-white/60 transition-all">
              <Download className="size-3.5" /> Download {getExt(video.videoUrl, "Video")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BARS  (playing indicator for track rows)
// ─────────────────────────────────────────────────────────────────────────────

function PlayingBars() {
  return (
    <div className="flex items-end gap-[2px] h-3.5 w-3.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-1 rounded-sm bg-amber-400"
          style={{ animation: `playing-bar ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.1}s`, height: "60%" }} />
      ))}
      <style>{`
        @keyframes playing-bar {
          from { height: 30%; }
          to { height: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK ROW  (Spotify-style numbered list row)
// ─────────────────────────────────────────────────────────────────────────────

function TrackRow({ song, index, isPlaying, isActive, onStream, onDownload }: {
  song: Song;
  index: number;
  isPlaying: boolean;
  isActive: boolean;
  onStream: () => void;
  onDownload: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group grid items-center gap-4 px-4 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-150"
      style={{
        gridTemplateColumns: "28px 40px 1fr auto auto",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      }}
      onClick={onStream}
    >
      {/* Track # / Play icon */}
      <div className="flex items-center justify-center w-7 shrink-0">
        {hovered ? (
          isPlaying ? (
            <button onClick={(e) => { e.stopPropagation(); onStream(); }}
              className="text-amber-400">
              <Pause className="size-3.5" />
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onStream(); }}
              className="text-white">
              <Play className="size-3.5 ml-0.5" />
            </button>
          )
        ) : isActive && isPlaying ? (
          <PlayingBars />
        ) : (
          <span className={`text-sm font-medium tabular-nums ${isActive ? "text-amber-400" : "text-white/40"}`}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Cover thumbnail */}
      <div className="relative size-10 rounded-md overflow-hidden shrink-0 shadow-md">
        <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
      </div>

      {/* Title + Artist */}
      <div className="min-w-0">
        <div className={`font-semibold text-sm truncate leading-tight ${isActive ? "text-amber-400" : "text-white"}`}>
          {song.title}
        </div>
        <div className="text-xs text-white/45 truncate mt-0.5">{song.artist}</div>
      </div>

      {/* Category badge */}
      <span className="hidden sm:inline shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-white/8 text-white/40">
        {song.category}
      </span>

      {/* Duration + Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {hovered && song.audioUrl && (
          <a href={song.audioUrl}
            download={`${song.title}.${getExt(song.audioUrl, "mp3").toLowerCase()}`}
            onClick={(e) => e.stopPropagation()}
            className="text-white/40 hover:text-white transition-colors"
            title={`Download ${getExt(song.audioUrl, "Audio")}`}>
            <Download className="size-3.5" />
          </a>
        )}
        <span className="text-xs text-white/35 tabular-nums font-medium w-8 text-right">
          {song.duration}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO CARD  (YouTube-style)
// ─────────────────────────────────────────────────────────────────────────────

function VideoCard({ video, index, onWatch }: {
  video: VideoItem;
  index: number;
  onWatch: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatedSection delay={index * 50} animation="fade-up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-3 shadow-lg"
          onClick={onWatch}>
          <img src={video.cover} alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ opacity: hovered ? 0.75 : 0.9 }} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Play button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
            <div className="size-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
              <Play className="size-5 text-zinc-900 ml-0.5" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-medium backdrop-blur">
            {video.duration}
          </div>

          {/* Category badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/95 text-black text-[9px] font-bold uppercase tracking-wider">
            {video.category}
          </div>
        </div>

        {/* Info row */}
        <div className="flex items-start gap-3 px-1">
          <div className="shrink-0 size-9 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/10">
            <img src={video.cover} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
              {video.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-white/40 text-xs">Wellstar Bright</p>
              {video.videoUrl && (
                <a href={video.videoUrl}
                  download={`${video.title}.${getExt(video.videoUrl, "mp4").toLowerCase()}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/25 hover:text-white/70 transition-colors"
                  title={`Download ${getExt(video.videoUrl, "Video")}`}>
                  <Download className="size-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<"music" | "videos" | "events">("music");
  const [data, setData] = useState<{ songs: Song[]; videos: VideoItem[]; events: any[] } | null>(null);
  const [publicNotices, setPublicNotices] = useState<any[]>([]);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicFilter, setMusicFilter] = useState("All");
  const [videoFilter, setVideoFilter] = useState("All");

  useEffect(() => {
    Promise.all([getMediaContent(), getPublicNotices()]).then(([mediaData, noticesData]) => {
      setData(mediaData);
      setPublicNotices(noticesData || []);
    });
  }, []);

  const handleStream = (song: Song) => {
    setActiveSong(song);
    setActiveAudioId(song.id);
    setIsAudioPlaying(true);
  };

  const handleChangeSong = (song: Song) => {
    setActiveSong(song);
    setActiveAudioId(song.id);
    setIsAudioPlaying(true);
  };

  const handleClosePlayer = () => {
    setActiveSong(null);
    setIsAudioPlaying(false);
  };

  if (!data) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="size-10 rounded-full border-3 border-amber-500/30 border-t-amber-500 animate-spin" />
      <p className="text-white/50 text-sm font-medium">Loading Media Hub…</p>
    </div>
  );

  const songCategories = ["All", ...Array.from(new Set(data.songs.map((s) => s.category)))];
  const videoCategories = ["All", ...Array.from(new Set(data.videos.map((v) => v.category)))];
  const filteredSongs = musicFilter === "All" ? data.songs : data.songs.filter((s) => s.category === musicFilter);
  const filteredVideos = videoFilter === "All" ? data.videos : data.videos.filter((v) => v.category === videoFilter);

  const totalDuration = data.songs.length * 3.5; // rough estimate in mins
  const totalHours = Math.floor(totalDuration / 60);
  const totalMins = Math.round(totalDuration % 60);

  return (
    <SiteLayout>
      {/* ─── MODALS ─── */}
      {activeSong && (
        <AudioPlayerModal
          song={activeSong}
          songs={data.songs}
          onClose={handleClosePlayer}
          onChangeSong={handleChangeSong}
        />
      )}
      {activeVideo && (
        <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MEDIA HUB — dark themed section                            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #111827 100%)", minHeight: "100vh" }}>

        {/* ── HERO HEADER ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden">
          {/* Background art */}
          {data.songs[0] && (
            <div className="absolute inset-0">
              <img src={data.songs[0].cover} alt="" className="w-full h-full object-cover"
                style={{ filter: "blur(60px) saturate(1.8) brightness(0.3)", transform: "scale(1.2)" }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.92) 70%, #0d1117 100%)" }} />
            </div>
          )}

          <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-16 pb-12">
            {/* Label */}
            <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">
              🎵 Wellstar Bright
            </p>
            <h1 className="text-white font-display font-black text-5xl md:text-7xl leading-none mb-4">
              Media Hub
            </h1>
            <p className="text-white/50 text-sm max-w-md mb-6">
              Official music, videos, and event recordings from Wellstar Bright Secondary School.
              Stream or download in full quality.
            </p>

            {/* Playlist meta row */}
            <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Music className="size-3.5 text-amber-400" />
                {data.songs.length} tracks
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Video className="size-3.5 text-amber-400" />
                {data.videos.length} videos
              </span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-400" />
                About {totalHours > 0 ? `${totalHours}h ` : ""}{totalMins} min
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => data.songs[0] && handleStream(data.songs[0])}
                className="flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
                <Play className="size-4 fill-current" /> Play All
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white/80 border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all">
                <Shuffle className="size-4" /> Shuffle
              </button>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ──────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 px-6 sm:px-10 lg:px-16 py-0 border-b border-white/8"
          style={{ background: "rgba(13,17,23,0.92)", backdropFilter: "blur(20px)" }}>
          <div className="flex gap-0">
            {([
              { id: "music", label: "Music", icon: Music },
              { id: "videos", label: "Videos", icon: Video },
              { id: "events", label: "Events", icon: ImageIcon },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all"
                style={{
                  borderBottomColor: activeTab === id ? "#f59e0b" : "transparent",
                  color: activeTab === id ? "#f59e0b" : "rgba(255,255,255,0.45)",
                }}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MUSIC TAB ────────────────────────────────────────────── */}
        {activeTab === "music" && (
          <div className="px-4 sm:px-6 lg:px-10 py-6 pb-32 max-w-5xl mx-auto">

            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap mb-6 px-2">
              {songCategories.map((cat) => (
                <button key={cat} onClick={() => setMusicFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: musicFilter === cat ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.07)",
                    color: musicFilter === cat ? "#000" : "rgba(255,255,255,0.55)",
                    border: musicFilter === cat ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Table header */}
            <div className="grid items-center gap-4 px-4 pb-2 border-b border-white/8 mb-2 text-white/30 text-xs font-semibold uppercase tracking-widest"
              style={{ gridTemplateColumns: "28px 40px 1fr auto auto" }}>
              <span className="text-center">#</span>
              <span />
              <span>Title</span>
              <span className="hidden sm:block">Category</span>
              <Clock className="size-3.5 ml-auto" />
            </div>

            {/* Track list */}
            <div className="space-y-0.5">
              {filteredSongs.map((song, i) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={i}
                  isActive={activeAudioId === song.id}
                  isPlaying={activeAudioId === song.id && isAudioPlaying}
                  onStream={() => handleStream(song)}
                  onDownload={() => {}}
                />
              ))}
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-20 text-white/30">
                <Music className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No tracks in this category</p>
              </div>
            )}
          </div>
        )}

        {/* ── VIDEOS TAB ───────────────────────────────────────────── */}
        {activeTab === "videos" && (
          <div className="px-6 sm:px-10 lg:px-16 py-8 pb-32">

            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap mb-8">
              {videoCategories.map((cat) => (
                <button key={cat} onClick={() => setVideoFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: videoFilter === cat ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.07)",
                    color: videoFilter === cat ? "#000" : "rgba(255,255,255,0.55)",
                    border: videoFilter === cat ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Video grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} onWatch={() => setActiveVideo(video)} />
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-20 text-white/30">
                <Video className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No videos in this category</p>
              </div>
            )}
          </div>
        )}

        {/* ── EVENTS TAB ───────────────────────────────────────────── */}
        {activeTab === "events" && (
          <div className="px-6 sm:px-10 lg:px-16 py-8 pb-32 space-y-12">

            {/* Upcoming notices */}
            {publicNotices.length > 0 && (
              <div>
                <h2 className="text-white font-display font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  Upcoming Events
                  <span className="text-sm font-normal text-white/35 ml-1">{publicNotices.length} active</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {publicNotices.map((notice, i) => (
                    <AnimatedSection key={notice.id || i} delay={i * 55} animation="fade-up">
                      <div className="rounded-2xl overflow-hidden border border-white/8 bg-white/4 hover:bg-white/7 transition-all group">
                        {notice.mediaUrl && (
                          <div className="aspect-video overflow-hidden">
                            <img src={notice.mediaUrl} alt={notice.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => (e.currentTarget.style.display = "none")} />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/20">
                              {notice.category || notice.type}
                            </span>
                            <span className="text-xs text-white/30">{notice.date}</span>
                          </div>
                          <h3 className="text-white font-bold text-base mb-2 leading-snug">{notice.title}</h3>
                          {(notice.eventDate || notice.location) && (
                            <div className="space-y-1 mb-3 p-2.5 rounded-lg bg-white/5 text-xs text-white/50">
                              {notice.eventDate && <div>📅 <span className="text-white/70">{notice.eventDate}</span></div>}
                              {notice.location && <div>📍 <span className="text-white/70">{notice.location}</span></div>}
                            </div>
                          )}
                          <p className="text-xs text-white/40 leading-relaxed line-clamp-3">{notice.content}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}

            {/* Event gallery */}
            <div>
              <h2 className="text-white font-display font-bold text-2xl mb-6 flex items-center gap-3">
                <ImageIcon className="size-5 text-amber-400" />
                Event Gallery
                <span className="text-sm font-normal text-white/35 ml-1">{data.events.length} events</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.events.map((event: any, i: number) => (
                  <AnimatedSection key={event.id || event.title} delay={i * 55} animation="fade-up">
                    <div className="group rounded-2xl overflow-hidden border border-white/8 bg-white/4 hover:bg-white/7 transition-all cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={event.cover} alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-white/50 text-xs mb-1">{event.date}</p>
                          <h3 className="text-white font-bold text-sm leading-snug">{event.title}</h3>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{event.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER CTA ───────────────────────────────────────────── */}
        <div className="relative border-t border-white/8 px-6 sm:px-10 lg:px-16 py-16 text-center"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          <Award className="mx-auto size-8 text-amber-400 mb-4" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          <h2 className="text-white font-display font-bold text-2xl md:text-3xl mb-3">
            Need media for a <span className="text-amber-400">project?</span>
          </h2>
          <p className="text-white/45 text-sm max-w-md mx-auto mb-7">
            Contact the Wellstar Bright media team for high-resolution downloads, B-roll footage,
            and music licensing. We deliver fast Uganda-wide.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-black transition-all hover:scale-105 shadow-xl"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
            Contact Media Team
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
