<script>
  export let url;
  export let image;
  export let title;
  export let description;
</script>

<div class='referral' title={description}>
  <a href={url}>
    <div class='image' style={`background-image: url(${image});`}></div>
    <p>{title}</p>
  </a>
</div>


<style>
.image {
  width: 100%;
  padding-bottom: 50%;
  background-size: cover;
  background-position: 50%;
}
</style>
