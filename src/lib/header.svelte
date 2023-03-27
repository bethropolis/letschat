<!-- header.svelte -->
<script>
  import { onMount } from "svelte";
  import { nav,isCurrentPage } from "../route.js";
  export let navOptions = []
  export let title = "";
  export let backTo = "";
  export let locked = false;
  let backButtonVisible = false;

  function handleBackButtonClick(to) {
    // handle back button click here
    if(to !== "") {
       nav(to)
      }

    if (backButtonVisible && !to) {
      // go to previous page -1
      history.back()
      backButtonVisible = false;
    }
  }

  onMount(() => {
    // check if the current route is not the home page
    // if not, show the back button
    if (!isCurrentPage("home")) {
      backButtonVisible = true;
    }
  });
</script>

<main class:locked>
  {#if backButtonVisible}
    <button class="back-button" on:click={()=>{handleBackButtonClick(backTo)}}>
      <span class="fas fa-chevron-left" />
    </button>
  {/if}

  <h1 class="header-title">{@html title}</h1>

  <div class="header-icon">
    <!-- if profile page show the settings icon -->
   
    {#if  navOptions.length > 0}
      {#each navOptions as option}
        <i class= {option.icon} on:click={() => nav(option.link)} />
      {/each}
    {/if}

  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vh;
    background-color: var(--color-light);
    z-index: 100;
    /* ; */
  }
  .locked{
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
    margin-right: .2em;
    gap: 1.33em;
    font-size: 1.33em;
    color: var(--color-icon);
    cursor: pointer;
  }
</style>
