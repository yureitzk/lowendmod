<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		convertCamelCaseToKebabCase,
		countHiddenActivities,
		toggleActivitiesVisibility,
		toggleActivitiesCommentsVisibility,
	} from '~/lib/utils/helpers';
	import {
		activityListSelector,
		hiddenActivityDataAttribute,
	} from '~/lib/constants/selectors';
	import { setBadgeTextMessageType } from '~/lib/constants/browser';
	import { onMount } from 'svelte';
	import { hiddenUsers } from '~/lib/stores/hiddenUsersStore';

	let activitiesCount = 0;
	let observer: MutationObserver;
	let areActivitiesHidden = true;

	onMount(() => {
		updateActivitiesCount();

		observeActivities();
	});

	const toggleActivities = () => {
		toggleActivitiesVisibility(areActivitiesHidden);
		toggleActivitiesCommentsVisibility(areActivitiesHidden);
		areActivitiesHidden = !areActivitiesHidden;
	};

	const updateActivitiesCount = () => {
		const newCount = countHiddenActivities();
		if (newCount !== activitiesCount) {
			activitiesCount = newCount;
		}
		chrome.runtime.sendMessage({
			type: setBadgeTextMessageType,
			text: `${activitiesCount}`,
		});
	};

	const handleMutation = (mutations: MutationRecord[]) => {
		const convertedHiddenDataAttribute = `data-${convertCamelCaseToKebabCase(hiddenActivityDataAttribute)}`;
		const attributeAddedOrRemoved = mutations.some(
			(mutation) =>
				(mutation.type === 'attributes' &&
					mutation.attributeName === convertedHiddenDataAttribute) ||
				(mutation.type === 'childList' &&
					Array.from(mutation.addedNodes).some(
						(node) =>
							node instanceof Element &&
							node.hasAttribute(convertedHiddenDataAttribute),
					)) ||
				(mutation.type === 'childList' &&
					Array.from(mutation.removedNodes).some(
						(node) =>
							node instanceof Element &&
							node.hasAttribute(convertedHiddenDataAttribute),
					)),
		);

		if (attributeAddedOrRemoved) {
			updateActivitiesCount();
		}
	};

	const observeActivities = () => {
		const activitiesList = document.querySelector(activityListSelector);

		if (activitiesList) {
			observer = new MutationObserver(handleMutation);
			observer.observe(activitiesList, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}
	};

	onDestroy(() => {
		observer?.disconnect();
	});

	$: $hiddenUsers, updateActivitiesCount();
</script>

{#if activitiesCount > 0}
	<span class="message">
		{activitiesCount} messages are hidden
		<span
			class="button"
			role="button"
			tabindex="0"
			on:click={toggleActivities}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					toggleActivities();
				}
			}}
		>
			{#if areActivitiesHidden}
				Show
			{:else}
				Hide
			{/if}
		</span>
	</span>
{/if}

<style>
	.message {
		font-size: 0.8rem;
		display: block;
		text-align: left;
	}

	.button {
		color: var(--primary, #358244);
		border: none;
		padding: 0;
		margin: 0;
		background: none;
		cursor: pointer;
	}

	.button:hover {
		color: var(--secondary, #ff0084);
	}
</style>
