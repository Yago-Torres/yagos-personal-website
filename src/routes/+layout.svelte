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
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={JSON.stringify({
      token: '950e2fe0c7e64a23b943112b4c16d1b9'
    })}
    crossorigin="anonymous"
  	></script>
</svelte:head>

<slot />
