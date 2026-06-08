import i18next from 'i18next';
import { basicTextRewrite } from '@/rest/textAPI';
import { notify } from '@/components/Notification/notify';
import { useCallback, useEffect, useRef, useState } from 'react';

const getSpeechRecognitionCtor = () => window.SpeechRecognition ?? window.webkitSpeechRecognition;

const RESTART_DELAY_MS = 250;

export const useSpeechToText = (lang = 'ru-RU') => {
	const [text, setText] = useState<string>('');
	const [isRecording, setIsRecording] = useState<boolean>(false);

	const isRecordingRef = useRef(false);
	const committedTranscriptRef = useRef('');
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const networkFailCountRef = useRef(0);

	const [loadingRewrite, setLoadingRewrite] = useState<boolean>(false);

	const clearRestartTimer = () => {
		if (restartTimerRef.current !== null) {
			clearTimeout(restartTimerRef.current);
			restartTimerRef.current = null;
		}
	};

	const scheduleRecognitionRestart = useCallback((recognition: SpeechRecognition) => {
		clearRestartTimer();

		restartTimerRef.current = setTimeout(() => {
			if (!isRecordingRef.current || recognitionRef.current !== recognition) {
				return;
			}

			try {
				recognition.start();
			} catch {
				/* session may still be active */
			}
		}, RESTART_DELAY_MS);
	}, []);

	const handleRewrite = async (rawText: string) => {
		const trimmed = rawText.trim();
		if (!trimmed) {
			return;
		}

		try {
			setLoadingRewrite(true);

			const response = await basicTextRewrite(trimmed);
			setText(response);
		} finally {
			setLoadingRewrite(false);
		}
	};

	useEffect(() => {
		isRecordingRef.current = isRecording;
	}, [isRecording]);

	const attachRecognitionHandlers = useCallback(
		(recognition: SpeechRecognition) => {
			recognition.onresult = (event: SpeechRecognitionEvent) => {
				networkFailCountRef.current = 0;

				let interim = '';

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const part = event.results[i][0].transcript;

					if (event.results[i].isFinal) {
						committedTranscriptRef.current += part;
					} else {
						interim += part;
					}
				}

				const committed = committedTranscriptRef.current.trim();
				const combined = interim ? `${committed} ${interim}`.trim() : committed;
				setText(combined);
			};

			recognition.onend = () => {
				if (!isRecordingRef.current || recognitionRef.current !== recognition) {
					return;
				}

				scheduleRecognitionRestart(recognition);
			};

			recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				if (event.error === 'aborted' || event.error === 'no-speech') {
					return;
				}

				if (event.error === 'not-allowed') {
					clearRestartTimer();
					isRecordingRef.current = false;
					setIsRecording(false);
					recognitionRef.current = null;
					notify.error(i18next.t('message.microphone-denied'));
					return;
				}

				// Chrome often reports "network" when auto-restarting without a click — not missing internet.
				if (event.error === 'network' && isRecordingRef.current && recognitionRef.current === recognition) {
					networkFailCountRef.current += 1;
					scheduleRecognitionRestart(recognition);

					if (networkFailCountRef.current >= 4) {
						clearRestartTimer();
						isRecordingRef.current = false;
						setIsRecording(false);
						recognitionRef.current = null;
						notify.error(i18next.t('message.speech-network-error'));
					}

					return;
				}

				if (event.error === 'network') {
					notify.error(i18next.t('message.speech-network-error'));
				} else {
					notify.error(i18next.t('message.speech-error'));
				}

				clearRestartTimer();
				isRecordingRef.current = false;
				setIsRecording(false);
				recognitionRef.current = null;
			};
		},
		[scheduleRecognitionRestart]
	);

	const start = () => {
		const SpeechRecognition = getSpeechRecognitionCtor();

		if (!SpeechRecognition) {
			notify.error(i18next.t('message.speech-not-supported'));
			return;
		}

		if (!window.isSecureContext) {
			notify.error(i18next.t('message.speech-https-required'));
			return;
		}

		if (isRecording) return;

		clearRestartTimer();
		networkFailCountRef.current = 0;
		committedTranscriptRef.current = '';
		setText('');

		const recognition = new SpeechRecognition();
		recognition.lang = lang;
		recognition.continuous = true;
		recognition.interimResults = true;

		attachRecognitionHandlers(recognition);
		recognitionRef.current = recognition;

		try {
			recognition.start();
			setIsRecording(true);
		} catch {
			recognitionRef.current = null;
			notify.error(i18next.t('message.speech-start-failed'));
		}
	};

	const stop = async () => {
		if (!recognitionRef.current) return;

		clearRestartTimer();
		isRecordingRef.current = false;
		setIsRecording(false);

		const recognition = recognitionRef.current;
		recognitionRef.current = null;
		recognition.stop();

		const finalText = committedTranscriptRef.current.trim() || text.trim();
		setText(finalText);

		if (!finalText) {
			notify.error(i18next.t('message.speech-no-results'));
			return;
		}

		await handleRewrite(finalText);
	};

	const toggle = () => {
		if (isRecording) {
			void stop();
		} else {
			start();
		}
	};

	const reset = () => {
		committedTranscriptRef.current = '';
		setText('');
	};

	useEffect(() => {
		return () => {
			clearRestartTimer();
			isRecordingRef.current = false;
			recognitionRef.current?.stop();
			recognitionRef.current = null;
		};
	}, []);

	return { text, setText, isRecording, start, stop, toggle, reset, loadingRewrite, handleRewrite };
};
