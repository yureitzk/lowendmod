<script lang="ts">
	import Hide from '@components/icons/Hide.svelte';
	import Show from '@components/icons/Show.svelte';
	import { Discussion } from '~/lib/models/Discussion';
	import {
		addDiscussionToStorage,
		deleteDiscussionFromStorage,
		getDiscussionsFromStorage,
	} from '~/lib/utils/storage';
	import { onMount } from 'svelte';
	import { toggleDiscussion } from '~/lib/utils/helpers';

	let discussionExists: boolean = false;
	let id: number | null = null;
	let buttonElement: HTMLButtonElement;

	onMount(async () => {
		if (buttonElement) {
			const parent = buttonElement.closest('span');
			id = parseInt(parent?.dataset.discussionId ?? '0', 10);

			if (id) {
				await checkDiscussionExists();
			}
		}
	});

	const checkDiscussionExists = async () => {
		if (!id) return;

		const discussions = await getDiscussionsFromStorage();
		discussionExists =
			discussions?.some((discussion) => discussion.id === id) || false;
	};

	const handleClick = async (e: Event) => {
		if (!id) return;

		if (discussionExists) {
			await deleteDiscussionFromStorage(id);
			toggleDiscussion(id, true);
		} else {
			const discussion = new Discussion(id);
			await addDiscussionToStorage(discussion);
			toggleDiscussion(id, false);
		}

		await checkDiscussionExists();
	};
</script>

<button
	bind:this={buttonElement}
	on:click={handleClick}
	class="btn"
	title={discussionExists ? 'Unhide discussion' : 'Hide discussion'}
	aria-label={discussionExists ? 'Unhide discussion' : 'Hide discussion'}
>
	{#if discussionExists}
		<Show />
	{:else}
		<Hide />
	{/if}
</button>

<style>
	.btn {
		background: none;
		border: 0;
		margin: 0;
		cursor: pointer;
		padding: 0;
		display: inline-block;
		width: 18px;
		height: 18px;
		vertical-align: top;
		overflow: hidden;
		text-indent: -1000px;
		font-size: 1px;
		margin-right: 0.36rem;
	}
</style>
