<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Goalers — Social accountability for your goals</title>
</svelte:head>

<section class="hero">
	<div class="container hero-inner">
		<figure class="hero-visual">
			<div class="hero-image-frame">
				<img
					src="/images/hero-library.jpg"
					alt="Friends cheering on someone studying at a library table"
					width="1536"
					height="1024"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
				<div class="hero-image-overlay" aria-hidden="true"></div>
			</div>
		</figure>

		<div class="hero-copy">
			<p class="eyebrow">Social accountability, simplified</p>
			<h1>Turn progress into something worth cheering for.</h1>
			<p class="lead">
				Post small wins, show your work, and let friends keep you going.
			</p>
			<div class="cta-row">
				<a class="btn button-dark-surface-cta" href={resolve('/signup')}>Start a goal</a>
				<a class="btn button-dark-surface-cta-secondary" href={resolve('/all-cheers')}>Browse All Cheers</a>
			</div>
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
			Track goals on My Goals, post progress as you go, and see everyone's progress in All Cheers —
			a chronological view of progress from the community.
		</p>
		<a class="btn button-dark-surface-cta" href={resolve('/my-goals')}>View demo (My Goals)</a>
	</div>
</section>

<style>
	.hero {
		padding: 1rem 0 3rem;
		overflow-x: clip;
	}

	.hero-inner {
		display: grid;
		gap: 1.75rem;
		align-items: center;
	}

	.hero-copy {
		min-width: 0;
	}

	.eyebrow {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-primary);
		margin-bottom: 0.75rem;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 5vw, 2.75rem);
		font-weight: 400;
		line-height: 1.15;
		letter-spacing: 0.02em;
		text-wrap: balance;
	}

	.lead {
		margin-top: 1rem;
		font-size: clamp(1rem, 2.5vw, 1.0625rem);
		color: var(--color-text-muted);
		line-height: 1.6;
		max-width: 36rem;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.hero-visual {
		margin: 0;
		min-width: 0;
	}

	.hero-image-frame {
		position: relative;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--color-border-dark);
		box-shadow:
			0 24px 48px rgba(0, 0, 0, 0.45),
			0 0 0 1px rgba(199, 255, 26, 0.08),
			0 0 80px color-mix(in srgb, var(--color-primary) 12%, transparent);
		background: var(--color-surface);
		max-height: min(42vh, 22rem);
	}

	.hero-image-frame img {
		width: 100%;
		height: 100%;
		min-height: 12rem;
		object-fit: cover;
		object-position: center 35%;
	}

	.hero-image-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(8, 13, 11, 0.35) 0%,
			transparent 45%,
			rgba(8, 13, 11, 0.2) 100%
		);
		pointer-events: none;
	}

	@media (min-width: 768px) {
		.hero {
			padding: 3rem 0 4.5rem;
		}

		.hero-inner {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
			gap: 2.5rem;
		}

		.hero-copy {
			grid-column: 1;
			grid-row: 1;
		}

		.hero-visual {
			grid-column: 2;
			grid-row: 1;
		}

		.hero-image-frame {
			max-height: none;
			aspect-ratio: 4 / 3;
		}

		.hero-image-frame img {
			min-height: 0;
			object-position: center center;
		}

		.cta-row {
			margin-top: 1.75rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-inner {
			gap: 3rem;
			grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.1fr);
		}

		.hero-copy {
			padding-right: 0.5rem;
		}
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
