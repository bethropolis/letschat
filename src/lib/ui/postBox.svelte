<script>
  import Lightbox from "./lightbox.svelte";
  import { login_token } from "../../store";
  import { makeRequest } from "../../api";
  import { createEventDispatcher } from "svelte";
  import { nav } from "../../route";
  import config from "../../app.json";
  import { DB } from "../../db";
  import VideoPlayer from "./videoPlayer.svelte";
  import MusicPlayer from "./musicPlayer.svelte";
  import { snack } from "../../snack";

  let lightbox;
  let dropdown = false;
  const dispatch = createEventDispatcher();
  export let post = {};
  let user_token = $login_token;
  let username = DB("get", "login", "username");
  async function likePost() {
    await makeRequest("like", "POST", {
      user_token,
      post_id: post.id,
    }).then((response) => {
      if (response.data.type === "success") {
        if (response.data.msg === "Liked") {
          post.liked = true;
          post.post_likes++;
        } else {
          post.liked = false;
          post.post_likes--;
        }
      }
      dispatch("like");
    });
  }

  function showLightbox(link) {
    lightbox.openLightbox(link);
  }
  function closeLightbox() {
    lightbox.closeLightbox();
  }

  async function repostPost() {
    post.reposted = !post.reposted;
    await makeRequest("repost", "POST", {
      user_token,
      post_id: post.post_id,
    }).then((response) => {
      snack(response.data.msg);
    });
  }

  async function reportPost() {
    await makeRequest("report", "POST", {
      user_token,
      id: post.id,
    }).then((response) => {
      snack(response.data.msg);
    });
  }
  async function deletePost() {
    await makeRequest("post", "POST", {
      user_token,
      post_id: post.post_id,
      delete: true,
    }).then((response) => {
      snack(response.data.msg);
    })
  }

  async function sharePost() {
    dispatch("share");
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
    <Lightbox bind:this={lightbox}>
      <div class="post-header user-info lightbox-header" slot="header">
        <div class="left">
          <img
            src={`${config.base_url}/img/${post.user.profile_picture}`}
            alt={post.user?.name}
            class="user-avatar"
            on:click={goToProfile}
          />
          <div class="user-name-date">
            <h3 class="user-name">{post.user?.name || ""}</h3>
            <p class="post-date">{post.date_posted}</p>
          </div>
        </div>
        <div class="right">
          <a
            href={`${config.base_url}/img/${post.image}`}
            download={post.image_text}
          >
            <button class="post-download-button">
              <i class="fas fa-download" />
            </button>
          </a>
          <button on:click={closeLightbox}> <i class="fa fa-close" /></button>
        </div>
      </div>
      <div class="lightbox">
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
      <div class="text" slot="footer">
        <p>{post.image_text}</p>
      </div>
    </Lightbox>
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
          <p class="post-date">{post.date_posted || ""}</p>
        </div>
      </div>
      <div class="right">
      <div class="dropdown">
        <button on:click={() => (dropdown = !dropdown)}>
          <i class="fa fa-ellipsis" />
        </button>
        {#if dropdown}
        <ul>
          
          <li
            on:click={() => {
              nav(`post/${post.post_id}`);
            }}
          >
            <i class="fas fa-eye" />
            <span>View</span>
          </li>
          <li on:click={reportPost}>
            <i class="fas fa-flag" />
            <span>Report</span>
          </li>
          {#if post.user.name == username}
            <li on:click={(elem)=>{
              deletePost();
              let spanElem =elem.currentTarget.querySelector("span");
              spanElem.innerHTML = "deleted!";
            }}>
              <i class="fas fa-trash" />
              <span>Delete</span>
            </li>
          {/if}
          <li on:click={sharePost}>
            <i class="fas fa-share" />
            <span>Share</span>
          </li>
          <li>
            <i class="fas fa-bookmark" />
            <span>Save</span>
          </li>
        </ul>
        {/if}
      </div></div>
    </header>
    <div class="post-body">
      {#if post.type == "img"}
        <img
          src={`${config.base_url}/img/${post.image}`}
          alt={post.image_text}
          class="post-image"
          on:click={() => {
            let img = `${config.base_url}/img/${post.image}`;
            showLightbox(img);
          }}
        />
      {:else if post.type == "vid"}
        <VideoPlayer
          videoProps={{
            src: `${config.base_url}/img/${post.image}`,
            controls: true,
          }}
        />
      {:else if post.type == "mus"}
        <MusicPlayer
          musicProps={{
            src: `${config.base_url}/img/${post.image}`,
            controls: true,
          }}
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
          <i class="fas fa-share post-action-icon" on:click={sharePost} />
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
    height: 30px;
    margin-right: 15px;
    width: 30px;
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .user-info h3 {
    color: var(--color-text);
    font-size: 16px;
    margin-bottom: 5px;
    margin-top: 0;
  }

  .user-info p {
    color: #9b9b9b;
    font-size: 12px;
    margin: 0;
  }

  .dropdown {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .dropdown button {
    background-color: transparent;
    border: none;
    color: var(--color-icon) !important;
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
    padding: 7px;
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
  .lightbox {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .lightbox-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 104;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left,
  .right {
    width: 50%;
    display: flex;
    height: 100%;
  }
  .right {
    justify-content: flex-end;
  }

  .lightbox-header .user-name {
    color: var(--color-primary-dark);
  }
  .text {
    position: relative;
    top: 4em;
    color: var(--color-light);
    z-index: 106;
  }
  .lightbox button,
  .right button {
    border: none;
    background-color: transparent;
    color: #9b9b9b;
    font-size: 20px;
  }
  .right button {
    padding: 0.8rem;
    color: var(--color-lighter);
    font-size: 1.4em;
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
  .fa-heart {
    color: var(--color-primary);
  }
</style>
