<script>
  export let url;
  export let image;
  export let title;
  export let description;
</script>

<div class='referral-link col-12 col-sm-6 col-md-4 col-lg-3' title={description}>
  <a href={url}>
    <div class='image' style={`background-image: url(${image});`}></div>
    <p>{title}</p>
  </a>
</div>


<style>
.referral-link{

}

.image {
  width: 100%;
  padding-bottom: 50%;
  background-size: cover;
  background-position: 50%;
}
</style>
