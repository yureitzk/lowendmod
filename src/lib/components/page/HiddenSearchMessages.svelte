<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		convertCamelCaseToKebabCase,
		countHiddenSearchResults,
		toggleSearchResultsVisibility,
	} from '~/lib/utils/helpers';
	import {
		searchResultsListSelector,
		hiddenSearchResultDataAttribute,
	} from '~/lib/constants/selectors';
	import { setBadgeTextMessageType } from '~/lib/constants/browser';

	let searchResultsCount = 0;
	let observer: MutationObserver;
	let areSearchResultsHidden = true;

	const toggleSearchResults = () => {
		toggleSearchResultsVisibility(areSearchResultsHidden);
		areSearchResultsHidden = areSearchResultsHidden ? false : true;
	};

	const updateSearchResultsCount = () => {
		const newCount = countHiddenSearchResults();
		if (newCount !== searchResultsCount) {
			searchResultsCount = newCount;
		}
		chrome.runtime.sendMessage({
			type: setBadgeTextMessageType,
			text: `${searchResultsCount}`,
		});
	};

	const handleMutation = (mutations: MutationRecord[]) => {
		const convertedHiddenDataAttribute = `data-${convertCamelCaseToKebabCase(hiddenSearchResultDataAttribute)}`;
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
			updateSearchResultsCount();
		}
	};

	const observeSearchResults = () => {
		const searchResultList = document.querySelector(searchResultsListSelector);

		if (searchResultList) {
			observer = new MutationObserver(handleMutation);
			observer.observe(searchResultList, {
				childList: true,
				subtree: true,
				attributes: true,
			});
			updateSearchResultsCount();
		}
	};

	$: observeSearchResults();

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

{#if searchResultsCount > 0}
	<span class="message">
		{searchResultsCount} results are hidden
		<span
			class="button"
			role="button"
			tabindex="0"
			on:click={toggleSearchResults}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					toggleSearchResults();
				}
			}}
		>
			{#if areSearchResultsHidden}
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
