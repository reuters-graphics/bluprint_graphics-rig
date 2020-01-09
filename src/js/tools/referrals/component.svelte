<script>
import metadata from './metadata.json';
import Link from './Link.svelte';
import Badge from './Badge.svelte';

</script>
{#if metadata.length > 0}
<section class='referral-container'>
  <Badge />
  <nav class='referral-rail row'>
    {#each metadata as referral}
      <Link {...referral} />
    {/each}
  </nav>
</section>
{/if}
