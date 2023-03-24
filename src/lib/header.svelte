<!-- header.svelte -->
<script>
  import { onMount } from "svelte";
  import { nav,isCurrentPage } from "../route.js";
  let backButtonVisible = false;
  export let title = ""
  function handleBackButtonClick() {
    // handle back button click here
    if (backButtonVisible) {
      // go to previous page -1
      history.back()
      backButtonVisible = false;
    }
  }

  onMount(() => {
    // check if the current route is not the home page
    // if not, show the back button
    if (window.location.pathname !== "/") {
      backButtonVisible = true;
    }
  });

  console.log(window.location.pathname);
</script>

<main>
  {#if backButtonVisible}
    <button class="back-button" on:click={handleBackButtonClick}>
      <span class="fas fa-chevron-left" />
    </button>
  {/if}

  <h1 class="header-title">{title}</h1>

  <div class="header-icon">
    <!-- if profile page show the settings icon -->
    {#if isCurrentPage("profile")}
      <i class="fas fa-cog" on:click={() => nav("settings")} />
    {/if}
    <!-- settings page show home -->
    {#if isCurrentPage("settings")}
      <i class="fas fa-home" on:click={() => nav("home")} />
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vh;
    background-color: #fff;
    /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); */
  }

  .back-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    color: #000;
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
    font-size: 18px;
    color: #000;
    cursor: pointer;
  }
</style>
