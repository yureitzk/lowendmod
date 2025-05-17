<script lang="ts">
	import { onMount } from 'svelte';
	import { listOfHiddenDiscussionsStorage } from '~/lib/constants/syncStorage';
	import type { Discussion } from '~/lib/models/Discussion';
	import Example from '@components/Example.svelte';
	import TextareaList from '@components/TextareaList.svelte';
	import Button from '@components/Button.svelte'; 

	const storageName = listOfHiddenDiscussionsStorage;
	let discussions = '';
	let text = 'Save';

	onMount(() => {
		chrome.storage.sync.get(storageName, (data) => {
			const discussionsObj = data[storageName] || [];
			discussions = discussionsObj
				.map((discussionObj: Discussion) => discussionObj.id)
				.join('\n');
		});
	});

	function saveDiscussions() {
		const discussionsArray = discussions
			.split('\n')
			.map((id) => id.trim())
			.filter((id) => id !== '')
			.map((id) => ({ id }));

		chrome.storage.sync.set({ [storageName]: discussionsArray }, () => {
			text = 'Saved!';

			setTimeout(() => {
				text = 'Save';
			}, 1200);
		});
	}
</script>

<Example
	text={'To hide a discussion, enter the discussion ID in the URL, for example: https://lowendtalk.com/discussion/your_id'}
/>
<div class="textarea-title">Hidden discussions</div>
<div>
	<TextareaList
		bind:value={discussions}
		spellcheck={false}
		placeholder="Hidden discussions"
	/>
	<Button on:click={saveDiscussions}>{text}</Button>
</div>

<style>
	.textarea-title {
		margin-bottom: 5px;
	}
</style>
