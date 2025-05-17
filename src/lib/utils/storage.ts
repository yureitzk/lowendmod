import * as browser from 'webextension-polyfill';
import {
    hideBadgeCountStorage,
    hideCommentsByKeywordsStorage,
    hideDiscussionByKeywordsInTitleStorage,
    hideDiscussionsHideButtonStorage,
    hideHiddenCounterStorage,
    hideMessageHideButtonStorage,
    hideProfileHideButtonStorage,
    hideSearchResultsByKeywordsInBodyStorage,
    hideSearchResultsByKeywordsInTitleStorage,
    hideSignaturesStorage,
    hideUserCommentsStorage,
    hideUserDiscussionsStorage,
    hideUserSearchResultsStorage,
    listOfHiddenDiscussionsStorage,
    listOfHiddenKeywordsStorage,
    listOfHiddenUsersStorage,
} from '../constants/syncStorage';
import type { Discussion } from '../models/Discussion';
import { User } from '../models/User';
import type { Option } from '../types/Option';

export async function setUsersToStorage(users: User[]): Promise<void> {
	try {
		await browser.storage.sync.set({
			[listOfHiddenUsersStorage]: users,
		});
	} catch (error) {
		console.error('Error setting user to storage:', error);
		return undefined;
	}
}

export const saveUsersToStorage = async (users: User[]): Promise<void> => {
	return new Promise((resolve) => {
		const usersData = users.map((user) => ({ username: user.username }));
		chrome.storage.sync.set({ [listOfHiddenUsersStorage]: usersData }, () => {
			resolve();
		});
	});
};

export async function addUserToStorage(user: User): Promise<void> {
	try {
		const users = await getUsersFromStorage();
		const exists = users.some((u) => u.username === user.username);

		if (exists) return;

		users?.push(user);

		await browser.storage.sync.set({
			[listOfHiddenUsersStorage]: users,
		});
	} catch (error) {
		console.error('Error adding user to storage:', error);
		return undefined;
	}
}

export async function deleteUserFromStorage(username: string): Promise<void> {
	try {
		const users = await getUsersFromStorage();
		const newUsers = users.filter((user) => user.username !== username);

		await setUsersToStorage(newUsers);
	} catch (error) {
		console.error('Error deleting user from storage:', error);
		return undefined;
	}
}

export async function getUsersFromStorage(): Promise<User[]> {
	try {
		const result = await browser.storage.sync.get(listOfHiddenUsersStorage);
		let users: User[] = result[listOfHiddenUsersStorage];

		if (!users) return [];

		users = users.filter((user) => user !== null && user !== undefined);

		return users;
	} catch (error) {
		console.error('Error fetching users from storage:', error);
		return [];
	}
}

export async function deleteDiscussionFromStorage(id: number): Promise<void> {
	try {
		const discussions = await getDiscussionsFromStorage();
		const newDiscussions = discussions.filter(
			(discussion) => discussion.id !== id,
		);

		await setDiscussionsToStorage(newDiscussions);
	} catch (error) {
		console.error('Error deleting discussion from storage:', error);
		return undefined;
	}
}

export async function addDiscussionToStorage(
	discussion: Discussion,
): Promise<void> {
	try {
		const discussions = (await getDiscussionsFromStorage()) || [];
		const exists = discussions.some((d) => d.id === discussion.id);

		if (exists) return;

		discussions.push(discussion);
		await browser.storage.sync.set({
			[listOfHiddenDiscussionsStorage]: discussions,
		});
	} catch (error) {
		console.error('Error adding discussion to storage:', error);
	}
}

export async function setDiscussionsToStorage(
	discussions: Discussion[],
): Promise<void> {
	try {
		await browser.storage.sync.set({
			[listOfHiddenDiscussionsStorage]: discussions,
		});
	} catch (error) {
		console.error('Error setting discussions to storage:', error);
		return undefined;
	}
}

export async function getDiscussionsFromStorage(): Promise<Discussion[]> {
	try {
		const result = await browser.storage.sync.get(listOfHiddenDiscussionsStorage);
		let discussions: Discussion[] = result[listOfHiddenDiscussionsStorage];

		if (!discussions) return [];

		discussions = discussions.filter(
			(discussion) => discussion !== null && discussion !== undefined,
		);

		return discussions;
	} catch (error) {
		console.error('Error fetching discussions from storage:', error);
		return [];
	}
}

export async function getKeywordsFromStorage(): Promise<string[]> {
	try {
		const result = await browser.storage.sync.get(listOfHiddenKeywordsStorage);
		let keywords: string[] = result[listOfHiddenKeywordsStorage];

		if (!keywords) return [];

		keywords = keywords.filter(
			(keyword) => keyword !== null && keyword !== undefined && keyword !== '',
		);

		return keywords;
	} catch (error) {
		console.error('Error fetching keywords from storage:', error);
		return [];
	}
}

export async function setOptionValueToSyncStorage(
	option: Option,
	optionValue: boolean,
) {
	try {
		await browser.storage.sync.set({
			[option]: optionValue,
		});
	} catch (error) {
		console.error('Error setting storage for option value:', error);
	}
}

async function getOptionValueFromStorage(
	option: Option,
): Promise<boolean | undefined> {
	try {
		const result = await browser.storage.sync.get(option);
		const optionValue = result[option];

		if (optionValue !== null && optionValue !== undefined) {
			return optionValue;
		}
		return undefined;
	} catch (error) {
		console.error('Error fetching option value from storage:', error);
		return undefined;
	}
}

async function isFeatureEnabled(storageKey: Option): Promise<boolean> {
	try {
		const value = await getOptionValueFromStorage(storageKey);
		return !!value;
	} catch (error) {
		console.error(
			`Error fetching option value from storage for key: ${storageKey}`,
			error,
		);
		return false;
	}
}

export const isHideUserCommentsEnabled = () =>
	isFeatureEnabled(hideUserCommentsStorage);
export const isHideUserDiscussionsEnabled = () =>
	isFeatureEnabled(hideUserDiscussionsStorage);
export const isHideUserSearchResultsEnabled = () =>
	isFeatureEnabled(hideUserSearchResultsStorage);
export const isHideProfileHideButtonEnabled = () =>
	isFeatureEnabled(hideProfileHideButtonStorage);
export const isHidehideDiscussionsHideButtonEnabled = () =>
	isFeatureEnabled(hideDiscussionsHideButtonStorage);
export const isHideMessageHideButtonEnabled = () =>
	isFeatureEnabled(hideMessageHideButtonStorage);
export const isHideHiddenCounterEnabled = () =>
	isFeatureEnabled(hideHiddenCounterStorage);

export const isHideDiscussionByKeywordsInTitleEnabled = () =>
	isFeatureEnabled(hideDiscussionByKeywordsInTitleStorage);
export const isHideCommentsByKeywordsEnabled = () =>
	isFeatureEnabled(hideCommentsByKeywordsStorage);
export const isHideSearchResultsByKeywordsInTitleEnabled = () =>
	isFeatureEnabled(hideSearchResultsByKeywordsInTitleStorage);
export const isHideSearchResultsByKeywordsInBodyEnabled = () =>
	isFeatureEnabled(hideSearchResultsByKeywordsInBodyStorage);
export const isHideBadgeCountStorageEnabled = () =>
	isFeatureEnabled(hideBadgeCountStorage);
export const isHideSignaturesEnabled = () =>
	isFeatureEnabled(hideSignaturesStorage);
