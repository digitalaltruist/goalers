<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Log in — Goalers</title>
</svelte:head>

<div class="auth-page container">
	<div class="auth-card card">
		<h1>Welcome back</h1>
		<p class="subtitle">Log in to post evidence and cheer others on.</p>

		<form class="auth-form" onsubmit={(e) => e.preventDefault()}>
			<div class="form-field">
				<label for="email">Email</label>
				<input id="email" type="email" name="email" placeholder="you@example.com" autocomplete="email" />
			</div>
			<div class="form-field">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					name="password"
					placeholder="••••••••"
					autocomplete="current-password"
				/>
			</div>
			<button type="submit" class="btn btn-primary full-width" disabled title="Auth connects in Stage 2">
				Log in
			</button>
		</form>

		<p class="placeholder-note">
			Authentication is not wired yet. Use My Goals in the demo to explore the UI shell.
		</p>
		<a class="btn btn-secondary full-width" href={resolve('/my-goals')}>Continue to My Goals (demo)</a>

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

	.placeholder-note {
		margin-top: 1rem;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		text-align: center;
		line-height: 1.45;
	}

	.auth-card > .btn-secondary {
		margin-top: 0.75rem;
	}

	.footer-link {
		margin-top: 1.25rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}
</style>
