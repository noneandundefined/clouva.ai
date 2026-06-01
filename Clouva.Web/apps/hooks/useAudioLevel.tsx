import { useEffect, useState } from 'react';

export const useAudioLevel = (isRecording: boolean) => {
	const [level, setLevel] = useState(0);

	useEffect(() => {
		if (!isRecording) {
			setLevel(0);
			return;
		}

		let rafId = 0;
		let stream: MediaStream | null = null;
		let audioContext: AudioContext | null = null;
		let cancelled = false;

		const setup = async () => {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				if (cancelled) {
					stream.getTracks().forEach((track) => track.stop());
					return;
				}

				audioContext = new AudioContext();
				if (audioContext.state === 'suspended') {
					await audioContext.resume();
				}

				const analyser = audioContext.createAnalyser();
				analyser.fftSize = 512;
				analyser.smoothingTimeConstant = 0.65;

				const source = audioContext.createMediaStreamSource(stream);
				source.connect(analyser);

				const dataArray = new Uint8Array(analyser.frequencyBinCount);

				const tick = () => {
					if (cancelled) return;

					analyser.getByteFrequencyData(dataArray);

					let peak = 0;
					for (let i = 0; i < dataArray.length; i++) {
						if (dataArray[i] > peak) {
							peak = dataArray[i];
						}
					}

					// 0–255 → 0–100 with gain so quiet speech still moves the bars
					const normalized = peak / 255;
					const amplified = Math.min(100, Math.pow(normalized, 0.55) * 140);

					setLevel(amplified);
					rafId = requestAnimationFrame(tick);
				};

				tick();
			} catch {
				setLevel(0);
			}
		};

		void setup();

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			stream?.getTracks().forEach((track) => track.stop());
			void audioContext?.close();
			setLevel(0);
		};
	}, [isRecording]);

	return level;
};
