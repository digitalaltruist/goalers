<script lang="ts">
	import PublicHeader from '$lib/components/PublicHeader.svelte';

	let { children } = $props();
</script>

<div class="public-shell">
	<PublicHeader />
	<main>{@render children()}</main>
</div>

<style>
	.public-shell {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>
