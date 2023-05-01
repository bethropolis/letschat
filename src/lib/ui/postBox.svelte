<script>
  import { login_token } from "../../store";
  import { makeRequest } from "../../api";
  import { createEventDispatcher } from "svelte";
  import { nav } from "../../route";
  import config from "../../app.json";
  import Snackbar from "./snackbar.svelte";

  const dispatch = createEventDispatcher();
  console.log("🚀 ~ file: postBox.svelte:9 ~ dispatch:", $login_token);

  export let post = {};
  let user_token = $login_token;
  async function likePost() {
    await makeRequest("like", "POST", {
      user_token,
      post_id: post.post_id,
    }).then((response) => {
      if (response.data.type === "success") {
        post.liked = !post.liked;
        post.liked ? post.post_likes++ : post.post_likes--;
      }
      dispatch("like");
    });
  }

  async function repostPost() {
    post.reposted = !post.reposted;
    const { data } = await makeRequest("repost", "POST", {
      user_token,
      post_id: post.post_id,
    });
    console.log("🚀 ~ file: postBox.svelte:30 ~ repostPost ~ data:", data);
    let snackbar = new Snackbar({
      target: document.body,
      props: {
        msg: data.msg,
        visible: true,
      },
    });
  }

  function goToComments() {
    nav(`comment/${post.post_id}`);
  }
  function goToProfile() {
    nav(`profile/${post.user.name}`);
  }
</script>

<main>
  <article class="post">
    <header class="post-header">
      <div class="user-info">
        <img
          src={`${config.base_url}/img/${post.user.profile_picture}`}
          alt={post.user.name}
          class="user-avatar"
          on:click={goToProfile}
        />
        <div class="user-name-date">
          <h3 class="user-name">{post.user.name}</h3>
          <p class="post-date">{post.date_posted}</p>
        </div>
      </div>
      <div class="dropdown">
        <button><i class="fa fa-ellipsis" /></button>
        <ul>
          <li>Delete</li>
          <li>Embed</li>
        </ul>
      </div>
    </header>
    <div class="post-body">
      {#if post.image}
        <img
          src={`${config.base_url}/img/${post.image}`}
          alt={post.image_text}
          class="post-image"
        />
      {:else}
        <p class="post-text">{@html post.image_text}</p>
      {/if}
    </div>
    <footer class="post-footer">
      <div class="post-actions">
        <button class="post-action-button" on:click={likePost}>
          <i
            class="{post.liked ? 'fas' : 'far'} fa-heart post-action-icon"
          />{post.post_likes}
        </button>
        <button class="post-action-button">
          <i class="far fa-comment post-action-icon" on:click={goToComments} />
          {post.comment_count || 0}
        </button>
        <button class="post-action-button" on:click={repostPost}>
          <i class="fas fa-retweet post-action-icon" />
        </button>
        <button class="post-action-button">
          <i class="fas fa-share post-action-icon" />
        </button>
      </div>
    </footer>
  </article>
</main>

<!-- markup (zero or more items) goes here -->
<style>
  .post {
    background-color: var(--color-post);
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.09);
    margin-bottom: 20px;
    padding: 20px 10px;
    margin: 10px auto;
    position: relative;
    max-width: 90%;
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
    color: #9b9b9b;
    font-size: 14px;
    margin: 0;
  }

  .dropdown {
    position: relative;
  }

  .dropdown button {
    background-color: transparent;
    border: none;
    color: #9b9b9b;
    cursor: pointer;
    font-size: 20px;
  }

  .dropdown ul {
    margin: 0;
    padding: 0;
    background-color: var(--color-light);
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    display: none;
    list-style: none;
    position: absolute;
    right: 0;
    top: 20px;
    width: 120px;
    z-index: 1;
  }

  .dropdown ul li {
    position: relative;
    cursor: pointer;
    padding: 5px 0;
  }

  .dropdown:hover ul {
    display: block;
  }
  .dropdown li:hover {
    background-color: var(--mauve);
    color: var(--color-light);
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

  :global(.post-text a) {
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
    color: #9b9b9b;
    cursor: pointer;
    font-size: 16px;
  }
  .post-actions {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .post-footer button:hover i {
    color: var(--color-primary);
  }

  .post-footer button i {
    margin-right: 5px;
  }
  .post-footer .fa-heart {
    color: var(--color-primary);
  }
</style>