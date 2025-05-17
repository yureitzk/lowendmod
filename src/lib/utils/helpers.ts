import {
    activeDocumenDataAttribute,
    activityCommentSelector,
    activityListItemsSelector,
    activitySelector,
    activityTitleSelector,
    activityUsernameSelector,
    commentItemSelector,
    commentSignatureSelector,
    commentsListItemsSelector,
    commentUsernameSelector,
    customCssId,
    discussionAuthorSelector,
    discussionItemWithPhotoSelector,
    discussionsListItemsSelector,
    hiddenActivityDataAttribute,
    hiddenCommentDataAttribute,
    hiddenDiscussionDataAttribute,
    hiddenSearchResultDataAttribute,
    profileUsernameSelector,
    searchPhotoWrapSelector,
    searchProfileWrapperSelector,
    searchResultBodySelector,
    searchResultListItemsSelector,
    searchResultProfilePicture,
    searchResultSelector
} from '../constants/selectors';

export function getSiteHostGlob(domain: string): string {
	return `*://*.${domain}/*`;
}

export const toggleCommentElements = (
	comments: HTMLElement[],
	show: boolean,
) => {
	comments.forEach((commentEl) => {
		const isHidden = commentEl.classList.toggle(hiddenLETElementClass, !show);
		commentEl.dataset[hiddenCommentDataAttribute] = String(isHidden);
	});
};

export const toggleDiscussions = (ids: number[], show: boolean) => {
	const selector = ids
		.map((id) => `#Discussion_${id}${discussionItemWithPhotoSelector}`)
		.join(',');

	if (!selector) {
		return;
	}

	const discussionElementsToToggle: NodeListOf<HTMLElement> =
		document.querySelectorAll(selector);

	discussionElementsToToggle.forEach((discussionEl) => {
		const isHidden = discussionEl.classList.toggle(hiddenLETElementClass, !show);
		discussionEl.dataset[hiddenDiscussionDataAttribute] = String(isHidden);
	});
};

export const toggleDiscussion = (id: number, show?: boolean) => {
	const discussionEl: HTMLElement | null = document.querySelector(
		`#Discussion_${id}${discussionItemWithPhotoSelector}`,
	);

	if (!discussionEl) {
		return;
	}

	const isHidden = discussionEl.classList.toggle(
		hiddenLETElementClass,
		typeof show === 'boolean' ? !show : undefined,
	);
	discussionEl.dataset[hiddenDiscussionDataAttribute] = String(isHidden);
};

export const toggleDiscussionsVisibility = (show?: boolean) => {
	const convertedHiddenDiscussionDataAttribute = convertCamelCaseToKebabCase(
		hiddenDiscussionDataAttribute,
	);

	const discussionElements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`${discussionItemWithPhotoSelector}[data-${convertedHiddenDiscussionDataAttribute}="true"]`,
	);

	if (!discussionElements.length) {
		return;
	}

	discussionElements.forEach((discussionEl) => {
		discussionEl.classList.toggle(
			hiddenLETElementClass,
			typeof show === 'boolean' ? !show : undefined,
		);
	});
};

export const countHiddenDiscussions = (): number => {
	const convertedDataAttribute = convertCamelCaseToKebabCase(
		hiddenDiscussionDataAttribute,
	);
	const selector = `${discussionsListItemsSelector}[data-${convertedDataAttribute}="true"]`;
	const hiddenDiscussions: NodeListOf<HTMLElement> =
		document.querySelectorAll(selector);
	return hiddenDiscussions.length;
};

export const countHiddenComments = (): number => {
	const convertedDataAttribute = convertCamelCaseToKebabCase(
		hiddenCommentDataAttribute,
	);
	const selector = `${commentsListItemsSelector}[data-${convertedDataAttribute}="true"]`;
	const hiddenComments: NodeListOf<HTMLElement> =
		document.querySelectorAll(selector);
	return hiddenComments.length;
};

export const countHiddenActivities = (): number => {
	const convertedDataAttribute = convertCamelCaseToKebabCase(
		hiddenActivityDataAttribute,
	);
	const activitySelector = `${activityListItemsSelector}[data-${convertedDataAttribute}="true"]`;
	const activityCommentSelectorOptimized = `${activityCommentSelector}[data-${convertedDataAttribute}="true"]`;

	const hiddenActivities: NodeListOf<HTMLElement> =
		document.querySelectorAll(activitySelector);
	const hiddenActivityComments: NodeListOf<HTMLElement> =
		document.querySelectorAll(activityCommentSelectorOptimized);

	return hiddenActivities.length + hiddenActivityComments.length;
};

export const countHiddenSearchResults = (): number => {
	const convertedDataAttribute = convertCamelCaseToKebabCase(
		hiddenSearchResultDataAttribute,
	);
	const selector = `${searchResultListItemsSelector}[data-${convertedDataAttribute}="true"]`;
	const hiddenSearchResults: NodeListOf<HTMLElement> =
		document.querySelectorAll(selector);
	return hiddenSearchResults.length;
};

export const toggleSearchResultElements = (
	results: HTMLElement[],
	show: boolean,
) => {
	results.forEach((resultEl) => {
		toggleSearchResult(resultEl, show);
	});
};

export const toggleCommentsVisibility = (show?: boolean) => {
	const convertedHiddenCommentDataAttribute = convertCamelCaseToKebabCase(
		hiddenCommentDataAttribute,
	);

	const commentElements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`${commentItemSelector}[data-${convertedHiddenCommentDataAttribute}="true"]`,
	);

	if (!commentElements.length) {
		return;
	}

	commentElements.forEach((commentEl) => {
		if (typeof show === 'boolean') {
			commentEl.classList.toggle(hiddenLETElementClass, !show);
		} else {
			commentEl.classList.toggle(hiddenLETElementClass);
		}
	});
};

export const toggleActivitiesVisibility = (show?: boolean) => {
	const convertedHiddenActivityDataAttribute = convertCamelCaseToKebabCase(
		hiddenActivityDataAttribute,
	);

	const activityElements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`${activitySelector}[data-${convertedHiddenActivityDataAttribute}]`,
	);

	if (!activityElements.length) {
		return;
	}

	activityElements.forEach((activityEl) => {
		if (typeof show === 'boolean') {
			activityEl.classList.toggle(hiddenLETElementClass, !show);
		} else {
			activityEl.classList.toggle(hiddenLETElementClass);
		}
	});
};

export const extractDiscussionId = (text: string): number | null => {
	const match = text.match(/\d+/);

	if (!match) {
		const url = window.location.pathname;
		const urlMatch = url.match(/\/discussion\/(\d+)\//);
		return urlMatch ? parseInt(urlMatch[1], 10) : null;
	}

	return parseInt(match[0], 10);
};

export const toggleComments = (inputUsername: string, show?: boolean) => {
	document
		.querySelectorAll<HTMLElement>(commentItemSelector)
		.forEach((comment) => {
			if (extractCommentUsername(comment) === inputUsername) {
				toggleComment(comment, show);
			}
		});
};

export const toggleComment = (comment: HTMLElement, show?: boolean) => {
	if (typeof show === 'boolean') {
		comment.classList.toggle(hiddenLETElementClass, !show);
		comment.dataset[hiddenCommentDataAttribute] = String(!show);
	} else {
		const isHidden = comment.classList.toggle(hiddenLETElementClass);
		comment.dataset[hiddenCommentDataAttribute] = String(isHidden);
	}
};

export const toggleActivitiesCommentsVisibility = (show?: boolean) => {
	const convertedHiddenActivityDataAttribute = convertCamelCaseToKebabCase(
		hiddenActivityDataAttribute,
	);

	const activityElements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`${activityCommentSelector}[data-${convertedHiddenActivityDataAttribute}]`,
	);

	if (!activityElements.length) {
		return;
	}

	activityElements.forEach((activityEl) => {
		if (typeof show === 'boolean') {
			activityEl.classList.toggle(hiddenLETElementClass, !show);
		} else {
			activityEl.classList.toggle(hiddenLETElementClass);
		}
	});
};

export const toggleActivitiesComments = (
	inputUsername: string,
	show?: boolean,
) => {
	document
		.querySelectorAll<HTMLElement>(activityCommentSelector)
		.forEach((comment) => {
			if (extractActivityCommentUsername(comment) === inputUsername) {
				toggleActivityComment(comment, show);
			}
		});
};

export const toggleActivityComment = (comment: HTMLElement, show?: boolean) => {
	if (typeof show === 'boolean') {
		comment.classList.toggle(hiddenLETElementClass, !show);
		comment.dataset[hiddenActivityDataAttribute] = String(!show);
	} else {
		const isHidden = comment.classList.toggle(hiddenLETElementClass);
		comment.dataset[hiddenActivityDataAttribute] = String(isHidden);
	}
};

export const toggleActivities = (inputUsername: string, show?: boolean) => {
	document
		.querySelectorAll<HTMLElement>(activitySelector)
		.forEach((activity) => {
			if (extractActivityUsername(activity) === inputUsername) {
				toggleActivity(activity, show);
			}
		});
};

export const hiddenLETElementClass = 'hiddenLETElementClass';

export const toggleActivity = (activity: HTMLElement, show?: boolean) => {
	if (typeof show === 'boolean') {
		activity.classList.toggle(hiddenLETElementClass, !show);
		activity.dataset[hiddenActivityDataAttribute] = String(!show);
	} else {
		const isHidden = activity.classList.toggle(hiddenLETElementClass);
		activity.dataset[hiddenActivityDataAttribute] = String(isHidden);
	}
};

export const toggleSearchResults = (inputUsername: string, show?: boolean) => {
	document
		.querySelectorAll<HTMLElement>(searchResultSelector)
		.forEach((result) => {
			if (extractSearchResultUsername(result) === inputUsername) {
				toggleSearchResult(result, show);
			}
		});
};

export const toggleSearchResult = (
	searchResult: HTMLElement,
	show?: boolean,
) => {
	if (typeof show === 'boolean') {
		searchResult.classList.toggle(hiddenLETElementClass, !show);
		searchResult.dataset[hiddenSearchResultDataAttribute] = String(!show);
	} else {
		const isHidden = searchResult.classList.toggle(hiddenLETElementClass);
		searchResult.dataset[hiddenSearchResultDataAttribute] = String(isHidden);
	}
};

export const toggleSearchResultsVisibility = (show?: boolean) => {
	const convertedHiddenSearchResultDataAttribute = convertCamelCaseToKebabCase(
		hiddenSearchResultDataAttribute,
	);

	const searchResultElements: NodeListOf<HTMLElement> =
		document.querySelectorAll(
			`${searchResultSelector}[data-${convertedHiddenSearchResultDataAttribute}]`,
		);

	if (!searchResultElements.length) {
		return;
	}

	searchResultElements.forEach((searchResultEl) => {
		if (typeof show === 'boolean') {
			searchResultEl.classList.toggle(hiddenLETElementClass, !show);
		} else {
			searchResultEl.classList.toggle(hiddenLETElementClass);
		}
	});
};

export const extractSearchResultUsername = (
	searchResultEl: HTMLElement,
): string | null => {
	const itemBody = searchResultEl?.querySelector(searchResultBodySelector);
	// Username is in the first anchor
	const profilePictureElement: HTMLImageElement | null | undefined =
		itemBody?.querySelector(searchResultProfilePicture);
	if (profilePictureElement) {
		const username = profilePictureElement.alt.trim() || null;

		return username;
	}

	return null;
};

export const extractActivityCommentUsername = (
	activityEl: HTMLElement,
): string | null => {
	const authorWrapper = activityEl?.querySelector(searchProfileWrapperSelector);
	const usernameElement: HTMLAnchorElement | null | undefined =
		authorWrapper?.querySelector(searchPhotoWrapSelector);
	if (usernameElement) {
		const username = usernameElement.title?.trim() || null;

		return username;
	}

	return null;
};

export const extractActivityUsername = (
	activityEl: HTMLElement,
): string | null => {
	const titleEl = activityEl?.querySelector(activityTitleSelector);
	// Username is in the first anchor
	const usernameElement = titleEl?.querySelector(activityUsernameSelector);
	if (usernameElement) {
		const username = usernameElement.textContent?.trim() || null;

		return username;
	}

	return null;
};

export const hideCommentSignature = (commentEl: HTMLElement) => {
	const commentSignatureEl = commentEl.querySelector(commentSignatureSelector);
	if (commentSignatureEl) commentSignatureEl.classList.add(hiddenLETElementClass);
}

export const extractCommentUsername = (
	commentEl: HTMLElement,
): string | null => {
	const usernameElement = commentEl?.querySelector(commentUsernameSelector);
	if (usernameElement) {
		const username = usernameElement.textContent?.trim() || null;

		return username;
	}

	return null;
};

export const extractDiscussionAuthorUsername = (
	discussionEl: HTMLElement,
): string | null => {
	const authorEl = discussionEl?.querySelector(discussionAuthorSelector);
	if (authorEl) {
		const username = authorEl.textContent?.trim() || null;
		return username;
	}

	return null;
};

export const extractProfileUsername = (): string | null => {
	const profileEl = document.querySelector(profileUsernameSelector);
	if (profileEl) {
		const username = profileEl.textContent?.trim() || null;
		return username;
	}

	return null;
};

export const createShadowRoot = (appContainer: HTMLSpanElement): ShadowRoot => {
	return appContainer.attachShadow({
		mode: import.meta.env.MODE === 'development' ? 'open' : 'closed',
	});
};

export function convertCamelCaseToKebabCase(camelCaseString: string): string {
	return camelCaseString.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export const createAndAddCustomStyleElement = () => {
	const isExist = document.getElementById(customCssId);

	if (isExist) return;

	const style = document.createElement('style');
	const cssStyles = `
	.${hiddenLETElementClass} {
		display: none!important;
	}

    [data-${convertCamelCaseToKebabCase(hiddenDiscussionDataAttribute)}="true"]:not(.${hiddenLETElementClass}),
    [data-${convertCamelCaseToKebabCase(hiddenCommentDataAttribute)}="true"]:not(.${hiddenLETElementClass}), 
    [data-${convertCamelCaseToKebabCase(hiddenActivityDataAttribute)}="true"]:not(.${hiddenLETElementClass}),
    [data-${convertCamelCaseToKebabCase(hiddenSearchResultDataAttribute)}="true"]:not(.${hiddenLETElementClass}) {
		background-color: rgba(255, 192, 192, 0.5)!important;
    }
`;
	style.innerHTML = cssStyles;
	style.id = customCssId;

	document.head.appendChild(style);
};

export const addActiveIdToDocument = (): boolean => {
	const dataAttribute = activeDocumenDataAttribute;
	if (document.documentElement.dataset[dataAttribute]) {
		return false;
	}
	document.documentElement.dataset[dataAttribute] = '1';

	return true;
};

export const isDocumentWithActiveId = (): boolean => {
	const dataAttribute = activeDocumenDataAttribute;
	if (document.documentElement.dataset[dataAttribute]) {
		return true;
	}

	return false;
};
