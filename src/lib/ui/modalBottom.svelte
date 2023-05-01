<script>
	import { fly } from 'svelte/transition';
  export let isOpen = false;
  let startY = 0;
  let startHeight = 0;
  let handle = null;
  let max = false;
  let isInfo = true;

  export let info = {};
  const toggleSheet = () => {
    if (handle) {
      handle.parentNode.style.height = `fit-content`;
    }
    isOpen = !isOpen;
  };
  const resize = () => {
    if (!handle) return;
    if (!max) return;
    handle.parentNode.style.height = `fit-content`;
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    startY = event.touches[0].clientY;
    startHeight = handle.parentNode.offsetHeight;
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (event) => {
    const deltaY = startY - event.touches[0].clientY;
    const newHeight = startHeight + deltaY;
    if (newHeight >= 500) return (max = true);
    handle.parentNode.style.height = `${newHeight}px`;
    requestAnimationFrame(() => {
      handle.parentNode.style.height = `${newHeight}px`;
    });
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };
  function showInfo(info) {
    if (info) return false;
    return;
  }
  $: isInfo = showInfo(info);

  $: if (isOpen == true) {
    // disable scroll when modal is open
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
</script>

<main>
  {#if isOpen}
    <div class="bottom-sheet open" on:dblclick={resize} transition:fly={{ y: 200, duration: 500 }}>
      <div class="header">
        <div
          class="bottom-sheet-handle"
          on:click={toggleSheet}
          on:touchstart={handleTouchStart}
          bind:this={handle}
        />

        <div class="dropdown" hidden={isInfo}>
          <i class="far fa-sharp {info.icon} icon" />
          <div class="dropdown-content">
            {info.txt}
          </div>
        </div>
      </div>
      <slot />
    </div>
  {/if}
</main>

<style>
  main {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 99;
  }
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-post);
    padding: 10px 30px 30px;
    border-radius: 24px 24px 0 0;
    transition: transform 0.5s ease-out;
    transform: translateY(100%);
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-weight: 500;
    user-select: none;
    overflow: hidden;
  }

  .bottom-sheet.open {
    transform: translateY(0);
  }

  .bottom-sheet-handle {
    width: 40px;
    height: 5px;
    border-radius: 5px;
    background-color: var(--color-icon);
    margin: 10px auto 30px;
    cursor: pointer;
    pointer-events: auto;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    z-index: 1;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 7px 16px;
    border-radius: 4px;
    right: 5px;
    width: 40%;
  }

  .dropdown:hover .dropdown-content {
    display: flex;
    flex-wrap: wrap;
  }
  .icon {
    position: absolute;
    top: 16px;
    right: 1em;
    font-size: 1.4rem;
    color: var(--color-icon);
  }
</style>
