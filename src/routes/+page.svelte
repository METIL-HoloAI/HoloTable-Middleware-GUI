<script lang="ts">
	import { GlobalState } from '$lib';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { SettingsIcon } from '@lucide/svelte';
	import SpeechInput from './SpeechInput.svelte';
	import TextInput from './TextInput.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	const gs = new GlobalState();

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
- bug: keyword not updating, should be refreshed with gavin function
-->
<div class="relative h-full w-full bg-slate-950">
	<div
		class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] min-h-screen flex items-center justify-center p-4 bg-slate-950 transition-all duration-500"
	>
		<Card.Root class="w-4/6 h-4/6 bg-transparent transition-all duration-300 border-none">
			<Card.Header class="space-y-2">
				<Card.Title class="text-center">
					<div class="flex flex-row space-x-2 place-content-between">
						<h1
							class="animate-text bg-gradient-to-r from-yellow-50 via-white to-violet-50 bg-clip-text text-transparent text-3xl font-black"
						>
							METIL HoloTable
						</h1>
						<Tooltip.Root openDelay={100}>
							<Tooltip.Trigger
								><a href="/settings">
									<SettingsIcon class="mt-2 text-white" />
								</a></Tooltip.Trigger
							>
							<Tooltip.Content>
								<p>Configure API Settings</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				</Card.Title>
				<div class="flex flex-row text-white">
					<Switch
						checked={gs.isVoiceInput}
						onCheckedChange={(checked: boolean) => {
							gs.isVoiceInput = checked;
							onSwitch();
						}}
						class="hover:opacity-80 transition-all duration-200"
					/>
					<span class="ml-3">{gs.isVoiceInput ? 'Speech-to-Text' : 'Text Input'}</span>
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
</div>
