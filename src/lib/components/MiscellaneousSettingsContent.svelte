<script lang="ts">
	import Option from '@components/Option.svelte';
	import {
		hideBadgeCountStorage,
		hideHiddenCounterStorage,
		hideMessageHideButtonStorage,
		hideSignaturesStorage
	} from '~/lib/constants/syncStorage';
</script>

<Option
	storageId={hideBadgeCountStorage}
	name={`Hide badge counter`}
/>
<Option
	storageId={hideMessageHideButtonStorage}
	name={`Remove the "Hide" button from messages`}
/>
<Option
	storageId={hideHiddenCounterStorage}
	name={`Hide the count of hidden messages and the "Show" button`}
/>
<Option
	storageId={hideSignaturesStorage}
	name={`Hide message signatures`}
/>
