<script>
  // almost similar to users-search.svelte
  import { DB } from "../db.js";
  import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";
  import { onMount } from "svelte";
  let user_token = "16c78b8e0c126b30749f8d93ad9de7479f7decb572";
  let posts = [];
  export let query = null;
  export let type;

  export async function makeSearch() {
    if (!query) {
      if (DB("get", "popularPosts")) {
        return (posts = DB("get", "popularPosts"));
      }
    }
    const { data } = await makeRequest("search", "GET", {
      user_token,
      query,
      type,
    });
    DB("set", "popularPosts", data.data);
    posts = data.data;
  }

  onMount(() => {
    makeSearch();
  });
</script>

<main>
  {#if posts}
    {#each posts as post}
      <PostBox {post} />
    {/each}
  {:else}
    <div class="alert">
      <!-- a big icon to tell user should search something -->
      <i class="fas fa-search" />
      <p>No posts found</p>
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
