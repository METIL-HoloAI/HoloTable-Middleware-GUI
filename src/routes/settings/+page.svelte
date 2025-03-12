<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import * as Card from '$lib/components/ui/card/index.js';
	import { CornerDownLeftIcon } from '@lucide/svelte';

	const gs = new GlobalState();

	$inspect(gs.greet, gs.name);

	const onsubmit = preventDefault(() => gs.nlen && gs.submit());
	const onclick = () => gs.reset();
</script>

<div
	class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] min-h-screen flex items-center justify-center p-4 transition-all duration-500"
>
	<Card.Root class="w-[380px] h-[280px] bg-transparent transition-all duration-300 border-none">
		<Card.Header class="space-y-2">
			<Card.Title class="text-3xl font-bold text-center text-white">
				<div class="flex flex-row space-x-2 place-content-between">
					<p>Settings</p>
					<a href="/" class="hover:scale-110 hover:opacity-90 transition-all duration-200">
						<CornerDownLeftIcon class="mt-2" />
					</a>
				</div>
			</Card.Title>
		</Card.Header>
	</Card.Root>
</div>
