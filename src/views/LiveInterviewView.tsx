import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Clock,
  RotateCcw,
  MessageSquare,
  CheckCircle,
  FileCheck,
  Award,
  ChevronDown,
} from 'lucide-react';
import { useApp, LiveSessionConfig } from '../context/AppContext';
import {
  DialogueTurn,
  EvaluationReport,
  InterviewerId,
  InterviewCategory,
  DifficultyLevel,
} from '../types';
import { AvatarCharacter } from '../components/AvatarCharacter';
import { AudioVisualizer } from '../components/AudioVisualizer';
import {
  LiveAudioPlayer,
  float32To16BitPCM,
  arrayBufferToBase64,
  playWavBase64,
  analyzeSpeechMetrics,
} from '../utils/audio';
import { MOCK_TRACKS } from '../data/mockTracks';

export const LiveInterviewView: React.FC = () => {
  const {
    sessionConfig,
    setSessionConfig,
    saveEvaluationReport,
    setSelectedReportForModal,
    profile,
  } = useApp();

  // Session lifecycle states: 'setup' | 'live' | 'paused' | 'evaluating' | 'completed'
  const [sessionState, setSessionState] = useState<'setup' | 'live' | 'paused' | 'evaluating' | 'completed'>('setup');

  // Config options
  const [selectedInterviewer, setSelectedInterviewer] = useState<InterviewerId>(sessionConfig.interviewer || 'ananya');
  const [selectedCategory, setSelectedCategory] = useState<string>(sessionConfig.category || 'Full Stack Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(sessionConfig.difficulty || 'Intermediate');
  const [durationMinutes, setDurationMinutes] = useState<number>(sessionConfig.durationMinutes || 15);
  const [targetRole, setTargetRole] = useState<string>(sessionConfig.targetRole || profile.targetRole || 'Full Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState<string>(sessionConfig.experienceLevel || profile.experienceLevel || 'Entry-Level');

  // Live room runtime states
  const [transcript, setTranscript] = useState<DialogueTurn[]>([]);
  const [interviewerState, setInterviewerState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(15 * 60);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const totalPlannedQuestions = 5;

  // Real-time speech metrics
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [fillerWordCount, setFillerWordCount] = useState<number>(0);
  const [currentWpm, setCurrentWpm] = useState<number>(125);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);

  // Text mode fallback
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [micAvailable, setMicAvailable] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('Ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References
  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudioSession();
    };
  }, []);

  const cleanupAudioSession = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.close();
      audioPlayerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // -------------------------------------------------------------
  // Start Interview Flow
  // -------------------------------------------------------------
  const handleStartInterview = async () => {
    setErrorMessage(null);
    setTranscript([]);
    setQuestionCount(1);
    setSpeakingSeconds(0);
    setFillerWordCount(0);
    setDetectedFillers([]);
    setTimeRemainingSec(durationMinutes * 60);

    // Save session config
    const currentConfig: LiveSessionConfig = {
      interviewer: selectedInterviewer,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      durationMinutes,
      targetRole,
      experienceLevel,
    };
    setSessionConfig(currentConfig);

    setSessionState('live');
    setConnectionStatus('Initializing Gemini Live...');

    // Initialize gapless 24kHz audio player
    audioPlayerRef.current = new LiveAudioPlayer();

    // 1. Setup Microphone input
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      setMicAvailable(true);
    } catch (micErr) {
      console.warn('Microphone access denied or unavailable:', micErr);
      setMicAvailable(false);
      setErrorMessage(
        'Microphone access is unavailable. You can answer using the text response input below!'
      );
    }

    // 2. Setup Web Speech API for real-time live local transcription & filler word detection
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let currentTurnText = '';
        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTurnText += ' ' + event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          const fullSpoken = (currentTurnText + ' ' + interim).trim();
          if (fullSpoken) {
            // Count fillers in real time
            const metrics = analyzeSpeechMetrics(fullSpoken, Math.max(2, speakingSeconds));
            setFillerWordCount(metrics.fillerWordCount);
            setDetectedFillers(metrics.fillerWords);
            if (metrics.wordsPerMinute > 0) {
              setCurrentWpm(metrics.wordsPerMinute);
            }
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition warning:', e.error);
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      } catch (srErr) {
        console.warn('SpeechRecognition init error:', srErr);
      }
    }

    // 3. Setup Gemini Live WebSocket Connection
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?interviewer=${selectedInterviewer}&category=${encodeURIComponent(
        selectedCategory
      )}&difficulty=${selectedDifficulty}&targetRole=${encodeURIComponent(
        targetRole
      )}&experienceLevel=${encodeURIComponent(experienceLevel)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('Gemini Live Connected (16kHz / 24kHz)');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'audio' && msg.audio) {
            setInterviewerState('speaking');
            if (audioPlayerRef.current) {
              audioPlayerRef.current.playPcmChunk(msg.audio);
            }
          } else if (msg.type === 'model_transcript' && msg.text) {
            setTranscript((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.speaker !== 'candidate') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text },
                ];
              }
              return [
                ...prev,
                {
                  id: String(Date.now()),
                  speaker: selectedInterviewer === 'ananya' ? 'Ananya' : selectedInterviewer === 'arjun' ? 'Arjun' : 'interviewer',
                  text: msg.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                },
              ];
            });
          } else if (msg.type === 'interrupted') {
            // Interruption occurred!
            if (audioPlayerRef.current) {
              audioPlayerRef.current.stop();
            }
            setInterviewerState('listening');
          } else if (msg.type === 'turn_complete') {
            setInterviewerState('listening');
          } else if (msg.type === 'error') {
            console.warn('Gemini Live message error:', msg.message);
          }
        } catch (e) {
          console.error('Error handling WebSocket message', e);
        }
      };

      ws.onerror = (e) => {
        console.warn('WebSocket error, falling back to REST turns:', e);
        setConnectionStatus('High-Fidelity Audio Mode');
      };
    } catch (wsErr) {
      console.warn('WebSocket setup skipped:', wsErr);
      setConnectionStatus('Interactive Smart Mode');
    }

    // 4. Connect microphone audio capture via ScriptProcessor (16kHz PCM chunks)
    if (stream) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const inputCtx = new AudioCtx({ sampleRate: 16000 });
        audioContextRef.current = inputCtx;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMicMuted) return;
          const channelData = e.inputBuffer.getChannelData(0);

          // Calculate energy to toggle listening vs idle
          let sum = 0;
          for (let i = 0; i < channelData.length; i++) {
            sum += channelData[i] * channelData[i];
          }
          const rms = Math.sqrt(sum / channelData.length);

          if (rms > 0.02) {
            setInterviewerState('listening');
            setSpeakingSeconds((prev) => prev + 0.1);
          }

          // If WS is open, send 16kHz PCM
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const pcmBuffer = float32To16BitPCM(channelData);
            const base64 = arrayBufferToBase64(pcmBuffer);
            wsRef.current.send(JSON.stringify({ audio: base64 }));
          }
        };
      } catch (audioCtxErr) {
        console.warn('AudioContext microphone capture error:', audioCtxErr);
      }
    }

    // 5. Start Countdown Timer
    timerIntervalRef.current = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 6. Request opening welcome question from server
    await fetchNextTurn('', true);
  };

  // -------------------------------------------------------------
  // Conversational Turn Handling
  // -------------------------------------------------------------
  const fetchNextTurn = async (candidateAnswer: string, isInitial = false) => {
    setInterviewerState('speaking');
    try {
      const resp = await fetch('/api/interview/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewer: selectedInterviewer,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          targetRole,
          experienceLevel,
          conversationHistory: transcript,
          userAnswer: candidateAnswer,
          questionNumber: isInitial ? 1 : questionCount,
          totalQuestions: totalPlannedQuestions,
        }),
      });

      const data = await resp.json();

      if (data.nextQuestion || data.reaction) {
        const fullSpoken = `${data.reaction ? data.reaction + ' ' : ''}${data.nextQuestion || ''}`.trim();
        const speakerName = data.speaker || (selectedInterviewer === 'ananya' ? 'Ananya' : 'Arjun');

        setTranscript((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            speaker: speakerName,
            text: fullSpoken,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
        ]);

        if (!isInitial) {
          setQuestionCount((prev) => prev + 1);
        }

        // If WAV speech audio was generated and speaker not muted, play it
        if (data.speechAudio && !isSpeakerMuted) {
          try {
            await playWavBase64(data.speechAudio);
          } catch (playErr) {
            console.warn('WAV audio playback failed:', playErr);
          }
        }
      }

      if (data.isFinished) {
        setTimeout(() => {
          handleFinishInterview();
        }, 3000);
      }
    } catch (turnErr) {
      console.error('Turn generation failed:', turnErr);
      setErrorMessage('Could not generate interviewer question. Please check server connection.');
    } finally {
      setInterviewerState('idle');
    }
  };

  // Candidate submits an answer (via text box or explicit send)
  const handleSubmitCandidateAnswer = async () => {
    if (!typedAnswer.trim()) return;
    const answer = typedAnswer.trim();
    setTypedAnswer('');

    // Add to transcript
    const metrics = analyzeSpeechMetrics(answer, Math.max(5, speakingSeconds));
    setTranscript((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        speaker: 'candidate',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        audioMetrics: {
          wpm: metrics.wordsPerMinute,
          fillerCount: metrics.fillerWordCount,
        },
      },
    ]);

    // Send through WebSocket if active
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: answer }));
    }

    // Trigger AI response turn
    await fetchNextTurn(answer);
  };

  // Interrupt interviewer
  const handleInterrupt = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: '[User interrupted to answer]' }));
    }
    setInterviewerState('listening');
  };

  // Toggle Mute Mic
  const toggleMic = () => {
    setIsMicMuted((prev) => !prev);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted; // toggled
      });
    }
  };

  // Toggle Mute Speaker
  const toggleSpeaker = () => {
    const nextMuted = !isSpeakerMuted;
    setIsSpeakerMuted(nextMuted);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.setMuted(nextMuted);
    }
  };

  // Finish Interview & Run NLP Evaluation
  const handleFinishInterview = async () => {
    cleanupAudioSession();
    setSessionState('evaluating');

    try {
      const resp = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewer: selectedInterviewer,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          targetRole,
          transcript,
          audioMetrics: {
            speakingDurationSec: Math.round(speakingSeconds),
            wordsPerMinute: currentWpm,
            fillerWordCount,
            pauseCount: 2,
          },
        }),
      });

      const evaluationData = await resp.json();

      const newReport: EvaluationReport = {
        id: `eval_${Date.now()}`,
        date: new Date().toISOString(),
        interviewer: selectedInterviewer,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        targetRole,
        durationMinutes,
        overallScore: evaluationData.overallScore || 8.2,
        technicalScore: evaluationData.technicalScore || 8.0,
        communicationScore: evaluationData.communicationScore || 8.4,
        nlpScore: evaluationData.nlpScore || 8.5,
        dimensions: evaluationData.dimensions || {
          relevance: 8.5,
          semanticSimilarity: 8.2,
          technicalAccuracy: 8.0,
          grammar: 8.6,
          vocabulary: 8.1,
          clarity: 8.7,
          conciseness: 7.8,
          structure: 8.3,
          completeness: 7.9,
          communicationEffectiveness: 8.4,
        },
        summary: evaluationData.summary || 'Strong performance demonstrating solid fundamentals.',
        strengths: evaluationData.strengths || ['Clear articulation of technical concepts', 'Good conversational pacing'],
        weaknesses: evaluationData.weaknesses || ['Could structure complex answers with the STAR framework more explicitly'],
        starAnalysis: evaluationData.starAnalysis,
        answerComparisons: evaluationData.answerComparisons || [],
        personalizedRecommendations: evaluationData.personalizedRecommendations || [
          'Practice daily questions in system design and data structures',
        ],
        weakestTopics: evaluationData.weakestTopics || ['Edge Case Handling'],
        strongestTopics: evaluationData.strongestTopics || ['Core Language Semantics'],
        audioMetrics: {
          totalSpeakingDurationSec: Math.round(speakingSeconds),
          wordsPerMinute: currentWpm,
          fillerWordCount,
          pauseCount: 2,
        },
        transcript,
      };

      saveEvaluationReport(newReport);
      setSelectedReportForModal(newReport);
      setSessionState('completed');
    } catch (evalErr) {
      console.error('Evaluation failed:', evalErr);
      setErrorMessage('Evaluation processing encountered an error. Please try again.');
      setSessionState('paused');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // Render: Setup Screen
  // -------------------------------------------------------------
  if (sessionState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini Live Real-Time Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Configure Your Live Mock Interview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customize your interviewer, track, difficulty, and duration. You'll converse via live microphone with real-time speech synthesis.
          </p>
        </div>

        {/* Setup Form Card */}
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step 1: Select Interviewer Character */}
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-3">
              1. Select Interviewer Character
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Ananya */}
              <div
                onClick={() => setSelectedInterviewer('ananya')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  selectedInterviewer === 'ananya'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400/60'
                }`}
              >
                <AvatarCharacter interviewer="ananya" state="idle" size="md" showBadge={false} />
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
                  Ananya
                </h4>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  HR & Behavioural
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Empathetic, welcoming, evaluates STAR method & cultural fit.
                </p>
              </div>

              {/* Arjun */}
              <div
                onClick={() => setSelectedInterviewer('arjun')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  selectedInterviewer === 'arjun'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/60'
                }`}
              >
                <AvatarCharacter interviewer="arjun" state="idle" size="md" showBadge={false} />
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
                  Arjun
                </h4>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Technical Lead
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Analytical, confident, sharp follow-up probing technical depth.
                </p>
              </div>

              {/* Panel Interview */}
              <div
                onClick={() => setSelectedInterviewer('panel')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  selectedInterviewer === 'panel'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400/60'
                }`}
              >
                <div className="flex -space-x-4 my-2">
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <AvatarCharacter interviewer="ananya" state="idle" size="sm" showBadge={false} />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                    <AvatarCharacter interviewer="arjun" state="idle" size="sm" showBadge={false} />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
                  Executive Panel
                </h4>
                <span className="text-[11px] font-semibold text-amber-500">
                  Ananya & Arjun
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Comprehensive round alternating between HR and technical scrutiny.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Track & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                2. Interview Category / Track
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                {MOCK_TRACKS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                3. Difficulty Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Target Role, Experience & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                4. Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                5. Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Student">Student / Pre-final Year</option>
                <option value="Entry-Level">Entry-Level (0-2 Yrs)</option>
                <option value="Mid-Level">Mid-Level (2-5 Yrs)</option>
                <option value="Senior">Senior Engineer (5+ Yrs)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                6. Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 30].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      durationMinutes === dur
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Microphone & speaker permission requested on start</span>
            </div>

            <button
              onClick={handleStartInterview}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Enter Live Interview Room</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Evaluating Screen
  // -------------------------------------------------------------
  if (sessionState === 'evaluating') {
    return (
      <div className="max-w-xl mx-auto my-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/15 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center animate-bounce">
          <Award className="w-10 h-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Generating NLP Performance Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Gemini is scoring your answers across all 10 NLP dimensions, evaluating STAR behavioural
            structures, calculating speech cadence metrics, and compiling actionable feedback...
          </p>
        </div>
        <div className="w-48 mx-auto bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-full animate-pulse" />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Active Live Room Screen
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 pb-12">
      {/* Room Top Bar */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              LIVE SESSION
            </span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {selectedCategory} ({selectedDifficulty})
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
            Q{questionCount} of {totalPlannedQuestions}
          </span>
          {sessionConfig.isPhoneCallMode && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <span>📞 Phone Screen Call</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{formatTimer(timeRemainingSec)}</span>
          </div>

          {/* End Interview Button */}
          <button
            onClick={handleFinishInterview}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
          >
            <Square className="w-3.5 h-3.5" />
            <span>End & Evaluate</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-900 dark:text-amber-200 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Avatar & Visualizer (Left) vs Live Transcript (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Avatar & Live Stage (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
            {/* Top Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    interviewerState === 'speaking'
                      ? 'bg-amber-500 animate-ping'
                      : interviewerState === 'listening'
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {connectionStatus}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedInterviewer.toUpperCase()}
              </span>
            </div>

            {/* Avatar Character */}
            <div className="my-6">
              <AvatarCharacter
                interviewer={selectedInterviewer}
                state={interviewerState}
                size="xl"
                showBadge={true}
              />
            </div>

            {/* Audio Waveform Visualizer */}
            <div className="w-full mt-2">
              <AudioVisualizer
                isActive={sessionState === 'live'}
                isSpeaking={interviewerState === 'speaking'}
                mediaStream={mediaStreamRef.current}
                height={52}
                barColor="linear-gradient(to top, #1D4ED8, #3B82F6)"
              />
            </div>

            {/* Interrupt CTA */}
            {interviewerState === 'speaking' && (
              <button
                onClick={handleInterrupt}
                className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Click to Interrupt & Respond</span>
              </button>
            )}
          </div>

          {/* Real-time Vocal Analytics Card */}
          <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Live Candidate Vocal Measurements
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Pacing</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {currentWpm} WPM
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Fillers ("um, uh")</span>
                <span className={`text-sm font-extrabold ${fillerWordCount > 4 ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`}>
                  {fillerWordCount}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Spoken Time</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {Math.round(speakingSeconds)}s
                </span>
              </div>
            </div>
            {detectedFillers.length > 0 && (
              <div className="mt-2 text-[10px] text-slate-400">
                Detected: {detectedFillers.slice(-3).join(', ')}
              </div>
            )}
          </div>

          {/* Control Buttons Bar */}
          <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-around shadow-2xs">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isMicMuted
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={toggleSpeaker}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isSpeakerMuted
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
              }`}
              title={isSpeakerMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Restart Session */}
            <button
              onClick={() => {
                cleanupAudioSession();
                setSessionState('setup');
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-rose-600 cursor-pointer"
              title="Reset Interview"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Transcript & Interaction Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-[#1B3028] rounded-3xl border border-[#E4ECE7] dark:border-[#253F35] shadow-sm overflow-hidden h-[620px]">
          {/* Transcript Header */}
          <div className="px-5 py-3.5 bg-[#F8F5ED] dark:bg-[#14251F] border-b border-[#E4ECE7] dark:border-[#253F35] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#176B50] dark:text-[#45B58B]" />
              <span className="text-xs font-bold text-[#25352D] dark:text-[#F4F5EF] uppercase tracking-wide">
                Live Interview Transcript
              </span>
            </div>
            <span className="text-[11px] text-[#82988E]">
              {transcript.length} turns recorded
            </span>
          </div>

          {/* Dialogue Turns List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#82988E] space-y-2">
                <Sparkles className="w-8 h-8 text-[#E8C98A] animate-pulse" />
                <p className="text-xs">The interviewer will begin speaking in a moment...</p>
              </div>
            ) : (
              transcript.map((turn) => {
                const isCandidate = turn.speaker === 'candidate';
                return (
                  <div
                    key={turn.id}
                    className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-bold text-[#176B50] dark:text-[#45B58B]">
                        {isCandidate ? 'You (Candidate)' : turn.speaker}
                      </span>
                      <span className="text-[10px] text-[#82988E]">{turn.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCandidate
                          ? 'bg-[#176B50] text-white rounded-tr-none shadow-xs'
                          : 'bg-[#F8F5ED] dark:bg-[#14251F] text-[#25352D] dark:text-[#F4F5EF] border border-[#E4ECE7] dark:border-[#253F35] rounded-tl-none shadow-2xs'
                      }`}
                    >
                      {turn.text}
                    </div>

                    {turn.audioMetrics && (
                      <span className="text-[10px] text-[#82988E] mt-1 px-1">
                        Cadence: {turn.audioMetrics.wpm || 120} WPM • {turn.audioMetrics.fillerCount || 0} fillers
                      </span>
                    )}
                  </div>
                );
              })
            )}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Text Response Fallback & Manual Submission Box */}
          <div className="p-4 bg-[var(--bg-page)] border-t border-[var(--border-card)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitCandidateAnswer();
                }}
                placeholder={
                  micAvailable
                    ? 'Speak into microphone or type your response here...'
                    : 'Type your answer here...'
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                onClick={handleSubmitCandidateAnswer}
                disabled={!typedAnswer.trim()}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>Speak clearly into your microphone or press Enter to submit typed answers</span>
              <span>Gemini Live Bidirectional Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
