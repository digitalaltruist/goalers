<script lang="ts">
	import { resolve } from '$app/paths';
	import AppLogo from './AppLogo.svelte';
</script>

<header class="public-header">
	<div class="container inner">
		<AppLogo />
		<nav aria-label="Main">
			<a href={resolve('/login')}>Log in</a>
			<a class="btn btn-primary btn-sm" href={resolve('/signup')}>Sign up</a>
		</nav>
	</div>
</header>

<style>
	.public-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: color-mix(in srgb, var(--color-bg) 92%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-border);
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
