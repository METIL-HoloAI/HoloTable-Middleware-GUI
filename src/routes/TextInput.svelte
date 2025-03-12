<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { SendHorizontalIcon } from '@lucide/svelte';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	const onsubmit = preventDefault(() => gs.nlen && gs.submit());
	const onclick = () => gs.reset();
</script>

<Card.Content class="p-6">
	<form {onsubmit} class="space-y-3">
		<div class="flex w-full max-w-sm items-center space-x-2">
			<Input
				type="text"
				placeholder="Enter your prompt"
				bind:value={gs.name}
				class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus-visible:ring-black transition-all duration-200"
			/>
			<Button
				type="submit"
				class="w-min rounded-full text-black bg-gradient-to-r from-white to-white/95 transition-opacity duration-200"
			>
				<SendHorizontalIcon />
			</Button>
		</div>
		<Button
			{onclick}
			class="w-full bg-gradient-to-r from-black to-black/50 hover:ring-1 hover:ring-slate-200 transition-all duration-200"
			>Reset</Button
		>
	</form>
</Card.Content>
