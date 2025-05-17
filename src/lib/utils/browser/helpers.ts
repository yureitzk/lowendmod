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
} from '~/lib/constants/syncStorage';
import type { Option } from '~/lib/types/Option';

export const loadStyles = async (
	shadowRoot: ShadowRoot,
	cssPaths: string[],
): Promise<void> => {
	if (import.meta.hot) {
		const { addViteStyleTarget } = await import(
			'@samrum/vite-plugin-web-extension/client'
		);
		await addViteStyleTarget(shadowRoot);
	} else {
		cssPaths.forEach((cssPath: string) => {
			const styleEl = document.createElement('link');
			styleEl.setAttribute('rel', 'stylesheet');
			styleEl.setAttribute('href', browser.runtime.getURL(cssPath));
			shadowRoot.appendChild(styleEl);
		});
	}
};

export const setBrowserIconText = (text: string, tabId?: number): void => {
	const details: chrome.action.BadgeTextDetails = {
		text: `${text}`,
	};

	if (tabId !== undefined) {
		details.tabId = tabId;
	}

	if (browser && browser.action) {
		browser.action.setBadgeText(details);
	} else if (browser && browser.browserAction) {
		browser.browserAction.setBadgeText(details);
	} else {
		console.error('Browser action API not found to set text.');
	}
};

export const setDefaultBadgeAppearance = () => {
	if (browser && browser.action) {
		browser.action.setBadgeTextColor({ color: '#000' });
		browser.action.setBadgeBackgroundColor({ color: '#aaa' });
	} else if (browser && browser.browserAction) {
		browser.browserAction.setBadgeTextColor({ color: '#000' });
		browser.browserAction.setBadgeBackgroundColor({ color: '#aaa' });
	} else {
		console.error('Browser action API not found to set appearance.');
	}
};

function setMultipleOptionsToSyncStorage(options: Record<Option, boolean>) {
	try {
		browser.storage.sync.set(options);
	} catch (error) {
		console.error('Error setting storage for options:', error);
	}
}

export const setSettingsToDefault = () => {
	setMultipleOptionsToSyncStorage({
		[hideUserCommentsStorage]: true,
		[hideUserDiscussionsStorage]: true,
		[hideUserSearchResultsStorage]: true,
		[hideProfileHideButtonStorage]: false,
		[hideDiscussionsHideButtonStorage]: false,
		[hideMessageHideButtonStorage]: false,
		[hideHiddenCounterStorage]: false,
		[hideDiscussionByKeywordsInTitleStorage]: false,
		[hideCommentsByKeywordsStorage]: false,
		[hideSearchResultsByKeywordsInTitleStorage]: false,
		[hideSearchResultsByKeywordsInBodyStorage]: false,
		[hideBadgeCountStorage]: false,
		[hideSignaturesStorage]: false,
		[listOfHiddenUsersStorage]: [],
		[listOfHiddenDiscussionsStorage]: [],
		[listOfHiddenKeywordsStorage]: [],
	} as Record<Option, boolean>);
};
