<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const redirectTo = $derived(page.url.searchParams.get('redirectTo') ?? '');
</script>

<svelte:head>
	<title>Log in — Goalers</title>
</svelte:head>

<div class="auth-page container">
	<div class="auth-card card">
		<h1>Welcome back</h1>
		<p class="subtitle">Log in to post evidence and cheer others on.</p>

		<form class="auth-form" method="post" action="?/signInEmail" use:enhance>
			{#if redirectTo}
				<input type="hidden" name="redirectTo" value={redirectTo} />
			{/if}
			<div class="form-field">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="you@example.com"
					autocomplete="email"
					required
				/>
			</div>
			<div class="form-field">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					name="password"
					placeholder="••••••••"
					autocomplete="current-password"
					required
				/>
			</div>
			{#if form?.message}
				<p class="form-error" role="alert">{form.message}</p>
			{/if}
			<button type="submit" class="btn btn-primary full-width">Log in</button>
		</form>

		<p class="footer-link">
			Don't have an account? <a href={resolve('/signup')}>Sign up</a>
		</p>
	</div>
</div>

<style>
	.auth-page {
		display: grid;
		place-items: center;
		padding: 2rem 0 4rem;
		min-height: calc(100dvh - var(--nav-height));
	}

	.auth-card {
		width: min(100%, 24rem);
		padding: 2rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.subtitle {
		margin-top: 0.375rem;
		font-size: 0.9375rem;
		color: var(--color-text-muted);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.full-width {
		width: 100%;
	}

	.form-error {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-danger, #b42318);
		line-height: 1.45;
	}

	.footer-link {
		margin-top: 1.25rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}
</style>
