import {
    activityBodyTextSelector,
    activityCommentBodyTextSelector,
    activityCommentSelector,
    activitySelector,
    commentBodyTextSelector,
    commentItemSelector,
    discussionItemSelector,
    discussionTitleSelector,
    searchResultsBodyTextSelector,
    searchResultSelector,
    searchResultsTitleSelector,
} from '~/lib/constants/selectors';
import type { User } from '~/lib/models/User';
import {
    extractActivityCommentUsername,
    extractActivityUsername,
    extractCommentUsername,
    extractDiscussionAuthorUsername,
    extractDiscussionId,
    extractSearchResultUsername,
    hideCommentSignature,
    toggleActivitiesComments,
    toggleActivity,
    toggleActivityComment,
    toggleCommentElements,
    toggleDiscussions,
    toggleSearchResult,
    toggleSearchResultElements
} from '~/lib/utils/helpers';
import {
    getDiscussionsFromStorage,
    getKeywordsFromStorage,
    getUsersFromStorage,
    isHideCommentsByKeywordsEnabled,
    isHideDiscussionByKeywordsInTitleEnabled,
    isHideSearchResultsByKeywordsInBodyEnabled,
    isHideSearchResultsByKeywordsInTitleEnabled,
    isHideSignaturesEnabled,
    isHideUserCommentsEnabled,
    isHideUserDiscussionsEnabled,
    isHideUserSearchResultsEnabled,
} from '~/lib/utils/storage';

const toUsernameSet = (users: User[]) => new Set(users.map((u) => u.username));
const toLowerKeywords = (keywords: string[]) =>
	keywords.map((k) => k.toLowerCase());

const isMatchedUser = (
	username: string | null,
	usernameSet: Set<string>,
): boolean => {
	return Boolean(username && usernameSet.has(username));
};

const isMatchedKeyword = (
	content: string,
	lowerKeywords: string[],
	isEnabled: boolean,
): boolean => {
	if (!isEnabled) return false;

	return lowerKeywords.some((kw) => {
		const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		const regex = kw.includes(' ')
			? new RegExp(`${escapedKw}`, 'i')
			: new RegExp(`\\b${escapedKw}\\b`, 'i');

		return regex.test(content);
	});
};

const handleActivitiesComments = (
	users: User[],
	keywords: string[],
): Promise<void> => {
	return new Promise(async (resolve) => {
		const isHideUserComments = await isHideUserCommentsEnabled();
		if (!isHideUserComments) return resolve();

		const isKeywordFilterEnabled = await isHideCommentsByKeywordsEnabled();

		const usernameSet = toUsernameSet(users);
		const lowerKeywords = isKeywordFilterEnabled ? toLowerKeywords(keywords) : [];

		const activitiesComments: NodeListOf<HTMLElement> = document.querySelectorAll(
			activityCommentSelector,
		);

		activitiesComments.forEach((comment) => {
			const username = extractActivityCommentUsername(comment);
			const activityCommentBody = comment?.querySelector(
				activityCommentBodyTextSelector,
			);
			const content = activityCommentBody?.textContent?.toLowerCase() || '';

			const matchedUser = isMatchedUser(username, usernameSet);
			const matchedKeyword = isMatchedKeyword(
				content,
				lowerKeywords,
				isKeywordFilterEnabled,
			);

			if (matchedKeyword) {
				toggleActivityComment(comment, false);
			} else if (username && matchedUser) {
				toggleActivitiesComments(username, false);
			}
		});

		resolve();
	});
};

export const toggleActivityElements = (
	activities: HTMLElement[],
	show: boolean,
) => {
	activities.forEach((activityEl) => {
		toggleActivity(activityEl, show);
	});
};

const handleActivities = async (
	users: User[],
	keywords: string[],
): Promise<void> => {
	const isHideActivities = await isHideUserCommentsEnabled();
	if (!isHideActivities) return;

	const isKeywordFilterEnabled = await isHideCommentsByKeywordsEnabled();

	const usernameSet = toUsernameSet(users);
	const lowerKeywords = isKeywordFilterEnabled ? toLowerKeywords(keywords) : [];

	const activities: NodeListOf<HTMLElement> =
		document.querySelectorAll(activitySelector);

	const activitiesToHideByKeyword: HTMLElement[] = [];
	const activitiesToHideByUser: Map<string, HTMLElement[]> = new Map();

	for (const activity of activities) {
		const username = extractActivityUsername(activity);
		const activityBody = activity?.querySelector(activityBodyTextSelector);
		const content = activityBody?.textContent?.toLowerCase() || '';

		const matchedKeyword = isMatchedKeyword(
			content,
			lowerKeywords,
			isKeywordFilterEnabled,
		);

		const matchedUser = isMatchedUser(username, usernameSet);

		if (matchedKeyword) {
			activitiesToHideByKeyword.push(activity);
		} else if (username && matchedUser) {
			if (!activitiesToHideByUser.has(username)) {
				activitiesToHideByUser.set(username, []);
			}
			activitiesToHideByUser.get(username)!.push(activity);
		}
	}

	toggleActivityElements(activitiesToHideByKeyword, false);

	for (const [username, activities] of activitiesToHideByUser.entries()) {
		activities.forEach((activity) => {
			toggleActivity(activity, false);
		});
	}
};

const handleSearchResults = async (
	users: User[],
	keywords: string[],
): Promise<void> => {
	const isHideSearchResults = await isHideUserSearchResultsEnabled();
	if (!isHideSearchResults) return;

	const [isHideByTitle, isHideByBody] = await Promise.all([
		isHideSearchResultsByKeywordsInTitleEnabled(),
		isHideSearchResultsByKeywordsInBodyEnabled(),
	]);

	const usernameSet = toUsernameSet(users);
	const lowerKeywords =
		isHideByTitle || isHideByBody ? toLowerKeywords(keywords) : [];

	const searchResults: NodeListOf<HTMLElement> =
		document.querySelectorAll(searchResultSelector);

	const resultsToHideByKeyword: HTMLElement[] = [];
	const resultsToHideByUser: Map<string, HTMLElement[]> = new Map();

	for (const result of searchResults) {
		const username = extractSearchResultUsername(result);

		const titleText =
			result
				.querySelector(searchResultsTitleSelector)
				?.textContent?.toLowerCase() || '';
		const bodyText =
			result
				.querySelector(searchResultsBodyTextSelector)
				?.textContent?.toLowerCase() || '';

		const matchedTitleKeyword = isMatchedKeyword(
			titleText,
			lowerKeywords,
			isHideByTitle,
		);
		const matchedBodyKeyword = isMatchedKeyword(
			bodyText,
			lowerKeywords,
			isHideByBody,
		);
		const matchedUser = isMatchedUser(username, usernameSet);

		if (matchedTitleKeyword || matchedBodyKeyword) {
			resultsToHideByKeyword.push(result);
		} else if (username && matchedUser) {
			if (!resultsToHideByUser.has(username)) {
				resultsToHideByUser.set(username, []);
			}
			resultsToHideByUser.get(username)!.push(result);
		}
	}

	toggleSearchResultElements(resultsToHideByKeyword, false);

	for (const [username, results] of resultsToHideByUser.entries()) {
		results.forEach((result) => {
			toggleSearchResult(result, false);
		});
	}
};

const handleComments = async (
	users: User[],
	keywords: string[],
): Promise<void> => {
	const isHideUserComments = await isHideUserCommentsEnabled();
	if (!isHideUserComments) {
		return;
	}

	const isKeywordFilterEnabled = await isHideCommentsByKeywordsEnabled();
	const isSignatureHidingEnabled = await isHideSignaturesEnabled();

	const usernameSet = toUsernameSet(users);
	const lowerKeywords = isKeywordFilterEnabled ? toLowerKeywords(keywords) : [];

	const comments: NodeListOf<HTMLElement> =
		document.querySelectorAll(commentItemSelector);

	const commentsToHide: HTMLElement[] = [];

	for (const comment of comments) {
		const username = extractCommentUsername(comment);
		const commentBodyText = comment.querySelector(commentBodyTextSelector);
		const content = commentBodyText?.textContent?.toLowerCase() || '';

		const matchedKeyword = isMatchedKeyword(
			content,
			lowerKeywords,
			isKeywordFilterEnabled,
		);

		if (isSignatureHidingEnabled) hideCommentSignature(comment);

		if (matchedKeyword) {
			commentsToHide.push(comment);
		} else if (username && isMatchedUser(username, usernameSet)) {
			commentsToHide.push(comment);
		}
	}

	toggleCommentElements(commentsToHide, false);
};

const handleDiscussions = async (
	users: User[],
	discussionIds: number[],
	keywords: string[],
): Promise<void> => {
	const isHideUserDiscussions = await isHideUserDiscussionsEnabled();
	if (!isHideUserDiscussions) return;

	const isHideByKeyword = await isHideDiscussionByKeywordsInTitleEnabled();
	const usernameSet = toUsernameSet(users);
	const lowerKeywords = isHideByKeyword ? toLowerKeywords(keywords) : [];
	const discussionIdsSet = new Set(discussionIds);

	const discussions: NodeListOf<HTMLElement> = document.querySelectorAll(
		discussionItemSelector,
	);

	const discussionIdsToHide: number[] = [];

	for (const discussion of discussions) {
		const username = extractDiscussionAuthorUsername(discussion);
		const discussionTitleElement = discussion.querySelector(
			discussionTitleSelector,
		);
		const content = discussionTitleElement?.textContent?.toLowerCase() || '';

		const matchedUser = isMatchedUser(username, usernameSet);
		const matchedKeyword = isMatchedKeyword(
			content,
			lowerKeywords,
			isHideByKeyword,
		);

		const discussionId = extractDiscussionId(discussion.id);

		if (discussionId === null || discussionId === undefined) continue;

		if (matchedUser || matchedKeyword || discussionIdsSet.has(discussionId)) {
			discussionIdsToHide.push(discussionId);
		}
	}

	toggleDiscussions(discussionIdsToHide, false);
};

export default async function cleanContent() {
	const [discussions, users, keywords] = await Promise.all([
		getDiscussionsFromStorage(),
		getUsersFromStorage(),
		getKeywordsFromStorage(),
	]);

	const discussionIds: number[] = discussions.map((d) => d.id);
	const executedHandlers = new Set<string>();

	const handlerMap = [
		{
			key: 'handleDiscussions',
			selector: discussionItemSelector,
			handler: async () => {
				await handleDiscussions(users, discussionIds, keywords);
			},
		},
		{
			key: 'handleComments',
			selector: commentItemSelector,
			handler: async () => {
				await handleComments(users, keywords);
			},
		},
		{
			key: 'handleSearchResults',
			selector: searchResultSelector,
			handler: async () => {
				await handleSearchResults(users, keywords);
			},
		},
		{
			key: 'handleActivities',
			selector: activitySelector,
			handler: async () => {
				await handleActivities(users, keywords);
				await handleActivitiesComments(users, keywords);
			},
		},
	];

	const initialNodes = document.querySelectorAll(
		handlerMap.map(({ selector }) => selector).join(', '),
	);

	const observer = new MutationObserver(onMutation);
	await processNodes([document.documentElement]);
	observer.observe(document, { subtree: true, childList: true });

	async function onMutation(mutations: MutationRecord[]) {
		for (const mutation of mutations) {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				await processNodes(mutation.addedNodes);
			}
		}
	}

	async function processNodes(nodes: NodeList | Node[]) {
		for (const node of nodes) {
			if (node.nodeType !== Node.ELEMENT_NODE) continue;

			for (const { selector, handler, key } of handlerMap) {
				if ((node as Element).matches(selector) && !executedHandlers.has(key)) {
					await handler();
					executedHandlers.add(key);
				}
			}
		}
	}

	await processNodes(initialNodes);
}
