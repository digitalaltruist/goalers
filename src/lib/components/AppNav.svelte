<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AppLogo from './AppLogo.svelte';
	import { CURRENT_USER, getInitials } from '$lib/data/mock';

	interface Props {
		hideMobileNav?: boolean;
	}

	let { hideMobileNav = false }: Props = $props();

	const links = [
		{ href: '/my-goals', label: 'My Goals' },
		{ href: '/all-goals', label: 'All Goals' }
	] as const;

	let menuOpen = $state(false);
	let profileWrap = $state<HTMLDivElement | undefined>(undefined);

	const initials = getInitials(CURRENT_USER.displayName);

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (!menuOpen) return;
		const t = e.target as Node;
		if (profileWrap && !profileWrap.contains(t)) menuOpen = false;
	}
</script>

<svelte:window onclick={onWindowClick} />

<header class="app-header">
	<div class="container inner">
		<AppLogo href="/my-goals" />
		<div class="header-right">
			<nav class="desktop-nav" aria-label="App">
				{#each links as link}
					<a href={resolve(link.href)} class:active={isActive(link.href)}>{link.label}</a>
				{/each}
			</nav>
			<div class="profile-wrap" bind:this={profileWrap}>
				<button
					type="button"
					class="profile-trigger"
					onclick={(e) => {
						e.stopPropagation();
						toggleMenu();
					}}
					aria-expanded={menuOpen}
					aria-haspopup="menu"
					aria-controls="profile-menu"
					id="profile-menu-button"
				>
					<span class="profile-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="8" r="4" />
							<path d="M4 20c1.5-4 6.5-6 8-6s6.5 2 8 6" />
						</svg>
					</span>
					<span class="avatar" aria-hidden="true">{initials}</span>
					<span class="user-name">{CURRENT_USER.displayName}</span>
				</button>
				{#if menuOpen}
					<div
						id="profile-menu"
						class="profile-menu"
						role="menu"
						aria-labelledby="profile-menu-button"
					>
						<a href={resolve('/login')} role="menuitem" class="menu-item" onclick={closeMenu}>Log out</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>

{#if !hideMobileNav}
	<nav class="mobile-nav" aria-label="App mobile">
		{#each links as link}
			<a href={resolve(link.href)} class:active={isActive(link.href)}>{link.label}</a>
		{/each}
		<a href={resolve('/goals/new')} class:active={isActive('/goals/new')}>New goal</a>
	</nav>
{/if}

<style>
	.app-header {
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
		gap: 1rem;
		height: var(--nav-height);
	}

	.header-right {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-left: auto;
		min-width: 0;
	}

	.desktop-nav {
		display: none;
		gap: 0.25rem;
		align-items: center;
	}

	.desktop-nav a {
		padding: 0.5rem 0.875rem;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text-muted);
		border-radius: var(--radius-sm);
		text-decoration: none;
	}

	.desktop-nav a:hover {
		background: var(--color-surface-muted);
		color: var(--color-text);
		text-decoration: none;
	}

	.desktop-nav a.active {
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}

	.profile-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.profile-trigger {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.5rem 0.25rem 0.375rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 999px;
		cursor: pointer;
		font-family: inherit;
	}

	.profile-trigger:hover {
		background: var(--color-surface-muted);
	}

	.profile-icon {
		display: flex;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.avatar {
		display: grid;
		place-items: center;
		min-width: 1.75rem;
		height: 1.75rem;
		padding: 0 0.25rem;
		border-radius: 50%;
		background: var(--color-primary);
		color: #f8faf8;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.user-name {
		font-size: 0.8125rem;
		font-weight: 600;
		padding-right: 0.125rem;
		max-width: 10rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.profile-menu {
		position: absolute;
		top: calc(100% + 0.375rem);
		right: 0;
		min-width: 10rem;
		padding: 0.375rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-md);
		z-index: 20;
	}

	.menu-item {
		display: block;
		padding: 0.5rem 0.75rem;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text);
		border-radius: var(--radius-sm);
		text-decoration: none;
	}

	.menu-item:hover {
		background: var(--color-surface-muted);
		text-decoration: none;
	}

	.mobile-nav {
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
		background: var(--color-surface);
		border-top: 1px solid var(--color-border);
		padding: 0.5rem;
		padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
		box-shadow: 0 -2px 12px rgb(26 33 28 / 0.06);
	}

	.mobile-nav a {
		flex: 1;
		text-align: center;
		padding: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-muted);
		border-radius: var(--radius-sm);
		text-decoration: none;
	}

	.mobile-nav a.active {
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}

	@media (min-width: 768px) {
		.desktop-nav {
			display: flex;
		}

		.mobile-nav {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.user-name {
			display: none;
		}
	}
</style>
