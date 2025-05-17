<script lang="ts">
	import HiddenUsersList from '@components/HiddenUsersList.svelte';
	import Option from '@components/Option.svelte';
	import {
		hideProfileHideButtonStorage,
		hideUserCommentsStorage,
		hideUserDiscussionsStorage,
		hideUserSearchResultsStorage,
	} from '~/lib/constants/syncStorage';
</script>

<HiddenUsersList />

<Option
	storageId={hideUserCommentsStorage}
	name={'Hide comments from hidden users'}
/>
<Option
	storageId={hideUserDiscussionsStorage}
	name={'Hide discussions started by hidden users'}
/>
<Option
	storageId={hideUserSearchResultsStorage}
	name={'Exclude hidden users from search results'}
/>
<Option
	storageId={hideProfileHideButtonStorage}
	name={`Remove the "Hide" button on user profiles`}
/>
