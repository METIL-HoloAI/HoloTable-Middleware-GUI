<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import erom3 from '$lib/erom3.jpeg';
	import { SendHorizontalIcon } from '@lucide/svelte';
	import { SettingsIcon } from '@lucide/svelte';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	const onsubmit = preventDefault(() => gs.nlen && gs.submit());
	const onclick = () => gs.reset();

	const onSwitch = () => {
		let inputMode: string;
		if (gs.isVoiceInput == true) {
			inputMode = 'STT';
		} else {
			inputMode = 'text';
		}
		console.log('input mode: ' + inputMode);
	};
</script>

<!-- left to do:
- "change ui to take up whole screen baby"  
- change submit to an arrow like chatgpt
- allow user to navigate to config editing area
- work on config editing ui
- allow user to navigate back to prompting area 

- perhaps log to the side the entire typed prompt the user has typed or the STT transcription


implement with frontend:
- text prompting functionality
- config editing functionality
- STT functionality
-->
<div class="relative h-full w-full bg-slate-950">
	<div
		class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] min-h-screen flex items-center justify-center p-4 bg-slate-950 transition-all duration-500"
	>
		<Card.Header class="space-y-2">
			<Card.Title
				class="text-3xl font-bold text-center text-white"
			>
				{#if gs.greet}
					<p>{gs.greet}</p>
				{:else}
					<div class="flex flex-row space-x-2 place-content-between">
						<p>METIL HoloTable</p>
						<Button>
							<SettingsIcon class="mt-2" href="/settings"/>
						</Button>
					</div>
	</div>
</div>
