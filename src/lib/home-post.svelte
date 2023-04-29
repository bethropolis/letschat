<script>
  import { DB } from "../db.js";
  import { onMount, onDestroy } from "svelte";
  import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";

  let user_token = "16c78b8e0c126b30749f8d93ad9de7479f7decb572";
  let posts = [];
  let observer;
  let isLoading = false;
  let hasMorePosts = true;
  const loadMorePosts = async () => {
  if (!hasMorePosts || isLoading) {
    return;
  }

  isLoading = true;
const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : 0;
console.log("🚀 ~ file: home-post.svelte:19 ~ loadMorePosts ~ lastPostId:", lastPostId)
const storedData = DB("get", "homePost") ? DB("get", "homePost") : { data: [], timestamp: 0 };
console.log("🚀 ~ file: home-post.svelte:20 ~ loadMorePosts ~ storedData:", storedData)
const fifteenMinutes = 5 * 20 * 1000;
if (Date.now() - storedData.timestamp > fifteenMinutes) {
  // Clear stored data if it's older than 15 minutes
  DB("remove", "homePost");
  storedData.data = [];
  storedData.timestamp = 0;
}
let newData = [];
if (lastPostId || storedData.data.length === 0) {
  // Make a request only if no stored data and lastPostId is 0
  const response = await makeRequest("post", "GET", { user_token, last_id: lastPostId });
  newData = response.data;
}
const data = { data: [...storedData.data, ...newData], timestamp: Date.now() };
DB("update", "homePost", JSON.stringify(data));
posts = data.data;
isLoading = false;
hasMorePosts = newData.length > 0;


};

  onMount(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && posts) {
        loadMorePosts();
      }
    }, options);

    observer.observe(document.querySelector("#load-more"));
  });

  onDestroy(() => {
    observer.disconnect();
  });

  function StoreState() {
    const data = { data: [...posts], timestamp: DB("get", "homePost","timestamp")};
    DB("set", "homePost", JSON.stringify(data));
    console.log("🚀 ~ file: home-post.svelte:70 ~ StoreState ~ data:", data)
  }
</script>
<main>
    {#each posts as post}
    <PostBox {post} on:like={StoreState}/>
  {/each}
  <div id="load-more">
    {#if isLoading}
      <span class="loader"></span>
      Loading more posts...
    {:else}
      Scroll down to load more posts
    {/if}
  </div>
</main>

<style>

/* Main component styles */
main {
  max-width: 800px;
  padding: 20px 10px;
  margin: 5px auto 5em;
  padding: 0;
}

#load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #999;
  }

  #load-more .loader {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #333;
    animation: spin 1s ease-in-out infinite;
    margin-right: 10px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

</style>
