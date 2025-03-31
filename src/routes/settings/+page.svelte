<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import * as Card from '$lib/components/ui/card/index.js';
	import { CornerDownLeftIcon } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { fade } from 'svelte/transition';

	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ScrollAreaScrollbar from '$lib/components/ui/scroll-area/scroll-area-scrollbar.svelte';

	const gs = new GlobalState();

	const configs = [
		{ name: 'speechtotext', directory: '' },
		{ name: 'general', directory: '' },
		{ name: 'intentdetection', directory: '' },
		{ name: '3dgen', directory: 'contentgen_yamls' },
		{ name: 'gifgen', directory: 'contentgen_yamls' },
		{ name: 'imagegen', directory: 'contentgen_yamls' },
		{ name: 'videogen', directory: 'contentgen_yamls' },
		{ name: '3dworkflow', directory: 'contentgen_workflows' },
		{ name: 'gifworkflow', directory: 'contentgen_workflows' },
		{ name: 'imageworkflow', directory: 'contentgen_workflows' },
		{ name: 'videoworkflow', directory: 'contentgen_workflows' }
	];

	const configClicked = (config: string, configDirectory: string) => {
		gs.selectedConfig = config;
		gs.selectedConfigDirectory = configDirectory;
		console.log(
			'selected config: ' + gs.selectedConfig + ' with directory: ' + gs.selectedConfigDirectory
		);
		loadYaml();
	};

	const onReset = () => {
		gs.reset();
		yamlContent = '';
	};

	let yamlContent = '';
	let code = yamlContent;

	async function loadYaml() {
		if (gs.selectedConfigDirectory === '') {
			try {
				const response = await fetch(`http://localhost:8000/config/${gs.selectedConfig}`, {
					method: 'GET'
				});
				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}
				yamlContent = await response.text();
				code = yamlContent;
				return true;
			} catch (error) {
				console.error('Error fetching YAML:', error);
				yamlContent = 'Failed to fetch configuration file. Is the go server running?';
				return false;
			}
		} else {
			try {
				const response = await fetch(
					`http://localhost:8000/config/${gs.selectedConfigDirectory}/${gs.selectedConfig}`,
					{
						method: 'GET'
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}
				yamlContent = await response.text();
				return true;
			} catch (error) {
				console.error('Error fetching YAML:', error);
				yamlContent = 'Failed to fetch configuration file. Is the go server running?';
				return false;
			}
		}
	}
</script>

<div
	class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] min-h-screen flex items-center justify-center p-4 transition-all duration-500"
>
	<Card.Root class="w-4/6 h-4/6 bg-transparent transition-all duration-300 border-none">
		<Card.Header class="space-y-2">
			<Card.Title class="text-3xl font-bold text-center text-white">
				<div class="flex flex-row space-x-2 place-content-between">
					<p>API Settings</p>
					<Tooltip.Root openDelay={100}>
						<Tooltip.Trigger
							><a href="/">
								<CornerDownLeftIcon class="mt-2" />
							</a></Tooltip.Trigger
						>
						<Tooltip.Content>
							<p>Return to Prompting</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Card.Title>
		</Card.Header>
		<div class="h-5/6 mt-4 rounded-md border bg-slate-900/75 text-white overflow-hidden">
			{#if gs.selectedConfig === ''}
				<div class="p-4" in:fade={{ duration: 200 }}>
					{#each configs as config}
						<button
							type="button"
							class="text-sm h-10 justify-center hover:bg-slate-500/75 hover:cursor-pointer transition-all duration-200 flex items-center w-full"
							on:click={() => configClicked(config.name, config.directory)}
						>
							{config.name}
						</button>
						<Separator />
					{/each}
				</div>
			{/if}

			{#if yamlContent}
				<textarea
					bind:value={yamlContent}
					class="w-full h-full bg-transparent overflow-auto resize-none"
				>
				</textarea>
			{/if}
			<ScrollAreaScrollbar orientation="horizontal" />
		</ScrollArea>
		{#if gs.selectedConfig !== ''}
			<Button onclick={onReset}>Cancel</Button>
			<Button>Apply</Button>
		{/if}
	</Card.Root>
</div>
