<script lang="ts">
	import KeywordsList from '@components/KeywordsList.svelte';
	import Option from '@components/Option.svelte';
	import {
		hideDiscussionByKeywordsInTitleStorage,
		hideCommentsByKeywordsStorage,
		hideSearchResultsByKeywordsInTitleStorage,
		hideSearchResultsByKeywordsInBodyStorage,
	} from '~/lib/constants/syncStorage';
</script>

<KeywordsList />

<Option
	storageId={hideSearchResultsByKeywordsInTitleStorage}
	name={`Filter search results by keywords in discussion titles`}
/>
<Option
	storageId={hideSearchResultsByKeywordsInBodyStorage}
	name={`Filter search results by keywords in discussion bodies`}
/>
<Option
	storageId={hideCommentsByKeywordsStorage}
	name={`Filter user comments by keywords`}
/>

<Option
	storageId={hideDiscussionByKeywordsInTitleStorage}
	name={`Filter discussions by keywords in titles`}
/>
