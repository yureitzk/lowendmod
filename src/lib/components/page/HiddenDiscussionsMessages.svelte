<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		convertCamelCaseToKebabCase,
		countHiddenDiscussions,
		toggleDiscussionsVisibility,
	} from '~/lib/utils/helpers';
	import {
		discussionsListSelector,
		hiddenDiscussionDataAttribute,
	} from '~/lib/constants/selectors';
	import { setBadgeTextMessageType } from '~/lib/constants/browser';

	let discussionCount = 0;
	let observer: MutationObserver;
	let areDiscussionsHidden = true;

	const toggleDiscussions = () => {
		toggleDiscussionsVisibility(areDiscussionsHidden);
		areDiscussionsHidden = areDiscussionsHidden ? false : true;
	};

	const updateDiscussionCount = () => {
		const newCount = countHiddenDiscussions();
		if (newCount !== discussionCount) {
			discussionCount = newCount;
		}

		chrome.runtime.sendMessage({
			type: setBadgeTextMessageType,
			text: `${discussionCount}`,
		});
	};

	const handleMutation = (mutations: MutationRecord[]) => {
		const convertedHiddenDataAttribute = `data-${convertCamelCaseToKebabCase(hiddenDiscussionDataAttribute)}`;
		const attributeAdded = mutations.some(
			(mutation) =>
				(mutation.type === 'attributes' &&
					mutation.attributeName === convertedHiddenDataAttribute) ||
				(mutation.type === 'childList' &&
					Array.from(mutation.addedNodes).some(
						(node) =>
							node instanceof Element &&
							node.hasAttribute(convertedHiddenDataAttribute),
					)),
		);

		if (attributeAdded) {
			updateDiscussionCount();
		}
	};

	const observeDiscussions = () => {
		const discussionsList = document.querySelector(discussionsListSelector);

		if (discussionsList) {
			observer = new MutationObserver(handleMutation);
			observer.observe(discussionsList, {
				childList: true,
				subtree: true,
				attributes: true,
			});
			updateDiscussionCount();
		}
	};

	$: observeDiscussions();

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

{#if discussionCount > 0}
	<span class="message">
		{discussionCount} discussions are hidden
		<span
			class="button"
			role="button"
			tabindex="0"
			on:click={toggleDiscussions}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					toggleDiscussions();
				}
			}}
		>
			{#if areDiscussionsHidden}
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
