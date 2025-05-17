<script lang="ts">
	import HiddenDiscussionsList from '@components/HiddenDiscussionsList.svelte';
	import Option from '@components/Option.svelte';
	import {
		hideDiscussionsHideButtonStorage,
	} from '~/lib/constants/syncStorage';
</script>

<HiddenDiscussionsList />

<Option
	storageId={hideDiscussionsHideButtonStorage}
	name={`Remove the "Hide" button on discussion pages`}
/>
