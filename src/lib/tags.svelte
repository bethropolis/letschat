<script>
  // similar to posts-search.svelte
  import { DB } from "../db.js";
  import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";
  import { onMount } from "svelte";
  import Header from "./header.svelte";
  let user_token = DB("get", "token");
  let posts = [];
  export let query = "quote";
  const type = "post-tags";
  const title = `#${query}`;

  async function makeSearch() {
    const { data } = await makeRequest("search", "GET", {
      user_token,
      query,
      type,
    });
    posts = data.data;
  }

  onMount(() => {
    if (query) {
      makeSearch();
    }
  });
</script>

<main>
  <Header {title} locked={true} />
  {#if posts}
    {#each posts as post}
      <PostBox {post} />
    {/each}
  {:else}
    <div class="alert">
      <!-- a big icon to tell user should search something -->
      <i class="fas fa-search" />
      <p>No posts found by tag</p>
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
    margin-bottom: 60px;
  }
</style>
