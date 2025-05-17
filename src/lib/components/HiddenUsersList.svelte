<script lang="ts">
	import { onMount } from 'svelte';
	import { listOfHiddenUsersStorage } from '~/lib/constants/syncStorage';
	import Example from '@components/Example.svelte';
	import type { User } from '~/lib/models/User';
	import TextareaList from '@components/TextareaList.svelte';
	import Button from '@components/Button.svelte'; 

	const storageName = listOfHiddenUsersStorage;
	let users = '';
	let text = 'Save';

	onMount(() => {
		chrome.storage.sync.get(storageName, (data) => {
			const usersObj = data[storageName] || [];
			users = usersObj.map((userObj: User) => userObj.username).join('\n');
		});
	});

	function saveUsers() {
		const usersArray = users
			.split('\n')
			.map((name) => name.trim())
			.filter((name) => name !== '')
			.map((name) => ({ username: name }));

		chrome.storage.sync.set({ [storageName]: usersArray }, () => {
			text = 'Saved!';

			setTimeout(() => {
				text = 'Save';
			}, 1200);
		});
	}
</script>

<Example
	text={'To hide a user, enter their username in the URL, for example: https://lowendtalk.com/profile/username'}
/>
<div class="textarea-title">Hidden users</div>
<div>
	<TextareaList
		bind:value={users}
		spellcheck={false}
		placeholder="Hidden users"
	/>
	<Button on:click={saveUsers}>{text}</Button>
</div>

<style>
	.textarea-title {
		margin-bottom: 5px;
	}
</style>
