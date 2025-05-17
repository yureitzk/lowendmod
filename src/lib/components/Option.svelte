<script lang="ts">
	import { onMount } from 'svelte';
	import type { Option } from '~/lib/types/Option';

	export let name: Option;
	export let storageId: string;
	let checked = false;

	const loadStoredValue = async () => {
		chrome.storage.sync.get(storageId, (result) => {
			checked = result[storageId];
		});
	};

	onMount(() => {
		loadStoredValue();
	});

	const handleChange = () => {
		chrome.storage.sync.set({ [storageId]: checked });
	};
</script>

<div>
	<input
		bind:checked
		on:change={handleChange}
		type="checkbox"
		id={storageId}
		name={storageId}
	/>
	<label for={storageId}>{name}</label>
</div>
