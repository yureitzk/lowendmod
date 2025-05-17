import browser from 'webextension-polyfill';
import { setBadgeTextMessageType } from '~/lib/constants/browser';
import {
	setBrowserIconText,
	setDefaultBadgeAppearance,
	setSettingsToDefault,
} from '~/lib/utils/browser/helpers';
import { isHideBadgeCountStorageEnabled } from '~/lib/utils/storage';

browser.runtime.onInstalled.addListener(() => {
	console.log('Extension installed');
	setSettingsToDefault();
});

browser.runtime.onStartup.addListener(async () => {
	main();
});

browser.runtime.onMessage.addListener(
	async (
		message,
		sender: browser.Runtime.MessageSender,
		sendResponse: (response?: any) => void,
	) => {
		if (message.type === setBadgeTextMessageType && sender.tab) {
			const isCounterEnabled = !(await isHideBadgeCountStorageEnabled());
			if (isCounterEnabled) {
				setBrowserIconText(message.text, sender.tab.id);
				sendResponse();
			}
			sendResponse();
		}
	},
);

function main() {
	setDefaultBadgeAppearance();
}

main();
