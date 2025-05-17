<script lang="ts">
	import { onMount } from 'svelte';
	import { hiddenUsers } from '~/lib/stores/hiddenUsersStore';
	import { User } from '~/lib/models/User';

	let username: string | null = null;
	let buttonElement: HTMLButtonElement;

	$: userExists = $hiddenUsers.some((user: User) => user.username === username);

	onMount(() => {
		if (buttonElement) {
			const parent = buttonElement.closest('span');
			username = parent?.dataset.username || null;
		}
	});

	const handleClick = async () => {
		if (!username) return;

		const user = new User(username);

		try {
			if (userExists) {
				hiddenUsers.remove(user);
			} else {
				hiddenUsers.add(user);
			}
		} catch (error) {
			console.error('Failed to update hidden status using store:', error);
		}
	};
</script>

<button
	bind:this={buttonElement}
	on:click={handleClick}
	aria-label={userExists ? 'Unhide user' : 'Hide user'}
>
	{userExists ? 'Unhide' : 'Hide'}
</button>

<style>
	button {
		color: var(--neutral-shade-16, #333);
		display: inline-block;
		cursor: pointer;
		font-size: 13px;
		line-height: 16px;
		font-weight: bold;
		padding: 5px 8px;
		border: 1px solid;
		border-color: var(--neutral-shade-0, #999);
		border-radius: 2px;
		white-space: nowrap;
		background-color: var(--neutral-shade-0, #fdfdfd);
	}

	button:hover {
		color: var(--secondary, #ff0084);
	}
</style>
