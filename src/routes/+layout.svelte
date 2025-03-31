<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { connectWebsocket } from '$lib/websocket';
	let { children } = $props();
	onMount(() => {
		connectWebsocket();
	});
</script>

<Toaster />
{@render children()}
