<script lang="ts">
	import SettingsLink from '@components/SettingsLink.svelte';
	import pkg from '~/../package.json';
	import { onMount } from 'svelte';
	import { setPopupActiveStateMessageType } from '~/lib/constants/browser';

	let isActive = false;

	onMount(async () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs.length > 0) {
				const activeTab = tabs[0];
				if (!activeTab || !activeTab.id) return;

				chrome.tabs.sendMessage(
					activeTab.id,
					{
						type: setPopupActiveStateMessageType,
					},
					(response) => {
						if (chrome.runtime.lastError) {
							isActive = false;
						} else if (typeof response === 'boolean') {
							isActive = response;
						} else {
							isActive = false;
						}
					},
				);
			}
		});
	});
</script>

<div class="header">
	{pkg.displayName} is {isActive ? 'active' : 'inactive'}
</div>

<section>
	<SettingsLink />
</section>

<style>
	.header {
		margin-bottom: 15px;
	}

	section {
		min-width: 20rem;
		max-width: 32rem;
	}
</style>
