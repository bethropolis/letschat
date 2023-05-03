<script>
  import { fly } from "svelte/transition";

  export let isOpen = false;
  export let info = {};

  let startY, startHeight, max;
  let handle = null;
  let isInfo = true;

  function toggleSheet() {
    if (handle) {
      handle.parentNode.style.height = `fit-content`;
    }
    isOpen = !isOpen;
  }

  function resize() {
    if (!handle) return;
    if (!max) return;
    handle.parentNode.style.height = `fit-content`;
  }

  function showInfo(info) {
    return !info;
  }

  $: isInfo = showInfo(info);

  function touchHandlers(node) {
    let sheet = node.parentNode;

    function handleTouchStart(event) {
      event.preventDefault();
      startY = event.touches[0].clientY;
      startHeight = sheet.offsetHeight;
      max = false;
      sheet.classList.add("is-resizing");
    }

    function handleTouchMove(event) {
      const deltaY = startY - event.touches[0].clientY;
      const newHeight = startHeight + deltaY;
      if (newHeight >= 500) {
        max = true;
      } else {
        sheet.style.height = `${newHeight}px`;
        requestAnimationFrame(() => {
          sheet.style.height = `${newHeight}px`;
        });
      }
    }

    function handleTouchEnd() {
      sheet.classList.remove("is-resizing");
    }

    node.addEventListener("touchstart", handleTouchStart);
    node.addEventListener("touchmove", handleTouchMove);
    node.addEventListener("touchend", handleTouchEnd);

    return {
      destroy() {
        document.body.style.overflow = "auto";
        node.removeEventListener("touchstart", handleTouchStart);
        node.removeEventListener("touchmove", handleTouchMove);
        node.removeEventListener("touchend", handleTouchEnd);
      },
    };
  }

  $: if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
</script>

<main>
  {#if isOpen}
    <div
      class="bottom-sheet open"
      on:dblclick={resize}
      transition:fly={{ y: 200, duration: 500 }}
    >
      <div class="header">
        <div
          class="bottom-sheet-handle"
          on:click={toggleSheet}
          bind:this={handle}
          use:touchHandlers
        />

        <div class="dropdown" hidden={isInfo}>
          {#if info.type == "info"}
            <i class="far fa-sharp {info.icon} icon" />
            <div class="dropdown-content">
              {info.txt}
            </div>
          {:else if info.type == "action"}
            <i
              class="fa fa-sharp fa-light {info.icon} icon"
              on:click={() => {
                info.action();
              }}
            />
          {/if}
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
