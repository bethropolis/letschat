<script>
  import { DB } from "../db.js";
  import { onMount, onDestroy } from "svelte";
  import { makeRequest } from "../api.js";

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
  const storedData = JSON.parse(DB("get", "homePost")) || { data: [], timestamp: 0 };
  const fifteenMinutes = 5 * 60 * 1000;
  if (Date.now() - storedData.timestamp > fifteenMinutes) {
    // Clear stored data if it's older than 15 minutes
    DB("set", "homePost", "");
    storedData.data = [];
    storedData.timestamp = 0;
  }
  const { data: newData } = await makeRequest("post", "GET", { user_token, last_id: lastPostId });
  const filteredData = newData.filter((post) => !storedData.data.some((p) => p.id === post.id));
  const data = { data: [...storedData.data, ...filteredData], timestamp: Date.now() };
  DB("set", "homePost", JSON.stringify(data));
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
</script>
<main>
    {#each posts as post}
    <article class="post">
      <header class="post-header">
        <div class="user-info">
          <img
            src={`https://suplike.xyz/img/${post.user.profile_picture}`}
            alt={post.user.name}
            class="user-avatar"
          />
          <div class="user-name-date">
            <h3 class="user-name">{post.user.name}</h3>
            <p class="post-date">{post.date_posted}</p>
          </div>
        </div>
        <div class="dropdown">
          <button><i class="fa fa-ellipsis"></i></button>
          <ul>
            <li>Delete</li>
            <li>Embed</li>
          </ul>
        </div>
      </header>
      <div class="post-body">
        {#if post.image}
          <img
            src={`https://suplike.xyz/img/${post.image}`}
            alt={post.image_text}
            class="post-image"
          />
        {:else}
          <p class="post-text"> {@html post.image_text} </p>
        {/if}
      </div>
      <footer class="post-footer">
        <div class="post-actions">
          <button class="post-action-button" on:click={()=>{post.liked = !post.liked; post.liked?post.post_likes++:post.post_likes--}}>
              <i class="{post.liked ? "fas":"far"} fa-heart post-action-icon" />{post.post_likes}
          </button>
          <button class="post-action-button">
            <i class="far fa-comment post-action-icon" /> Comment
          </button>
          <button class="post-action-button">
            <i class="fas fa-retweet post-action-icon" /> Repost
          </button>
          <button class="post-action-button">
            <i class="fas fa-share post-action-icon" /> Share
          </button>
        </div>
      </footer>
    </article>
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

.post {
  background-color: var(--color-post);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.09);
  margin-bottom: 20px;
  padding: 20px 10px;
  margin: 10px auto;
  position: relative;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
}

.post-header img {
  border-radius: 50%;
  height: 50px;
  margin-right: 15px;
  width: 50px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.user-info h3 {
  color: #444444;
  font-size: 18px;
  margin-bottom: 5px;
  margin-top: 0;
}

.user-info p {
  color: #9B9B9B;
  font-size: 14px;
  margin: 0;
}

.dropdown {
  position: relative;
}

.dropdown button {
  background-color: transparent;
  border: none;
  color: #9B9B9B;
  cursor: pointer;
  font-size: 20px;
}

.dropdown ul {
  background-color: var(--color-light);
  border: 1px solid #E2E2E2;
  border-radius: 5px;
  display: none;
  list-style: none;
  padding: 5px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
}

.dropdown ul li {
  cursor: pointer;
  padding: 5px;
}

.dropdown:hover ul {
  display: block;
}

.post-body {
  margin: 25px auto;
  overflow: hidden;
  position: relative;
}

.post-body img {
  border-radius: 10px;
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

.post-text {
  color: var(--color-dark) !important; 
  font-size: 16px;
  margin: 0;
}


:global(.post-text a){
  all: none;
  text-decoration: none;
  color: var(--color-primary);
}

.post-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.post-footer button {
  background-color: transparent;
  border: none;
  color: #9B9B9B;
  cursor: pointer;
  font-size: 16px;
}

.post-footer button:hover i {
  color: var(--color-primary);
}

.post-footer button i {
  margin-right: 5px;
}
.post-footer .fa-heart{
  color: var(--color-primary);
}

.post-footer p {
  color: #9B9B9B;
  font-size: 14px;
  margin: 0;
  text-align: right;
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
