<script>
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import PostsSearch from "./posts-search.svelte";
  import UsersSearch from "./users-search.svelte";
  import { nav } from "../route.js";
  import { onMount } from "svelte";
  import TagsSearch from "./tags-search.svelte";

  export let location;
  console.log("🚀 ~ file: profile.svelte:11 ~ location:", location);
  let params = {};
  let posts;
  let users;
  let tags;
  let search = "";
  let title = "Search";
  const activePage = "search";
  let activetab = "users";

  const doSearch = () => {
    if (search == "") return;
    if (activetab == "posts") posts.makeSearch();
    if (activetab == "users") users.makeSearch();
    if (activetab == "tags") tags.makeSearch();
  };

  onMount(() => {
    if (activetab == "users") users.makeSearch();

    if (params && params.q) {
      search = params.q;
      doSearch();
    }
  });

  $: if (location) {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("posts") !== null) {
    activetab = "posts";
  }
  if (urlParams.get("users") !== null) {
    activetab = "users";
  }
  if (urlParams.get("tags") !== null) {
    activetab = "tags";
  }
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
}

</script>

<main>
  <Header {title} />

  <div class="container">
    <div class="search-bar">
      <form class="search-input" on:submit|preventDefault={doSearch}>
        <i class="fa fa-search" />
        <input type="text" placeholder="Search" bind:value={search} />
      </form>
    </div>
    <div class="tabs">
      <span
        on:click={() => {
          activetab = "users";
          nav("search?users");
        }}
        class:selected={activetab == "users"}
      >
        Users</span
      >
      <span
        on:click={() => {
          activetab = "posts";
          nav("search?posts");
        }}
        class:selected={activetab == "posts"}
      >
        Posts</span
      >
      <!-- tags -->
      <span
        on:click={() => {
          activetab = "tags";
          nav("search?tags");
        }}
        class:selected={activetab == "tags"}>Tags</span
      >
    </div>
    {#if activetab == "users"}
      <UsersSearch
        bind:this={users}
        bind:type={activetab}
        bind:query={search}
      />
    {:else if activetab == "posts"}
      <PostsSearch
        bind:this={posts}
        bind:type={activetab}
        bind:query={search}
      />
    {:else if activetab == "tags"}
      <TagsSearch bind:this={tags} bind:type={activetab} bind:query={search} />
    {:else}
      <div class="alert">
        <!-- a big icon to tell user should search something -->
        <i class="fa fa-search" />
        <p>Search something</p>
      </div>
    {/if}
  </div>

  <Footer {activePage} />
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 800px;
    margin: 1rem auto;
    padding: 0;
  }

  .search-input {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 400px;
    font-size: 16px;
    padding: 0.5rem;
    color: #333;
    border-radius: calc(2rem - 5px);
    background-color: #f2f2f2;
    transition: all 0.3s ease;
  }
  .search-input:has(input:focus) i {
    color: var(--color-primary);
  }

  .search-input i {
    margin-right: 0.5rem;
    font-size: 1.2rem;
    color: #9e9e9e;
    transition: color 0.8s ease;
  }

  .search-input input {
    outline: none;
    border: none;
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: #f2f2f2;
    color: #333;
    transition: all 0.3s ease;
  }

  .tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font: 1rem sans-serif;
    width: 90%;
    margin: 0 auto;
    padding: 0;
    width: 100%;
    max-width: 800px;
    border-bottom: 1px solid #f2f2f2;
  }

  .tabs span {
    text-decoration: none;
    color: #9e9e9e;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
  }

  .tabs span:hover {
    color: var(--color-primary);
  }

  .tabs span.selected {
    color: var(--color-primary);
    font-weight: bold;
    border-bottom: 2px solid var(--color-primary);
  }
  :global(.alert) {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60vh;
    padding: 0;
    font-size: 1.2rem;
    color: #9e9e9e;
    transition: all 0.3s ease;
  }
  :global(.alert i) {
    margin-bottom: 0.5rem;
    font-size: 4.2rem;
    color: #9e9e9e;
  }
  :global(.alert p) {
    margin: 0;
    padding: 0;
    font-size: 1rem;
  }
</style>
