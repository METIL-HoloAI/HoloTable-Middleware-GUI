<script lang="ts">
	import { browser } from '$app/environment';
	import { ws, connectWebsocket } from '$lib/websocket';
	import { get } from 'svelte/store';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	let RecordRTC: any;
	if (browser) {
		import('recordrtc')
			.then((module) => {
				RecordRTC = module.default || module;
			})
			.catch((err: Error) => {
				console.error('Error loading RecordRTC:', err);
			});
	}

	let audioContext: AudioContext | null = null;
	let mediaStream: MediaStream | null = null;
	let scriptProcessor: ScriptProcessorNode | null = null;
	let keyword: string;

	async function fetchKeyword() {
		try {
			const response = await fetch(`http://localhost:8000/config/keyword`, {
				method: 'GET'
			});
			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}
			keyword = await response.text();
			return true;
		} catch (error) {
			console.error('Error fetching keyword:', error);
			keyword = 'Failed to fetch keyword. Is the go server running?';
			return false;
		}
	}

	onMount(() => {
		fetchKeyword();
	});

	function startRecording(): void {
		if (!browser) return;

		// Establish the connection from the library.
		connectWebsocket();
		// Wait a short moment to ensure the connection is set
		setTimeout(() => {
			const socket = get(ws);
			if (!socket) {
				console.error('WebSocket not connected');
				return;
			}
			// Attach message and error handlers
			socket.onmessage = (event: MessageEvent) => {
				try {
					if (typeof event.data === 'string') {
						const message = event.data;
						console.log('Received message:', message);
						if (message === 'Keyword Detected') {
							console.log('Wake word detected!');
							alert('Wake word detected!');
						}
					}
				} catch (e) {
					console.error('Error parsing message:', e);
				}
			};

			socket.onerror = (error: Event) => {
				console.error('WebSocket error:', error);
			};
		}, 100);

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream: MediaStream) => {
				mediaStream = stream;

				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				console.log('Audio context sample rate:', audioContext.sampleRate);

				const source = audioContext.createMediaStreamSource(stream);
				scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

				source.connect(scriptProcessor);
				scriptProcessor.connect(audioContext.destination);

				scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
					const socket = get(ws);
					if (socket && socket.readyState === WebSocket.OPEN && audioContext) {
						const inputData = e.inputBuffer.getChannelData(0);
						const factor = Math.round(audioContext.sampleRate / 16000);
						const downsampledLength = Math.floor(inputData.length / factor);
						const downsampled = new Float32Array(downsampledLength);

						for (let i = 0; i < downsampledLength; i++) {
							downsampled[i] = inputData[i * factor];
						}

						const pcmData = new Int16Array(downsampled.length);
						for (let i = 0; i < downsampled.length; i++) {
							const s = Math.max(-1, Math.min(1, downsampled[i]));
							pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
						}

						socket.send(pcmData.buffer);
					}
				};
			})
			.catch((err: Error) => {
				console.error('Error accessing microphone:', err);
			});
	}

	function stopRecording(): void {
		if (scriptProcessor) {
			scriptProcessor.disconnect();
			scriptProcessor = null;
		}

		if (audioContext) {
			audioContext
				.close()
				.then(() => {
					console.log('AudioContext closed');
				})
				.catch((err: Error) => {
					console.error('Error closing AudioContext:', err);
				});
			audioContext = null;
		}

		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
			mediaStream = null;
		}

		// Close the global WebSocket
		const socket = get(ws);
		if (socket) {
			socket.close();
		}
	}
</script>

<div>
	<Card.Content class="p-6">
		<p class="text-white">Keyword: <b>{keyword}</b></p>
		<div class="flex flex-row gap-10 mt-4">
			<Button onclick={startRecording}>Start Listening</Button>
			<Button onclick={stopRecording}>Stop Listening</Button>
		</div>
	</Card.Content>
</div>
