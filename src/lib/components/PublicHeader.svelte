<script lang="ts">
	import { resolve } from '$app/paths';
	import AppLogo from './AppLogo.svelte';
</script>

<header class="public-header">
	<div class="container inner">
		<AppLogo />
		<nav aria-label="Main">
			<a href={resolve('/login')}>Log in</a>
			<a class="btn button-dark-surface-cta btn-sm" href={resolve('/signup')}>Sign up</a>
		</nav>
	</div>
</header>

<style>
	.public-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: rgba(8, 13, 11, 0.92);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-border-dark);
		color: var(--color-text);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--nav-height);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	nav a:not(.btn) {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	nav a:not(.btn):hover {
		color: var(--color-text);
	}
</style>
