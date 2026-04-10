import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ArrowLeft, Mic, PhoneOff, CheckCircle2 } from "lucide-react";

interface VoiceAgentProps {
  onBack: () => void;
}

export default function VoiceAgent({ onBack }: VoiceAgentProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [orbState, setOrbState] = useState<null | 'listening' | 'speaking'>(null);
  const [agentTranscript, setAgentTranscript] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  const [bookingResult, setBookingResult] = useState<{ name: string; service_type: string; urgency: string } | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  const CAPTURE_SAMPLE_RATE = 24000; 
  const PLAYBACK_SAMPLE_RATE = 16000;

  useEffect(() => {
    // Initialize Socket.IO
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('session-started', (data) => {
      console.log('Session started:', data.sessionId);
      setStatus('Connected — Listening...');
      setOrbState('listening');
    });

    socket.on('audio-delta', (data) => {
      queueAudioChunk(data.delta);
    });

    let accumulatedAgentText = '';
    socket.on('transcript-delta', (data) => {
      accumulatedAgentText += data.delta;
      setAgentTranscript(accumulatedAgentText);
    });

    socket.on('transcript-done', () => {
      accumulatedAgentText = '';
    });

    socket.on('user-transcript', (data) => {
      setUserTranscript(data.transcript);
    });

    socket.on('speech-started', () => {
      stopPlayback();
      setOrbState('listening');
      setStatus('Listening...');
      setAgentTranscript('');
      accumulatedAgentText = '';
    });

    socket.on('booking-saved', (data) => {
      setBookingResult(data);
    });

    socket.on('realtime-error', (data) => {
      console.error('Realtime error:', data.error);
      setStatus('Error: ' + (data.error?.message || 'Unknown'));
    });

    socket.on('session-closed', () => {
      handleEndSession();
    });

    return () => {
      socket.disconnect();
      stopMicrophone();
    };
  }, []);

  const queueAudioChunk = (base64: string) => {
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;

    playbackQueueRef.current.push(float32);
    if (!isPlayingRef.current) playNextChunk();
  };

  const playNextChunk = () => {
    if (playbackQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      setOrbState('listening');
      setStatus('Listening...');
      return;
    }

    isPlayingRef.current = true;
    setOrbState('speaking');
    setStatus('Agent speaking...');

    const samples = playbackQueueRef.current.shift()!;
    const buffer = audioContextRef.current.createBuffer(1, samples.length, PLAYBACK_SAMPLE_RATE);
    
    // Using getChannelData().set() to avoid TS Float32Array compatibility issues
    buffer.getChannelData(0).set(samples);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => playNextChunk();
    source.start();
  };

  const stopPlayback = () => {
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
  };

  const startMicrophone = async () => {
    const audioContext = new AudioContext({ sampleRate: CAPTURE_SAMPLE_RATE });
    audioContextRef.current = audioContext;

    const processorCode = `
      class PCMProcessor extends AudioWorkletProcessor {
          process(inputs) {
              const input = inputs[0];
              if (input && input[0]) {
                  const float32 = input[0];
                  const pcm16 = new Int16Array(float32.length);
                  for (let i = 0; i < float32.length; i++) {
                      const s = Math.max(-1, Math.min(1, float32[i]));
                      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                  }
                  this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
              }
              return true;
          }
      }
      registerProcessor('pcm-processor', PCMProcessor);
    `;
    const blob = new Blob([processorCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await audioContext.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: CAPTURE_SAMPLE_RATE,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });
    mediaStreamRef.current = mediaStream;

    const source = audioContext.createMediaStreamSource(mediaStream);
    const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
    workletNodeRef.current = workletNode;

    workletNode.port.onmessage = (e) => {
      if (!socketRef.current) return;
      
      const pcm16 = new Uint8Array(e.data);
      let binary = '';
      for (let i = 0; i < pcm16.length; i++) {
        binary += String.fromCharCode(pcm16[i]);
      }
      const base64 = btoa(binary);
      socketRef.current.emit('audio-chunk', { audio: base64 });
    };

    source.connect(workletNode);
    workletNode.connect(audioContext.destination);
  };

  const stopMicrophone = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const handleStartSession = async () => {
    try {
      setStatus('Connecting...');
      await startMicrophone();
      setIsSessionActive(true);
      socketRef.current?.emit('start-session');
    } catch (err) {
      console.error('Failed to start:', err);
      setStatus('Microphone access denied');
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    socketRef.current?.emit('end-session');
    stopPlayback();
    stopMicrophone();
    setOrbState(null);
    setStatus('Call ended');
  };

  return (
    <div className="fixed inset-0 bg-[#03070b] text-white flex flex-col font-jakarta z-50">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      {/* NAVBAR */}
      <nav className="w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#03070b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-zinc-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">~</span>
            <span className="text-white font-black tracking-tighter uppercase text-sm">
              VOICE
            </span>
            <span className="text-orange-500 font-black tracking-tighter uppercase text-sm">
              AGENT
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        <div className="w-full max-w-lg bg-[#090e14]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl space-y-10 text-center">
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              AI Voice Assistant
            </h1>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
              Real-time Service Booking Representative
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {/* STATUS BADGE */}
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              isSessionActive 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            }`}>
              {status}
            </div>

            {/* THE ORB */}
            <div className="relative group">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
                orbState === 'listening' ? 'bg-emerald-500 scale-105 shadow-[0_0_50px_rgba(16,185,129,0.4)]' :
                orbState === 'speaking' ? 'bg-orange-500 scale-110 shadow-[0_0_60px_rgba(249,115,22,0.5)]' :
                'bg-zinc-800 scale-100 shadow-xl border border-white/5'
              }`}>
                <Mic size={40} className={`text-white transition-opacity duration-300 ${isSessionActive ? 'opacity-100' : 'opacity-40'}`} />
                
                {/* PULSE RINGS */}
                {isSessionActive && (
                  <>
                    <div className={`absolute inset-0 rounded-full border-2 animate-ping opacity-20 ${
                      orbState === 'speaking' ? 'border-orange-400' : 'border-emerald-400'
                    }`} />
                    <div className={`absolute -inset-4 rounded-full border border-white/5 ${
                      orbState === 'speaking' ? 'animate-pulse' : ''
                    }`} />
                  </>
                )}
              </div>
              
              {/* ORB GLOW EFFECT */}
              <div className={`absolute inset-0 blur-3xl opacity-20 -z-10 transition-all duration-700 ${
                orbState === 'listening' ? 'bg-emerald-500 scale-150' :
                orbState === 'speaking' ? 'bg-orange-500 scale-150' :
                'bg-transparent'
              }`} />
            </div>

            {/* CONTROLS */}
            <div className="w-full max-w-sm">
              {!isSessionActive ? (
                <button
                  onClick={handleStartSession}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-black px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:translate-y--0.5 active:scale-95 uppercase tracking-widest"
                >
                  START CONVERSATION
                </button>
              ) : (
                <button
                  onClick={handleEndSession}
                  className="w-full bg-rose-600/10 hover:bg-rose-600 border border-rose-500/30 text-rose-500 hover:text-white px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <PhoneOff size={18} />
                  END CALL
                </button>
              )}
            </div>
          </div>

          {/* TRANSCRIPTS */}
          {(userTranscript || agentTranscript) && (
            <div className="space-y-4 pt-10 border-t border-white/5 text-left">
              {agentTranscript && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400/60 ml-2">Agent</span>
                  <div className="bg-orange-500/5 border-l-2 border-orange-500 p-4 rounded-r-2xl text-sm text-zinc-300 leading-relaxed italic">
                    {agentTranscript}
                  </div>
                </div>
              )}
              
              {userTranscript && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-2">You</span>
                  <div className="bg-zinc-800/40 p-4 rounded-2xl text-sm text-zinc-400 leading-relaxed">
                    {userTranscript}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOOKING SUCCESS */}
          {bookingResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-emerald-500/20 p-3 rounded-2xl">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Booking Saved</h4>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">
                    {bookingResult.name} — {bookingResult.service_type} ({bookingResult.urgency})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER STATUS */}
      <footer className="w-full h-10 bg-black/50 border-t border-white/5 px-6 flex items-center justify-between font-mono text-[9px] font-black tracking-[0.2em] text-zinc-700">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
          {isSessionActive ? 'SESSION_ENCRYPTED_ACTIVE' : 'READY_TO_CONNECT'}
        </div>
        <div className="flex items-center gap-6">
          <span className="opacity-40">TRADIE_MOB_OS v1.0.4</span>
          <span className="text-orange-500/30">BELE.AI_CORE</span>
        </div>
      </footer>
    </div>
  );
}
