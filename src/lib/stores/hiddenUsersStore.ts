import { get, writable } from 'svelte/store';
import { User } from '~/lib/models/User';
import { getUsersFromStorage, saveUsersToStorage } from '~/lib/utils/storage';

const createHiddenUsersStore = () => {
	const { subscribe, set, update } = writable<User[]>([]);

	const loadInitialData = async () => {
		const users = await getUsersFromStorage();
		const initialUsers = users || [];
		set(initialUsers);
		await saveUsersToStorage(initialUsers);
	};

	loadInitialData();

	return {
		subscribe,
		add: (user: User) =>
			update((users: User[]) => {
				if (!users.some((u) => u.username === user.username)) {
					const newUsers = [...users, user];
					saveUsersToStorage(newUsers);
					return newUsers;
				}
				return users;
			}),
		remove: (user: User) =>
			update((users: User[]) => {
				const newUsers = users.filter((u) => u.username !== user.username);
				saveUsersToStorage(newUsers);
				return newUsers;
			}),
		isHidden: (username: string) => {
			let isCurrentlyHidden = false;
			isCurrentlyHidden = get(hiddenUsers).some(
				(user) => user.username === username,
			);
			return isCurrentlyHidden;
		},
	};
};

export const hiddenUsers = createHiddenUsersStore();
