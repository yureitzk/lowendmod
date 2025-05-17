<script lang="ts">
	import pkg from '~/../package.json';
</script>

<div>
	<span>{pkg.displayName}</span>
	<span>{pkg.version}</span>
</div>

<style>
	div {
		background-color: #444;
		color: #ddd;
		padding: 10px 14px;
	}
</style>
