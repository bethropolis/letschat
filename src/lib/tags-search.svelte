<script>
  import { DB } from "../db.js";
  import { makeRequest } from "../api.js";
  import { onMount } from "svelte";
  import { nav } from "../route.js";
  let user_token = DB("get", "token");
  let tags = [];
  export let query = "quote";
  export let type;
  let isLoading = false;

  export async function makeSearch(local = true) {
    if (!query && local) {
      if (DB("get", "prevTags")) {
        return (tags = DB("get", "prevTags"));
      }
    }
    isLoading = true;
    const { data } = await makeRequest("search", "GET", {
      user_token,
      query,
      type,
    });
    DB("set", "prevTags", data.data);
    tags = data.data;
    isLoading = false;
  }

  const selectTag = (tag) => {
    nav(`tags/${tag.name}`);
  };

  onMount(() => {
    tags = [];
    makeSearch();
  });
</script>

<main>
  {#if tags.length > 0}
    <div class="tag-list">
      {#each tags as tag}
        <div class="tag" on:click={() => selectTag(tag)}>
          <div class="tag-name">
            #
            {tag.name}
          </div>
          <div class="tag-count">
            {tag.count}
            {tag.count > 1 ? "posts" : "post"}
          </div>
        </div>
      {/each}
    </div>
  {:else if isLoading}
    <p class="loading">
      <i class="fas fa-spinner fa-spin" />
      Loading...
    </p>
  {:else}
    <div class="alert">
      <!-- a big icon to tell tag should search something -->
      <i class="fas fa-search" />
      <p>No tags found</p>
    </div>
  {/if}
</main>

<style>
  /* Font styles */

  /* Main component styles */
  main {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 70px;
  }

  .tag-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  .tag {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  .tag:last-child {
    border-bottom: none;
  }

  .tag:hover {
    background-color: #f5f5f5;
  }

  .tag .tag-name {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--color-text-dark);
  }
  .tag .tag-count {
    font-size: 0.8em;
    font-weight: bold;
    color: #aaa;
  }
  .loading {
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: var(--color-gray);
    margin-top: 1em;
  }
</style>
