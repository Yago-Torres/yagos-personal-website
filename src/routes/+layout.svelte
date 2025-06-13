<script lang="ts">
  import { base } from '$app/paths';
  import '../app.css';
</script>

<svelte:head>
  <!-- favicon lives in your `static/` folder -->
  <link rel="icon" href={base + '/favicon.png'} />

  <!-- Cloudflare Web Analytics beacon -->
  
</svelte:head>

<slot />
