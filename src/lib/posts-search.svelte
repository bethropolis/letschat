<script>
  // almost similar to users-search.svelte
  import { login_token } from "../store.js";
  import { onMount } from "svelte";
  import { DB } from "../db.js";
  import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";

  let user_token = $login_token;
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
