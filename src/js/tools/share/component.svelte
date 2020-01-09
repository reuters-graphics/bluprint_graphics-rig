<script>
import classnames from 'classnames';
import Fa from 'svelte-fa';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import throttle from 'lodash/throttle';
import handleTweet from './utils/twitter';
import handlePost from './utils/facebook';

const handleShare = async function() {
  if (showSecondaryDialogue) {
    showSecondaryDialogue = false;
    return;
  }

  if (navigator && navigator.share) {
    try {
      await navigator.share({
        title: 'A page',
        text: 'Get your description here',
        url: window.location.href,
      });
      // Otherwise copy URL to a clipboard
    } catch (err) {
      console.log('Share error', err);
    }
  } else {
    showSecondaryDialogue = true;
  }
};

let lastScroll = 0;
let showShare = false;
let showSecondaryDialogue = false;

function handleScroll() {
  if (lastScroll > window.scrollY) {
    if (!showShare) {
      showShare = true;
    }
  } else {
    if (showShare) {
      if (showSecondaryDialogue) {
        showSecondaryDialogue = false;
      } else {
        showShare = false;
      }
    }
  }
  lastScroll = window.scrollY;
}

window.addEventListener('scroll', throttle(handleScroll, 500));
</script>


<div class={classnames('sharetool', { active: showShare })}>
  <div class={classnames('drawer', { active: showSecondaryDialogue })}>
    <button
      on:click={handleShare}
      title="Share this!"
      disabled={showSecondaryDialogue}
    >
      <Fa fw icon={faShareAlt} />
    </button>
    <button on:click={handleTweet} title="Twitter">
      <Fa fw icon={faTwitter} />
    </button>
    <button on:click={handlePost} title="Facebook">
      <Fa fw icon={faFacebookF} />
    </button>
  </div>
</div>


<style>
.sharetool.active {
  bottom: 10px;
}

.sharetool {
  position: fixed;
  bottom: -5rem;
  right: 10px;
  transition: all 0.2s;
  z-index: 9999;
}

.sharetool button {
  background: #343a40;
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  font-size: 1.25rem;
  text-align: center;
  height: 2.25rem;
  width: 2.25rem;
  padding: 2px 2px 2px 1px;
  outline: none !important;
  transition: color 0.2s;
  cursor: pointer;
}

.sharetool button:active {
  transform: translate(1px, 1px);
}

.sharetool button:disabled {
  background: white;
  color: #ddd;
  cursor: default;
}

.drawer {
  width: calc(2.25rem + 4px);
  overflow-x: hidden;
  transition: width 0.2s;
  white-space: nowrap;
  padding: 2px;
}

.drawer.active {
  width: calc(7.25rem + 4px);
}

@media only screen and (max-width: 600px) {
  .sharetool button {
    font-size: 1.75rem;
    height: 3rem;
    width: 3rem;
    padding-top: 2px;
  }

  .drawer {
    width: calc(3rem + 4px);
  }

  .drawer.active {
    width: calc(9.5rem + 4px);
  }
}
</style>
