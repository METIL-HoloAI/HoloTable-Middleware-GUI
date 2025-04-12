<script lang="ts">
	import { GlobalState } from '$lib';
	import * as Card from '$lib/components/ui/card/index.js';
	import { CornerDownLeftIcon } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import YAML from 'yaml';
	import SettingNode from './SettingNode.svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	// switch will allow user to show raw YAML. Disable switch if it failed to parse and display YAML by default.

	const gs = new GlobalState();

	const configs = [
		{ name: 'speechtotext', directory: '' },
		{ name: 'general', directory: '' },
		{ name: 'intentdetection', directory: '' },
		{ name: '3dgen', directory: 'contentgen_yamls' },
		{ name: 'gifgen', directory: 'contentgen_yamls' },
		{ name: 'imagegen', directory: 'contentgen_yamls' },
		{ name: 'videogen', directory: 'contentgen_yamls' },
		{ name: '3dWorkflow', directory: 'contentgen_workflows' },
		{ name: 'gifWorkflow', directory: 'contentgen_workflows' },
		{ name: 'imageWorkflow', directory: 'contentgen_workflows' },
		{ name: 'videoWorkflow', directory: 'contentgen_workflows' }
	];

	let settings: Record<string, any> = {}; // editable JSON representation
	let yamlRaw = '';
	let doc: ReturnType<typeof YAML.parseDocument> | null = null; // YAML AST (keeps comments)
	let parseError = '';

	function setNested(obj: any, path: (string | number)[], val: any) {
		let target = obj;
		for (let i = 0; i < path.length - 1; i++) {
			target = target[path[i]];
		}
		target[path[path.length - 1]] = val;
	}

	function updateSetting(path: (string | number)[], val: any) {
		// 1. update JSON used for the UI
		setNested(settings, path, val);
		settings = settings; // trigger reactivity

		// 2. update YAML AST so comments remain intact
		doc?.setIn(path, val);
	}

	const configClicked = (config: string, directory: string) => {
		gs.selectedConfig = config;
		gs.selectedConfigDirectory = directory;
		loadYaml();
	};

	const onReset = () => {
		gs.reset();
		settings = {};
		yamlRaw = '';
		doc = null;
		parseError = '';
	};

	async function loadYaml() {
		const path =
			gs.selectedConfigDirectory === ''
				? `http://localhost:8000/config/${gs.selectedConfig}`
				: `http://localhost:8000/config/${gs.selectedConfigDirectory}/${gs.selectedConfig}`;

		try {
			const response = await fetch(path);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			yamlRaw = await response.text();
			doc = YAML.parseDocument(yamlRaw);
			settings = doc.toJSON() ?? {};
			parseError = '';
		} catch (err) {
			console.error(err);
			parseError = 'Failed to fetch or parse YAML. Is the Go server running?';
		}
	}

	async function updateYaml() {
		if (!doc) return;

		const body = String(doc); // YAML string w/ comments
		const path =
			gs.selectedConfigDirectory === ''
				? `http://localhost:8000/config/${gs.selectedConfig}`
				: `http://localhost:8000/config/${gs.selectedConfigDirectory}/${gs.selectedConfig}`;

		try {
			const response = await fetch(path, {
				method: 'PUT',
				headers: { 'Content-Type': 'text/plain' },
				body
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			toast.success('YAML has been updated.');
			onReset();
		} catch (err) {
			console.error('Update failed:', err);
		}
	}
	const onSwitch = () => {
		let showYaml: boolean;
		if (gs.showRawYaml == true) {
			showYaml = true;
		} else {
			showYaml = false;
		}
		console.log('showYaml: ' + showYaml);
	};
</script>

<div
	class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] min-h-screen flex items-center justify-center p-4 transition-all duration-500"
>
	<Card.Root class="w-4/6 h-4/6 bg-transparent transition-all duration-300 border-none">
		<Card.Header class="space-y-2">
			<Card.Title class="text-3xl font-bold text-center text-white">
				<div class="flex flex-row space-x-2 place-content-between">
					<div class="flex flex-row space-x-2">
						<p>API Settings</p>
						<Tooltip.Root openDelay={100}>
							<Tooltip.Trigger
								><Switch
									checked={gs.showRawYaml}
									onCheckedChange={(checked: boolean) => {
										gs.showRawYaml = checked;
										onSwitch();
									}}
									class="hover:opacity-80 transition-all duration-200 self-center"
								/></Tooltip.Trigger
							>
							<Tooltip.Content>
								{#if gs.showRawYaml}
									<p>Show parsed YAML</p>
								{:else}
									<p>Show raw YAML</p>
								{/if}
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<Tooltip.Root openDelay={100}>
						<Tooltip.Trigger>
							<a href="/">
								<CornerDownLeftIcon class="mt-2" />
							</a>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Return to Prompting</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Card.Title>
		</Card.Header>

		<div class="h-5/6 mt-4 rounded-md border bg-slate-900/75 text-white overflow-auto">
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
			{:else if parseError}
				<p class="p-4 text-red-400">{parseError}</p>
			{:else if gs.showRawYaml}
				<textarea
					bind:value={doc}
					class="w-full h-full p-4 bg-slate-800 text-white outline-none resize-none"
					>{yamlRaw}</textarea
				>
			{:else}
				<!-- Parsed YAML rendered recursively -->
				<div class="p-4 overflow-auto h-full">
					<SettingNode value={settings} path={[]} {updateSetting} />
				</div>
			{/if}
		</div>

		{#if gs.selectedConfig !== ''}
			<div class="flex justify-end space-x-2 mt-2">
				<Button onclick={onReset}>Cancel</Button>
				<Button onclick={updateYaml}>Apply</Button>
			</div>
		{/if}
	</Card.Root>
</div>
