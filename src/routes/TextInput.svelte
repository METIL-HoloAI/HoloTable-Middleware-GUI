<script lang="ts">
	import { ws } from '$lib/websocket';
	import { GlobalState } from '$lib';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { SendHorizontalIcon } from '@lucide/svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	const gs = new GlobalState();

	const keydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onsubmit();
		}
	};

	const onsubmit = () => {
		if (gs.prompt === '') {
			toast.error('Prompt is currently empty.');
		} else {
			gs.submit();
			sendText();
			toast.success('Prompt has been sent.');
		}
	};
	let lastPrompt = '';

	const onReset = () => {
		if (gs.prompt === '') {
			toast.error('Prompt is currently empty.');
		} else {
			// cache the current prompt to lastPrompt for the case of the user wanting to undo the clearing
			lastPrompt = gs.prompt;
			gs.reset();
			toast.success('Prompt has been cleared.', {
				action: {
					label: 'Undo',
					onClick: () => {
						console.info('Undo');
						gs.prompt = lastPrompt;
					}
				}
			});
		}
	};

	function sendText(): void {
		ws.subscribe((socket) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(gs.prompt);
				gs.prompt = '';
			}
		});
	}
</script>

<div>
	<Card.Content class="p-6">
		<form {onsubmit} class="space-y-3" in:fade={{ duration: 200 }}>
			<div class="relative items-center space-x-2">
				<Textarea
					placeholder="Enter a prompt for the HoloTable here."
					id="message-2"
					bind:value={gs.prompt}
					on:keypress={keydown}
				/>
				<Button
					type="submit"
					class="absolute right-2 bottom-2 w-min rounded-full text-white bg-slate-800 transition-all duration-200 hover:bg-slate-700"
				>
					<SendHorizontalIcon />
				</Button>
			</div>
			<div class="flex justify-end">
				<Button
					onclick={onReset}
					class="md:w-1/3  w-1/2 bg-red-900/75 hover:bg-red-800/75 text-white transition-all duration-200"
				>
					Clear
				</Button>
			</div>
		</form>
	</Card.Content>
</div>
