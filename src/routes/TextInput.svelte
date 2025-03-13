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
	const onsubmit = () => {
		if (gs.prompt === '') {
			toast.error('Prompt is currently empty.');
		} else {
			gs.submit();
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
</script>

<div>
	<Card.Content class="p-6">
		<form {onsubmit} class="space-y-3">
			<div class="relative items-center space-x-2">
				<Textarea
					placeholder="Enter a prompt for the HoloTable here."
					id="message-2"
					bind:value={gs.prompt}
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
					class="w-1/2 bg-red-900/75 hover:bg-red-800/75 text-white transition-all duration-200"
				>
					Clear
				</Button>
			</div>
		</form>
	</Card.Content>
</div>
