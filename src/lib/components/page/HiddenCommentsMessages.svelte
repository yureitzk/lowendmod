<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		convertCamelCaseToKebabCase,
		countHiddenComments,
		toggleCommentsVisibility,
	} from '~/lib/utils/helpers';
	import {
		commentsListSelector,
		hiddenCommentDataAttribute,
	} from '~/lib/constants/selectors';
	import { setBadgeTextMessageType } from '~/lib/constants/browser';

	let commentsCount = 0;
	let observer: MutationObserver;
	let areCommentsHidden = true;

	const toggleComments = () => {
		toggleCommentsVisibility(areCommentsHidden);
		areCommentsHidden = areCommentsHidden ? false : true;
	};

	const updateCommentsCount = () => {
		const newCount = countHiddenComments();
		if (newCount !== commentsCount) {
			commentsCount = newCount;
		}
		chrome.runtime.sendMessage({
			type: setBadgeTextMessageType,
			text: `${commentsCount}`,
		});
	};

	const handleMutation = (mutations: MutationRecord[]) => {
		const convertedHiddenDataAttribute = `data-${convertCamelCaseToKebabCase(hiddenCommentDataAttribute)}`;
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
			updateCommentsCount();
		}
	};

	const observeComments = () => {
		const commentsList = document.querySelector(commentsListSelector);

		if (commentsList) {
			observer = new MutationObserver(handleMutation);
			observer.observe(commentsList, {
				childList: true,
				subtree: true,
				attributes: true,
			});
			updateCommentsCount();
		}
	};

	$: observeComments();

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

{#if commentsCount > 0}
	<span class="message">
		{commentsCount} comments are hidden
		<span
			class="button"
			role="button"
			tabindex="0"
			on:click={toggleComments}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					toggleComments();
				}
			}}
		>
			{#if areCommentsHidden}
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
