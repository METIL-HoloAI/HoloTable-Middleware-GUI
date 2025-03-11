<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import erom3 from '$lib/erom3.jpeg'
	import { SendHorizontalIcon } from '@lucide/svelte';
	import { SettingsIcon } from '@lucide/svelte';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	const onsubmit = preventDefault(() => gs.nlen && gs.submit());
	const onclick = () => gs.reset();

	const onSwitch = () => {
		let inputMode: string;
		if (gs.isVoiceInput == true) {
			inputMode = 'STT'
		} else {
			inputMode = 'text'
		}
		console.log("input mode: " +inputMode);
	}
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
						<p>Settings Shit</p>
						<a href="/settings">
                            <SettingsIcon class="mt-2"/>
                        </a>
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
							<SendHorizontalIcon/>
						</Button>
					</div>
					<Button
						{onclick}
						class="w-full bg-gradient-to-r from-black to-black/50 hover:ring-1 hover:ring-slate-200 transition-all duration-200"
						>Reset</Button
					>
			</form>
		</Card.Content>
		<!-- {/if} -->
		{:else if gs.isVoiceInput}
		<Card.Content class="p-6">
			<form {onsubmit} class="space-y-3">
					<Button
						type="submit"
						class="w-full h-full bg-gradient-to-r from-black to-yellow-400/50 hover:opacity-90 transition-opacity duration-200"
					>
						speech to text area!!! yay
					</Button>
					<img alt="erome" src={erom3} class="h-[100px] w-full"/>
					<!-- <Button
						{onclick}
						class="w-full bg-gradient-to-r from-black to-yellow-900/50 hover:opacity-90 transition-opacity duration-200"
						>Reset</Button
					> -->
			</form>
		</Card.Content>
		{/if}
	</Card.Root>
</div>
