<script>
    import { makeRequest } from "../api.js";
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
            <p class="post-text">{@html post.image_text}</p>
          {/if}
        </div>
        <footer class="post-footer">
          <div class="post-actions">
            <button class="post-action-button">
              {#if post.liked}
                <i class="fas fa-heart post-action-icon" /> Unlike
              {:else}
                <i class="far fa-heart post-action-icon" /> Like
              {/if}
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
          <p class="post-likes">{post.post_likes} likes</p>
        </footer>
      </article>
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
  }
  
  .post {
    background-color: var(--color-light);
    border-radius: 10px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    padding: 20px;
  }
  
  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
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
  
  .post-body p {
    color: #555555;
    font-size: 16px;
    margin: 0;
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
  
  .post-footer button:hover {
    color: #1DA1F2;
  }
  
  .post-footer button i {
    margin-right: 5px;
  }
  
  .post-footer p {
    color: #9B9B9B;
    font-size: 14px;
    margin: 0;
    text-align: right;
  }
  
  </style>
  