<script lang="ts">
	import { onMount } from 'svelte';
	import { listOfHiddenKeywordsStorage } from '~/lib/constants/syncStorage';
	import Example from '@components/Example.svelte';
	import TextareaList from '@components/TextareaList.svelte';
	import Button from '@components/Button.svelte'; 

	const storageName = listOfHiddenKeywordsStorage;
	let keywords = '';
	let text = 'Save';

	onMount(() => {
		chrome.storage.sync.get(storageName, (data) => {
			keywords = data[storageName].join('\n') || [];
		});
	});

	function saveKeywords() {
		const keywordsArray = keywords
			.split('\n')
			.map((name) => name.trim())
			.filter((name) => name !== '');

		chrome.storage.sync.set({ [storageName]: keywordsArray }, () => {
			text = 'Saved!';

			setTimeout(() => {
				text = 'Save';
			}, 1200);
		});
	}
</script>

<Example
	text={'Enter keywords you want to block. Put each keyword on a new line'}
/>
<div class="textarea-title">Hidden keywords</div>
<div>
	<TextareaList
		bind:value={keywords}
		spellcheck={false}
		placeholder="Keywords"
	/>
	<Button on:click={saveKeywords}>{text}</Button>
</div>

<style>
	.textarea-title {
		margin-bottom: 5px;
	}
</style>
