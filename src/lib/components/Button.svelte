<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		dispatch('click', event);
	}
</script>

<button on:click={handleClick}>
	<slot></slot>
</button>

<style>
	button {
		display: block;
		margin-left: auto;
		background: -webkit-gradient(
			linear,
			center bottom,
			center top,
			from(#cccccc),
			to(#ffffff)
		);
		color: #02475a;
		cursor: pointer;
		border: 1px solid #999;
		border-radius: 3px;
		padding: 4px 6px;
	}

	button:hover {
		color: #111;
	}
</style>
