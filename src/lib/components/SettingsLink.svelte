<script lang="ts">
	function handleClick() {
		chrome.runtime.openOptionsPage();
		window.close();
	}
</script>

<button on:click={handleClick} class="btn">Settings</button>

<style>
	.btn {
		display: inline-block;
		font-size: 0.875rem;
		border: none;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 3px;
		color: #358244;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		cursor: pointer;
		padding: 0;
	}

	.btn:hover {
		color: #ff0084;
	}
</style>
