<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Goalers — Social accountability for your goals</title>
</svelte:head>

<section class="hero">
	<div class="container hero-inner">
		<p class="eyebrow">Social accountability, simplified</p>
		<h1>Commit publicly. Post proof. Get cheered on.</h1>
		<p class="lead">
			Goalers turns self-improvement into a lightweight social experience. Share evidence of
			progress, build momentum, and stay consistent with encouragement from others.
		</p>
		<div class="cta-row">
			<a class="btn button-dark-surface-cta" href={resolve('/signup')}>Get started</a>
			<a class="btn btn-secondary" href={resolve('/all-goals')}>Browse All Goals</a>
		</div>
	</div>
</section>

<section class="features">
	<div class="container features-grid">
		<article class="feature card">
			<span class="feature-icon" aria-hidden="true">🎯</span>
			<h2>Public goals</h2>
			<p>Put your commitments where others can see them — accountability without the noise.</p>
		</article>
		<article class="feature card">
			<span class="feature-icon" aria-hidden="true">✨</span>
			<h2>Proof of action</h2>
			<p>Post photo proof of your progress — quick captures that keep you accountable.</p>
		</article>
		<article class="feature card">
			<span class="feature-icon" aria-hidden="true">👏</span>
			<h2>Cheers, not comments</h2>
			<p>Receive positive reinforcement from the community with a single tap.</p>
		</article>
	</div>
</section>

<section class="preview">
	<div class="container">
		<h2>Built for momentum</h2>
		<p class="preview-copy">
			Track goals on My Goals, post evidence as you go, and see everyone's progress in All Goals —
			a chronological view of evidence from the community.
		</p>
		<a class="btn button-dark-surface-cta" href={resolve('/my-goals')}>View demo (My Goals)</a>
	</div>
</section>

<style>
	.hero {
		padding: 3rem 0 4rem;
	}

	.hero-inner {
		max-width: 40rem;
	}

	.eyebrow {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-orange);
		margin-bottom: 0.75rem;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 2.75rem);
		font-weight: 400;
		line-height: 1.15;
		letter-spacing: 0.02em;
	}

	.lead {
		margin-top: 1rem;
		font-size: 1.0625rem;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}

	.features {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		border-block: 1px solid var(--color-border-dark);
	}

	.features-grid {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.features-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.feature {
		padding: 1.5rem;
	}

	.feature-icon {
		font-size: 1.75rem;
	}

	.feature h2 {
		margin-top: 0.75rem;
		font-size: 1.125rem;
		font-weight: 700;
	}

	.feature p {
		margin-top: 0.5rem;
		font-size: 0.9375rem;
		color: var(--color-text-muted);
	}

	.preview {
		padding: 4rem 0;
		text-align: center;
	}

	.preview h2 {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.preview-copy {
		margin: 0.75rem auto 1.5rem;
		max-width: 32rem;
		color: var(--color-text-muted);
	}
</style>
