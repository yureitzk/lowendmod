import type * as Browser from 'webextension-polyfill';
export type { Browser };

export const browser = (
	process.env.BROWSER === 'chrome' ? globalThis.chrome : globalThis.browser
) as typeof import('webextension-polyfill');

export const setBadgeTextMessageType = 'setBadgeText';
export const setPopupActiveStateMessageType = 'setPopupState';
