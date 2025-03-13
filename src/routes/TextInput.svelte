<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { SendHorizontalIcon } from '@lucide/svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';

	const gs = new GlobalState();

	$inspect(gs.prompt);

	// const onsubmit = preventDefault(() => gs.nlen && gs.submit());
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
</script>

<div>
	<Card.Content class="p-6">
		<!-- <form {onsubmit} class="space-y-3"> -->
		<form class="space-y-3">
			<div class="flex w-full max-w-sm items-center space-x-2">
				<Textarea
					placeholder="Enter a prompt for the HoloTable here."
					id="message-2"
					bind:value={gs.prompt}
				/>
				<Button
					type="submit"
					class="w-min rounded-full text-black bg-gradient-to-r from-white to-white/95 transition-opacity duration-200 hover:opacity-80"
				>
					<SendHorizontalIcon />
				</Button>
			</div>
			<Button
				onclick={onReset}
				class="w-full bg-gradient-to-r from-slate-300/50 to-slate-400/50 hover:ring-1 hover:opacity-80 transition-all duration-200"
				>Reset</Button
			>
		</form>
	</Card.Content>
</div>
