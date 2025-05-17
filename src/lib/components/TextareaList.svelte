<script lang="ts">
	export let value: string;
	export let placeholder: string = '';
	export let spellcheck: boolean = false;
</script>

<textarea bind:value {spellcheck} {placeholder}></textarea>

<style>
	textarea {
		font-family: inherit;
		width: 100%;
		min-height: 6em;
		resize: vertical;
		padding: 10px;
		border: 1px solid #aea;
		border-radius: 4px;
		background-color: #ffffff;
		color: #333333;
		font-size: 15px;
		margin-bottom: 10px;
		box-sizing: border-box;
	}

	textarea:focus {
		background-color: #ffe;
	}
</style>
