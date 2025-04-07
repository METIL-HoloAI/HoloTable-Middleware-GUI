<script lang="ts">
	import { GlobalState } from '$lib';
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card/index.js';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MicIcon, MicOff, MicOffIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

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

	let ws: WebSocket | null = null;
	let audioContext: AudioContext | null = null;
	let mediaStream: MediaStream | null = null;
	let scriptProcessor: ScriptProcessorNode | null = null;
	let keyword: string = '';
	const gs = new GlobalState();

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

		ws = new WebSocket('ws://localhost:8080/ws');
		ws.binaryType = 'arraybuffer';

		ws.onopen = () => {
			console.log('Connected to WebSocket server');
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream: MediaStream) => {
					mediaStream = stream;
					gs.isRecording = true;
					toast.success('Recording has started.');

					audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
					console.log('Audio context sample rate:', audioContext.sampleRate);

					const source = audioContext.createMediaStreamSource(stream);
					scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

					source.connect(scriptProcessor);
					scriptProcessor.connect(audioContext.destination);

					scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
						if (ws && ws.readyState === WebSocket.OPEN && audioContext) {
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

							ws.send(pcmData.buffer);
						}
					};
				})
				.catch((err: Error) => {
					console.error('Error accessing microphone:', err);
				});
		};

		ws.onmessage = (event: MessageEvent) => {
			try {
				if (typeof event.data === 'string') {
					const message = event.data;
					console.log('Received message:', message);
					if (message === 'Keyword detected') {
						// console.log('Wake word detected!');
						gs.keywordDetected = true;
						// alert('Wake word detected!');
						toast.success('Keyword Detected! Proceed with your prompt.', { duration: 4000 });
					}
				}
			} catch (e) {
				console.error('Error parsing message:', e);
			}
		};

		ws.onerror = (error: Event) => {
			console.error('WebSocket error:', error);
		};
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
					toast.message('Recording stopped.');
					gs.isRecording = false;
					gs.keywordDetected = false;
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

		if (ws) {
			ws.close();
			ws = null;
		}
	}
</script>

<div in:fade={{ duration: 200 }}>
	<Card.Content class="p-6">
		<p class="text-white">
			Keyword: <b>{keyword}</b>
		</p>
		<div class="flex flex-row items-center gap-10 mt-4">
			<Button onclick={startRecording}>Start Listening</Button>
			<Button onclick={stopRecording}>Stop Listening</Button>
			{#if gs.isRecording}
				<MicIcon color="#ffffff" />
			{:else if !gs.isRecording}
				<MicOffIcon color="#ff2929" />
			{/if}
		</div>
	</Card.Content>
</div>
