import { base } from '$app/paths';

<script lang="ts">
    import { base } from '$app/paths';
	import '../app.css';
	
	let { children } = $props();
</script>

<link rel="icon" href={base+'/favicon.ico'} />

{@render children()}
