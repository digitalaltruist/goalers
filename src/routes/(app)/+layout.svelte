<script lang="ts">
	import { page } from '$app/state';
	import AppNav from '$lib/components/AppNav.svelte';
	import EvidenceFab from '$lib/components/EvidenceFab.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

	const pathname = $derived(page.url.pathname);
	const isEvidenceSheet = $derived(pathname === '/evidence/new');
	const hideFab = $derived(pathname === '/evidence/new' || pathname === '/goals/new');
</script>

<div class="app-shell" class:sheet-open={isEvidenceSheet}>
	<AppNav
		hideMobileNav={isEvidenceSheet}
		displayName={data.user.name}
		username={data.profile?.username ?? null}
	/>
	<main
		class="app-main"
		class:container={!isEvidenceSheet}
		class:sheet-main={isEvidenceSheet}
	>
		{@render children()}
	</main>
	{#if !hideFab}
		<EvidenceFab />
	{/if}
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.app-main {
		flex: 1;
		padding-block: 1.5rem 5rem;
	}

	@media (max-width: 767px) {
		.app-shell.sheet-open {
			overflow: hidden;
			overflow-x: hidden;
		}

		.app-main.sheet-main {
			padding-block: 0;
		}
	}

	@media (min-width: 768px) {
		.app-main {
			padding-bottom: 2rem;
		}

		.app-shell.sheet-open {
			background: var(--color-bg);
		}

		.app-main.sheet-main {
			padding-block: 0;
		}
	}
</style>
