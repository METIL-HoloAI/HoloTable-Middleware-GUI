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

<!-- can build executable file with `bun run tauri build` -->

<div
	class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-slate-900 to-slate-600 transition-all duration-500"
>
	<Card.Root
		class="w-[380px] h-[280px] bg-transparent transition-all duration-300 border-none"
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
				{/if}
			</Card.Title>
			<div class="flex flex-row text-white">
				<Switch
					checked={gs.isVoiceInput}
					onCheckedChange={(checked) => {
						gs.isVoiceInput = checked;
						onSwitch();
					}}
				/>
				<span class="ml-3">{gs.isVoiceInput ? "Speech-to-Text" : "Text Input"}</span>
			</div>
		</Card.Header>
		{#if !gs.isVoiceInput}
			<!-- if input mode is text -->
			<TextInput />
		{:else if gs.isVoiceInput}
			<!-- if input mode is voice -->
			<SpeechInput />
		{/if}
	</Card.Root>
</div>
