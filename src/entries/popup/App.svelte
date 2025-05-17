<script lang="ts">
	import PopupContent from '@components/PopupContent.svelte';
</script>

<main>
	<PopupContent></PopupContent>
</main>

<style>
	:global(body) {
		font-family: 'lucida grande', 'Lucida Sans Unicode', tahoma, sans-serif;
		color: #333;
		margin: 0;
		min-width: 20rem;
		max-width: 32rem;
		font-size: 0.875rem;
	}

	main {
		background-color: #ffffff;
		padding: 15px;
	}
</style>
