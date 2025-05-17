import browser from 'webextension-polyfill';
import cleanContent from '../cleanContent';
import renderContent from '../renderContent';

import { setPopupActiveStateMessageType } from '~/lib/constants/browser';
import {
    addActiveIdToDocument,
    createAndAddCustomStyleElement,
    isDocumentWithActiveId,
} from '~/lib/utils/helpers';

(async () => {
	createAndAddCustomStyleElement();
	await main();
})();

async function main() {
	if (addActiveIdToDocument()) {
		await cleanContent();
		await renderContent();
	}
}

browser.runtime.onMessage.addListener(
	(
		message,
		sender: browser.Runtime.MessageSender,
		sendResponse: (response?: any) => void,
	) => {
		if (message.type === setPopupActiveStateMessageType) {
			const isActive = isDocumentWithActiveId();
			sendResponse(isActive);
		}
	},
);
