<script lang="ts">
	import { GlobalState, preventDefault } from '$lib';
	import * as Card from '$lib/components/ui/card/index.js';
	import erom3 from '$lib/erom3.jpeg';
	const gs = new GlobalState();
	// const onsubmit = preventDefault(() => gs.nlen && gs.submit());
</script>

<div>
	<Card.Content class="p-6">
		<!-- <form {onsubmit} class="space-y-3"> -->
		<form class="space-y-3">
			<img alt="erome" src={erom3} class="h-[100px] w-full" />
		</form>
	</Card.Content>
</div>
