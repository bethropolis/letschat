<!-- header.svelte -->
<script>
  import { current, is_playing } from "../store.js";
  import { onMount } from "svelte";
  import { nav, isCurrentPage } from "../route.js";
  import { DB } from "../db";
  import { snack } from "../snack";
  export let navOptions = [];
  export let title = "" || null;
  export let backTo = "";
  export let locked = false;
  let backButtonVisible = false;

  // Define a variable to store the timer
  let timer;

  function handleBackButtonClick(to) {
    // handle back button click here
    if (to !== "") {
      nav(to);
    }

    if (backButtonVisible && !to) {
      // go to previous page -1
      history.back();
      backButtonVisible = false;
    }
  }
  function togglePlay() {
    if (!$is_playing) {
      $current.play();
      $is_playing = true;
      if(!DB("get","AudioTip")){
        snack("Hold play/pause to remove player")
      }
    } else {
      $current.pause();
      $is_playing = false;
    }
  }

  onMount(() => {
    if (!isCurrentPage("home")) {
      backButtonVisible = true;
    }
  });

  function handleMousedown(event) {
    // Start a timer that will run after 500ms
    timer = setTimeout(() => {
      $current.pause();
      $current = null;
      $is_playing = false;
      snack("Music player stopped");
    }, 500);
  }

  // Define a function to handle the mouseup event
  function handleMouseup(event) {
    clearTimeout(timer);
  }
</script>

<main class:locked>
  <div class="header">
    {#if backButtonVisible}
      <button
        class="back-button"
        on:click={() => handleBackButtonClick(backTo)}
      >
        <span class="fas fa-chevron-left" />
      </button>
    {/if}

    {#if typeof title == "object" && title?.title == "my profile"}
      <h1 class="header-title" on:click={eval(title?.action)}>
        {@html title?.title}
        <span class="fa fa-chevron-down" />
      </h1>
    {:else}
      <h1 class="header-title">{@html title}</h1>
    {/if}

    <div class="header-icon">
      {#if navOptions.length > 0}
        {#each navOptions as option}
          {#if option.type === "icon" || !option.type}
            <i class={option.icon} on:click={() => nav(option.link)} />
          {:else if option.type === "action"}
            <i class={option.icon} on:click={() => eval(option.action)} />
          {:else if option.type === "drop"}
            <div class="dropdown">
              <i class={option.icon} />
              <div class="dropdown-content">
                {@html option.drop_down}
              </div>
            </div>
          {/if}
        {/each}
      {/if}

      <slot />
      {#if $current instanceof HTMLAudioElement}
        {#if $is_playing}
          <i
            class="fas fa-pause music"
            on:click={togglePlay}
            on:touchstart={handleMousedown}
            on:touchend={handleMouseup}
          />
        {:else}
          <i
            class="fas fa-play music"
            on:click={togglePlay}
            on:touchstart={handleMousedown}
            on:touchend={handleMouseup}
          />
        {/if}
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5vh;
    background-color: var(--color-light);
    z-index: 100;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .locked {
    position: sticky;
    top: 0;
  }

  .back-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    color: var(--color-text);
    margin-right: 10px;
  }

  .header-title {
    font-size: calc(13px + 1vh);
    font-weight: 700;
    font-family: monospace;
    width: 100%;
    margin: 0;
  }

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: right;
    margin-right: 0.2em;
    gap: 1.33em;
    font-size: 1.33em;
    color: var(--color-icon);
    cursor: pointer;
  }
  .dropdown {
    background-color: transparent;
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    z-index: 1;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    border-radius: 4px;
    right: 0;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content p {
    margin: 0;
  }
  .music {
    cursor: pointer;
    font-size: 1.33em;
    color: var(--mauve);
  }
</style>
