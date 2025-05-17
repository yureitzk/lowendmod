<script lang="ts">
	import OptionContent from '@components/OptionContent.svelte';
</script>

<main>
	<OptionContent />
</main>

<style>
	:global(body) {
		font-family: 'lucida grande', 'Lucida Sans Unicode', tahoma, sans-serif;
		color: #333;
		margin: 0;
		font-size: 0.875rem;
		background-color: #cfc;
	}

	main {
		background-color: #ffffff;
		margin: 0 auto;
		width: 640px;
		max-width: 100%;
	}

	@media (min-width: 992px) {
		main {
			width: 800px;
		}
	}

	@media (min-width: 1200px) {
		main {
			width: 960px;
		}
	}

	@media (max-width: 728px) {
		main {
			width: auto;
			margin: 0 15px;
		}
	}
</style>
