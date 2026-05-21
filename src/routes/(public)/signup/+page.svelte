<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const USERNAME_PATTERN = '[a-z0-9_]{3,30}';
</script>

<svelte:head>
	<title>Sign up — Goalers</title>
</svelte:head>

<div class="auth-page container">
	<div class="auth-card card">
		<h1>Create your account</h1>
		<p class="subtitle">Join Goalers and start building accountability in public.</p>

		<form class="auth-form" method="post" action="?/signUpEmail" use:enhance>
			<div class="form-field">
				<label for="name">Display name</label>
				<input id="name" type="text" name="name" placeholder="Alex Rivera" autocomplete="name" required />
			</div>
			<div class="form-field">
				<label for="username">Username</label>
				<input
					id="username"
					type="text"
					name="username"
					placeholder="alex"
					autocomplete="username"
					pattern={USERNAME_PATTERN}
					title="3–30 characters: lowercase letters, numbers, underscores"
					required
				/>
			</div>
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
					autocomplete="new-password"
					minlength="8"
					required
				/>
			</div>
			{#if form?.message}
				<p class="form-error" role="alert">{form.message}</p>
			{/if}
			<button type="submit" class="btn button-dark-surface-cta full-width">Create account</button>
		</form>

		<p class="footer-link">
			Already have an account? <a href={resolve('/login')}>Log in</a>
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
