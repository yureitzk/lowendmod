<script lang="ts">
	import pkg from '~/../package.json';
	import UserSettingsContent from '@components/UserSettingsContent.svelte';
	import DiscussionSettingsContent from '@components/DiscussionSettingsContent.svelte';
	import MiscellaneousSettingsContent from '@components/MiscellaneousSettingsContent.svelte';
	import About from '@components/About.svelte';
	import KeywordsSettingsContent from '@components/KeywordsSettingsContent.svelte';
</script>

<svelte:head>
	<title>{pkg.displayName} Settings</title>
</svelte:head>

<div class="container">
	<section>
		<h2>User settings</h2>
		<UserSettingsContent />
	</section>

	<section>
		<h2>Discussion settings</h2>
		<DiscussionSettingsContent />
	</section>

	<section>
		<h2>Keywords</h2>
		<KeywordsSettingsContent />
	</section>

	<section>
		<h2>Miscellaneous settings</h2>
		<MiscellaneousSettingsContent />
	</section>
</div>

<section>
	<About />
</section>

<style>
	h2 {
		font-size: 1.2rem;
		margin-top: 0;
	}

	section:not(:last-of-type) {
		padding-bottom: 15px;
		border-bottom: 1px solid #a3e6ff;
		margin-bottom: 25px;
	}

	.container {
		padding: 1.5rem 1rem;
	}

	@media (min-width: 768px) {
		.container {
			padding: 2rem 1.5rem;
		}
	}

	@media (min-width: 992px) {
		.container {
			padding: 2.5rem 2rem;
		}
	}

	@media (min-width: 1200px) {
		.container {
			padding: 3rem 2.5rem;
		}
	}

	@media (max-width: 728px) {
		.container {
			padding: 1rem 0.8rem;
		}
	}
</style>
