import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  mediaStream?: MediaStream | null;
  height?: number;
  barColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  isSpeaking,
  mediaStream,
  height = 54,
  barColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!isActive || !mediaStream) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const render = () => {
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          const barHeight = Math.max(4, (val / 255) * canvas.height * 0.9);

          // Emerald gradient
          const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#176B50');
          gradient.addColorStop(1, '#45B58B');

          canvasCtx.fillStyle = barColor || gradient;
          canvasCtx.beginPath();
          canvasCtx.roundRect(
            x,
            canvas.height - barHeight,
            Math.max(2, barWidth - 2),
            barHeight,
            2
          );
          canvasCtx.fill();

          x += barWidth;
        }

        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();
    } catch (err) {
      console.warn('AudioVisualizer setup error:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isActive, mediaStream, barColor]);

  // Synthetic smooth fallback animation when isActive but no raw stream (e.g. interviewer speaking)
  useEffect(() => {
    if (mediaStream) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    let step = 0;
    const renderSynthetic = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        let heightMultiplier = 0.2;
        if (isActive || isSpeaking) {
          const wave = Math.sin(step * 0.12 + i * 0.4) * 0.5 + 0.5;
          heightMultiplier = 0.25 + wave * (isSpeaking ? 0.65 : 0.4);
        }

        const barHeight = Math.max(4, canvas.height * heightMultiplier);

        const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#176B50');
        gradient.addColorStop(1, '#27966F');

        canvasCtx.fillStyle = barColor || gradient;
        canvasCtx.beginPath();
        canvasCtx.roundRect(
          i * barWidth + 2,
          (canvas.height - barHeight) / 2,
          Math.max(2, barWidth - 4),
          barHeight,
          2
        );
        canvasCtx.fill();
      }

      step++;
      animationFrameRef.current = requestAnimationFrame(renderSynthetic);
    };

    renderSynthetic();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isSpeaking, mediaStream, barColor]);

  return (
    <div className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#F8F5ED]/60 dark:bg-[#14251F]/60 p-2 border border-[#176B50]/15 dark:border-[#27966F]/20">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-full max-w-md block"
      />
    </div>
  );
};
