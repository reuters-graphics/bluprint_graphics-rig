<script>
import { onMount } from 'svelte';
import Link from './Link.svelte';
import Badge from './Badge.svelte';

let metadata;

onMount(() => {
  fetch('https://graphics.thomsonreuters.com/data/reuters-graphics/homepage/latest.json')
    .then(resp => resp.json())
    .then((data) => {
      metadata = data.slice(0, 4).map(({ url, image, title, description }) => ({ url, image, title, description }));
    });
});
</script>
{#if metadata}
<section class='referral-container'>
  <Badge />
  <nav class='referral-rail row'>
    {#each metadata as referral}
      <Link {...referral} />
    {/each}
  </nav>
</section>
{/if}
