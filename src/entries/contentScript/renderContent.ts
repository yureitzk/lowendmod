import ActivityHider from '@components/page/ActivityHider.svelte';
import CommentHider from '@components/page/CommentHider.svelte';
import DiscussionHider from '@components/page/DiscussionHider.svelte';
import HiddenActivities from '@components/page/HiddenActivities.svelte';
import HiddenCommentsMessages from '@components/page/HiddenCommentsMessages.svelte';
import HiddenDiscussionsMessages from '@components/page/HiddenDiscussionsMessages.svelte';
import HiddenSearchMessages from '@components/page/HiddenSearchMessages.svelte';
import ProfileHideBtn from '@components/page/ProfileHideBtn.svelte';
import {
    activityDataListWrap,
    activityItemContentSelector,
    activityListItemsSelector,
    activityTitleSelector,
    commentMetaSelector,
    commentsListItemsSelector,
    commentsWrapSelector,
    discussionContentSelector,
    discussionHeaderSelector,
    discussionItemSelector,
    discussionListPageControlsSelector,
    discussionOptionsSelector,
    discussionsListItemsSelector,
    discussionsListSelector,
    profileEditBtnSelector,
    profileOptionsSelector,
    searchFormSelector,
    searchResultsListSelector,
} from '~/lib/constants/selectors';
import { loadStyles } from '~/lib/utils/browser/helpers';
import {
    createShadowRoot,
    extractActivityUsername,
    extractCommentUsername,
    extractDiscussionId,
    extractProfileUsername,
} from '~/lib/utils/helpers';
import {
    isHideHiddenCounterEnabled,
    isHidehideDiscussionsHideButtonEnabled,
    isHideMessageHideButtonEnabled,
    isHideProfileHideButtonEnabled,
} from '~/lib/utils/storage';

const createStyleElement = (cssStyles: string): HTMLStyleElement => {
	const style = document.createElement('style');
	style.innerHTML = cssStyles;

	return style;
};

const createDiscussionStyleElement = (): HTMLStyleElement => {
	const style = createStyleElement(`
    ul.Discussions li.ItemDiscussion:hover .custom-option {
      visibility: visible;
    }

    .custom-option {
      visibility: hidden;
      display: inline-block;
    }
`);

	return style;
};

const createCustomOptionElement = (
	discussionElement: Element,
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
): {
	appContainer: HTMLElement;
	appRoot: HTMLElement;
	shadowRoot: ShadowRoot;
} | null => {
	const optionsElement =
		discussionElement.querySelector<HTMLElement>('span.Options');
	const containerId = 'custom-option-el';

	if (optionsElement) {
		if (optionsElement.querySelector(`#${containerId}`)) {
			return null;
		}

		const appContainer = document.createElement('span');
		appContainer.id = containerId;
		appContainer.classList.add('custom-option');

		const shadowRoot = createShadowRoot(appContainer);
		const appRoot = document.createElement('span');
		const discussionId = extractDiscussionId(discussionElement.id);
		if (discussionId) appRoot.dataset.discussionId = `${discussionId}`;

		shadowRoot.appendChild(appRoot);

		return { appContainer, appRoot, shadowRoot };
	}
	return null;
};

async function renderDiscussionsListWithHideButton(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isRenderDiscussionsHidden =
		await isHidehideDiscussionsHideButtonEnabled();

	if (isRenderDiscussionsHidden) return;

	document.head.appendChild(createDiscussionStyleElement());

	const discussionElements = document.querySelectorAll<HTMLElement>(
		discussionsListItemsSelector,
	);

	const fragment = document.createDocumentFragment();
	const elementsToProcess: {
		optionsElement: HTMLElement;
		appContainer: HTMLElement;
		appRoot: HTMLElement;
		shadowRoot: ShadowRoot;
		insertBeforeRef: Node | null;
	}[] = [];

	for (const discussionElement of discussionElements) {
		const createdElements = createCustomOptionElement(
			discussionElement,
			cssPaths,
			render,
		);

		if (createdElements) {
			const optionsElement =
				discussionElement.querySelector<HTMLElement>('span.Options');
			const childOptionsElements = optionsElement?.children;
			const insertBeforeRef =
				childOptionsElements && childOptionsElements.length > 1
					? childOptionsElements[1]
					: childOptionsElements && childOptionsElements.length > 0
						? childOptionsElements[0]
						: null;

			elementsToProcess.push({
				optionsElement: optionsElement!,
				...createdElements,
				insertBeforeRef,
			});

			fragment.appendChild(createdElements.appContainer);
		}
	}

	await Promise.all(
		elementsToProcess.map((item) => loadStyles(item.shadowRoot, cssPaths)),
	);

	const batchSize = 25;
	for (let i = 0; i < elementsToProcess.length; i += batchSize) {
		const batch = elementsToProcess.slice(i, i + batchSize);
		await new Promise(requestAnimationFrame);

		for (const item of batch) {
			if (item.optionsElement && item.insertBeforeRef) {
				item.optionsElement.insertBefore(item.appContainer, item.insertBeforeRef);
			} else if (item.optionsElement) {
				item.optionsElement.appendChild(item.appContainer);
			}
		}
	}

	requestAnimationFrame(() => {
		elementsToProcess.forEach((item) => {
			render(item.appRoot);
		});
	});
}

async function renderProfile(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isRenderProfileHidden = await isHideProfileHideButtonEnabled();
	if (isRenderProfileHidden) return;

	const profileOptions = document.querySelector(profileOptionsSelector);
	if (!profileOptions) return;

	const containerId = 'custom-profile-el';

	if (profileOptions.querySelector(`#${containerId}`)) {
		return;
	}

	// Don't process user's own profile
	const editProfileBtn = profileOptions.querySelector(profileEditBtnSelector);
	if (editProfileBtn) return;

	const appContainer = document.createElement('span');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('span');

	const username = extractProfileUsername();
	if (username) appRoot.dataset.username = username;

	shadowRoot.appendChild(appRoot);

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	profileOptions.append(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderDiscussionContent(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isRenderDiscussionsHidden =
		await isHidehideDiscussionsHideButtonEnabled();
	if (isRenderDiscussionsHidden) return;

	const discussionContent = document.querySelector(discussionContentSelector);
	if (!discussionContent) return;

	const containerId = 'custom-discussion-el';

	if (discussionContent.querySelector(`#${containerId}`)) {
		return;
	}

	const discussionItemEl = discussionContent.querySelector(
		discussionHeaderSelector,
	);
	if (!discussionItemEl) return;

	const discussionOptionsEl = discussionItemEl.querySelector(
		discussionOptionsSelector,
	);
	if (!discussionOptionsEl) return;

	const appContainer = document.createElement('span');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('span');

	const discussionId = extractDiscussionId(discussionItemEl.id);
	if (discussionId) appRoot.dataset.discussionId = `${discussionId}`;

	shadowRoot.appendChild(appRoot);

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	discussionOptionsEl.prepend(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderHiddenDiscussionListContent(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesCountHidden = await isHideHiddenCounterEnabled();
	if (isMessagesCountHidden) return;

	const pageControlsEl = document.querySelector(
		discussionListPageControlsSelector,
	);

	if (!pageControlsEl) return;

	const containerId = 'custom-control-el';

	if (pageControlsEl.querySelector(`#${containerId}`)) {
		return;
	}

	const appContainer = document.createElement('span');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('span');

	shadowRoot.appendChild(appRoot);

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	pageControlsEl.prepend(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderHiddenActivitiesContent(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesCountHidden = await isHideHiddenCounterEnabled();
	if (isMessagesCountHidden) return;

	const dataListWrap = document.querySelector(activityDataListWrap);
	if (!dataListWrap) return;

	const containerId = 'custom-activity-el';

	if (dataListWrap.querySelector(`#${containerId}`)) {
		return;
	}

	const formWrapper = dataListWrap.querySelector('form.Activity > div');
	if (!formWrapper) return;

	const appContainer = document.createElement('div');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('div');
	appRoot.style.width = '100%';

	shadowRoot.appendChild(appRoot);

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	formWrapper.append(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderHiddenCommentListContent(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesCountHidden = await isHideHiddenCounterEnabled();
	if (isMessagesCountHidden) return;

	const commentsWrap = document.querySelector(commentsWrapSelector);
	if (!commentsWrap) return;

	const containerId = 'custom-comment-counter-el';

	if (commentsWrap.querySelector(`#${containerId}`)) {
		return;
	}

	const appContainer = document.createElement('span');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('div');

	shadowRoot.appendChild(appRoot);

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	commentsWrap.prepend(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderHiddenSearchListContent(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesCountHidden = await isHideHiddenCounterEnabled();
	if (isMessagesCountHidden) return;

	const searchResultsList = document.querySelector(searchResultsListSelector);
	if (!searchResultsList) return;

	const searchForm = document.querySelector(searchFormSelector);
	if (!searchForm) return;

	const containerId = 'custom-search-counter-el';

	if (searchForm.querySelector(`#${containerId}`)) {
		return;
	}

	const appContainer = document.createElement('span');
	appContainer.id = containerId;

	const shadowRoot = createShadowRoot(appContainer);
	const appRoot = document.createElement('div');

	const fragment = document.createDocumentFragment();
	fragment.appendChild(appContainer);

	shadowRoot.appendChild(appRoot);

	searchForm.appendChild(fragment);

	await loadStyles(shadowRoot, cssPaths);

	requestAnimationFrame(() => {
		render(appRoot);
	});
}

async function renderActivities(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesHideButtonHidden = await isHideMessageHideButtonEnabled();
	if (isMessagesHideButtonHidden) return;

	const activityElements = document.querySelectorAll<HTMLElement>(
		activityListItemsSelector,
	);

	if (!activityElements.length) return;

	const fragment = document.createDocumentFragment();
	const elementsToProcess: {
		itemContent: HTMLElement;
		appContainer: HTMLElement;
		appRoot: HTMLElement;
		shadowRoot: ShadowRoot;
		insertAfterEl: Element;
	}[] = [];

	for (const activityElement of activityElements) {
		const itemContent = activityElement.querySelector<HTMLElement>(
			activityItemContentSelector,
		);

		if (!itemContent) continue;

		const containerId = 'custom-item-el';

		if (itemContent.querySelector(`#${containerId}`)) {
			continue;
		}

		const titleEl = itemContent.querySelector(activityTitleSelector);
		if (!titleEl) continue;

		const appContainer = document.createElement('span');
		appContainer.id = containerId;
		appContainer.classList.add('custom-meta');

		const shadowRoot = createShadowRoot(appContainer);
		const appRoot = document.createElement('div');

		const username = extractActivityUsername(activityElement);
		if (username) appRoot.dataset.username = username;

		shadowRoot.appendChild(appRoot);

		elementsToProcess.push({
			itemContent,
			appContainer,
			appRoot,
			shadowRoot,
			insertAfterEl: titleEl,
		});

		fragment.appendChild(appContainer);
	}

	const commonAncestor = document.querySelector(
		activityListItemsSelector,
	)?.parentElement;

	if (commonAncestor) {
		commonAncestor.appendChild(fragment);
	} else {
		console.error('Could not find a common ancestor for activity elements.');
	}

	await Promise.all(
		elementsToProcess.map((item) => loadStyles(item.shadowRoot, cssPaths)),
	);

	const batchSize = 25;
	for (let i = 0; i < elementsToProcess.length; i += batchSize) {
		const batch = elementsToProcess.slice(i, i + batchSize);
		await new Promise(requestAnimationFrame); 

		for (const item of batch) {
			if (item.appContainer.isConnected && item.insertAfterEl.isConnected) {
				item.insertAfterEl.after(item.appContainer);
			}
		}
	}

	requestAnimationFrame(() => {
		elementsToProcess.forEach((item) => {
			render(item.appRoot);
		});
	});
}

async function renderDiscussionComments(
	cssPaths: string[],
	render: (appRoot: HTMLElement) => void,
) {
	const isMessagesHideButtonHidden = await isHideMessageHideButtonEnabled();
	if (isMessagesHideButtonHidden) return;

	const commentElements = document.querySelectorAll<HTMLElement>(
		commentsListItemsSelector,
	);

	if (!commentElements.length) return;

	const fragment = document.createDocumentFragment();
	const elementsToProcess: {
		metaElement: HTMLElement;
		appContainer: HTMLElement;
		appRoot: HTMLElement;
		shadowRoot: ShadowRoot;
	}[] = [];

	for (const commentElement of commentElements) {
		const metaElement =
			commentElement.querySelector<HTMLElement>(commentMetaSelector);

		if (!metaElement) continue;

		const containerId = 'custom-meta-el';

		if (metaElement.querySelector(`#${containerId}`)) {
			continue;
		}

		const appContainer = document.createElement('span');
		appContainer.id = containerId;
		appContainer.classList.add('custom-meta');

		const shadowRoot = createShadowRoot(appContainer);
		const appRoot = document.createElement('span');

		const username = extractCommentUsername(commentElement);
		if (username) appRoot.dataset.username = username;

		shadowRoot.appendChild(appRoot);

		elementsToProcess.push({
			metaElement,
			appContainer,
			appRoot,
			shadowRoot,
		});

		fragment.appendChild(appContainer);
	}

	const commonAncestor = document.querySelector(
		commentsListItemsSelector,
	)?.parentElement;

	if (commonAncestor) {
		commonAncestor.appendChild(fragment);
	} else {
		console.error('Could not find a common ancestor for comment elements.');
	}

	await Promise.all(
		elementsToProcess.map((item) => loadStyles(item.shadowRoot, cssPaths)),
	);

	const batchSize = 25;
	for (let i = 0; i < elementsToProcess.length; i += batchSize) {
		const batch = elementsToProcess.slice(i, i + batchSize);
		await new Promise(requestAnimationFrame);

		for (const item of batch) {
			if (item.appContainer.isConnected && item.metaElement.isConnected) {
				item.metaElement.append(item.appContainer);
			}
		}
	}

	requestAnimationFrame(() => {
		elementsToProcess.forEach((item) => {
			render(item.appRoot);
		});
	});
}

export default async function renderContent() {
	const cssPaths = import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS;

	const renderedActions = new Set();

	const renderMap = [
		{
			key: 'renderDiscussionsListWithHideButton',
			selector: discussionItemSelector,
			render: () =>
				renderDiscussionsListWithHideButton(cssPaths, (appRoot) => {
					new DiscussionHider({ target: appRoot });
				}),
		},
		{
			key: 'renderHiddenSearchListContent',
			selector: searchResultsListSelector,
			render: () =>
				renderHiddenSearchListContent(cssPaths, (appRoot) => {
					new HiddenSearchMessages({ target: appRoot });
				}),
		},
		{
			key: 'renderHiddenActivitiesContent',
			selector: activityDataListWrap,
			render: () =>
				renderHiddenActivitiesContent(cssPaths, (appRoot) => {
					new HiddenActivities({ target: appRoot });
				}),
		},
		{
			key: 'renderHiddenCommentListContent',
			selector: commentsWrapSelector,
			render: () =>
				renderHiddenCommentListContent(cssPaths, (appRoot) => {
					new HiddenCommentsMessages({ target: appRoot });
				}),
		},
		{
			key: 'renderHiddenDiscussionListContent',
			selector: discussionsListSelector,
			render: () =>
				renderHiddenDiscussionListContent(cssPaths, (appRoot) => {
					new HiddenDiscussionsMessages({ target: appRoot });
				}),
		},
		{
			key: 'renderProfile',
			selector: profileOptionsSelector,
			render: () =>
				renderProfile(cssPaths, (appRoot) => {
					new ProfileHideBtn({ target: appRoot });
				}),
		},
		{
			key: 'renderDiscussionContent',
			selector: discussionContentSelector,
			render: () =>
				renderDiscussionContent(cssPaths, (appRoot) => {
					new DiscussionHider({ target: appRoot });
				}),
		},
		{
			key: 'renderActivities',
			selector: activityListItemsSelector,
			render: () =>
				renderActivities(cssPaths, (appRoot) => {
					new ActivityHider({ target: appRoot });
				}),
		},
		{
			key: 'renderDiscussionComments',
			selector: commentsListItemsSelector,
			render: () =>
				renderDiscussionComments(cssPaths, (appRoot) => {
					new CommentHider({ target: appRoot });
				}),
		},
	];

	async function onMutation(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				processNodes(mutation.addedNodes);
			}
		}
	}

	async function processNodes(nodes: NodeList | Node[]) {
		for (const node of nodes) {
			if (node.nodeType !== Node.ELEMENT_NODE) continue;

			for (const { selector, render, key } of renderMap) {
				if ((node as Element).matches(selector) && !renderedActions.has(key)) {
					render();
					renderedActions.add(key);
				}
			}
		}
	}

	const observer = new MutationObserver(onMutation);
	await processNodes([document.documentElement]);
	observer.observe(document, { childList: true, subtree: true });

	processNodes(
		document.querySelectorAll(
			renderMap.map(({ selector }) => selector).join(', '),
		),
	);
}
