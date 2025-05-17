<script lang="ts">
	import { onMount } from 'svelte';
	import { hiddenUsers } from '~/lib/stores/hiddenUsersStore';
	import { toggleComments } from '~/lib/utils/helpers';
	import { User } from '~/lib/models/User';

	let username: string | null = null;
	let buttonElement: HTMLButtonElement;

	$: isHidden = $hiddenUsers.some((user: User) => user.username === username);

	onMount(() => {
		const parent: HTMLElement | null = buttonElement.closest('span');
		if (parent) {
			username = parent?.dataset.username || null;
		}
	});

	const handleClick = async () => {
		if (!username) return;

		const user = new User(username);

		try {
			if (isHidden) {
				hiddenUsers.remove(user);
				toggleComments(username, true);
			} else {
				hiddenUsers.add(user);
				toggleComments(username, false);
			}
		} catch (error) {
			console.error('Failed to update hidden status using store:', error);
		}
	};
</script>

<button
	bind:this={buttonElement}
	on:click={handleClick}
	class="btn"
	aria-label={isHidden ? 'Unhide user' : 'Hide user'}
>
	{isHidden ? 'Unhide' : 'Hide'}
</button>

<style>
	.btn {
		color: var(--primary, #358244);
		border: none;
		padding: 0;
		margin: 0;
		background: none;
		cursor: pointer;
		font-size: 11px;
	}

	.btn:hover {
		color: var(--secondary, #ff0084);
	}
</style>
