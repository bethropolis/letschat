<script>
  import { onDestroy } from "svelte";

let src;
let isOpen = false;

export function openLightbox(url) {
  src = url;
  isOpen = true;
  disableScroll();
}

export function closeLightbox() {
  src = null;
  isOpen = false;
  enableScroll();
}

const disableScroll = () => {
  document.body.style.overflow = "hidden";
};

const enableScroll = () => {
  document.body.style.overflow = "auto";
};

onDestroy(() => {
  enableScroll();
});
</script>

{#if isOpen}
  <div class="lightbox">
    <div class="header">
      <slot name="header" />
    </div>

    <div class="lightbox-background" on:click={closeLightbox} />
    <div class="lightbox-image-container">
      <img {src} alt="Image" />
    </div>
    <slot name="footer" />
    <div class="lightbox-actions">
        <slot/>
    </div>
  </div>
{/if}

<style>
  .image-container {
    cursor: pointer;
  }

  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .lightbox-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(2, 2, 2, 0.94);
    z-index: 101;
  }

  .lightbox-image-container {
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    z-index: 102;
  }
  .close{
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    color: var(--color-light);
    z-index: 102;
  }

  .lightbox-image-container img {
    max-width: 600px;
    width: 100%;
    height: auto;
  }
  .lightbox-actions {
    padding: 10px 0;
    z-index: 103;
    width: 100%;
    height: auto;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    justify-content: space-evenly;
  }
</style>
