<script lang="ts">
	export let value: any;
	export let path: (string | number)[] = [];
	export let updateSetting: (path: (string | number)[], val: any) => void;

	function onInput(e: Event) {
		const target = e.target as HTMLInputElement;
		updateSetting(path, target.value);
	}
</script>

{#if typeof value === 'object' && value !== null}
	{#if Array.isArray(value)}
		{#each value as item, idx}
			<details class="ml-4" open>
				<summary class="cursor-pointer text-slate-300">[{idx}]</summary>
				<svelte:self value={item} path={[...path, idx]} {updateSetting} />
			</details>
		{/each}
	{:else}
		{#each Object.entries(value) as [k, v]}
			<details class="ml-4" open>
				<summary class="cursor-pointer text-slate-300">{k}</summary>
				<svelte:self value={v} path={[...path, k]} {updateSetting} />
			</details>
		{/each}
	{/if}
{:else}
	<div class="flex items-center space-x-3 ml-4 my-1">
		<label for="setting-input-{path.join('-')}" class="w-1/3 truncate text-slate-400"
			>{path[path.length - 1]}</label
		>
		<input
			id="setting-input-{path.join('-')}"
			class="flex-1 bg-transparent border rounded p-2 focus:outline-none focus:ring-1 focus:ring-slate-300"
			{value}
			on:input={onInput}
		/>
	</div>
{/if}
