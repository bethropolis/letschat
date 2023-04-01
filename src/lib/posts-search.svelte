<script>
    import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";
    let user_token = "16c78b8e0c126b30749f8d93ad9de7479f7decb572";
    let posts = [];
    export let query;
    export let type;
  
    export async function makeSearch(){
      const { data } = await makeRequest("search", "GET", { user_token,query,type });
      console.log(data);
      posts = data.data;
    };
  </script>
  
  <main>
    {#if posts}
      {#each posts as post}
      <PostBox {post}/>
    {/each}
    {:else}
      <div class="alert">
        <!-- a big icon to tell user should search something -->
        <i class="fas fa-search"></i>
        <p>No posts found</p>
      </div>
    {/if}
  </main>
  
  <style>
   /* Font styles */
  
  /* Main component styles */
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    margin-bottom: 60px;
  }
  </style>
  