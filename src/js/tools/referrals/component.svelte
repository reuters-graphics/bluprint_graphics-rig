<script>
import metadata from './metadata.json';
import Link from './Link.svelte';

</script>
{#if metadata.length > 0}
<section class='referral-container container-md-up mt-3 mb-3'>
  <h3>More from Reuters Graphics</h3>
  <nav class='referral-rail row'>
    {#each metadata as referral}
      <Link {...referral} />
    {/each}
  </nav>
</section>
{/if}

<style>
.referral-container{
  padding: 0 15px;
}
</style>
