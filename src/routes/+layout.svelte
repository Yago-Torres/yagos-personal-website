<script lang="ts">
  import { base } from '$app/paths';
  import '../app.css';
</script>

<svelte:head>
  <!-- favicon lives in your `static/` folder -->
  <link rel="icon" href={base + '/favicon.png'} />

  <!-- Cloudflare Web Analytics beacon -->
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
    data-cf-beacon={JSON.stringify({ token: '950e2fe0c7e64a23b943112b4c16d1b9' })}
  	></script>
</svelte:head>

<slot />
