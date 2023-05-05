<script>
  import { login_token } from "../store";
  import { makeRequest } from "../api";
  import { nav } from "../route";
  import config from "../app.json";
  import { DB } from "../db";
  import VideoPlayer from "./ui/videoPlayer.svelte";
  import MusicPlayer from "./ui/musicPlayer.svelte";
  import { snack } from "../snack";
  import Lightbox from "./ui/lightbox.svelte";
  import { onMount } from "svelte";

  let src;
  let lightbox;
  export let id;
  let post;
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

  function goToComments() {
    nav(`comment/${post.post_id}`);
  }
  function goToProfile() {
    nav(`profile/${post.user.name}`);
  }

  onMount(async () => {
    //   get post
    await makeRequest("post", "GET", {
      user_token,
      post_id: id,
    }).then((response) => {
      post = response.data[0];
    });
  });
</script>

<main>
  {#if post}
    <Lightbox bind:this={lightbox} >
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
            <h3 class="user-name">{post.user.name || ""}</h3>
            <p class="post-date">{post.date_posted || ""}</p>
          </div>
        </div>
        <div class="dropdown">
          <button><i class="fa fa-ellipsis" /></button>
          <ul>
            {#if post.user.name == username}
              <li>Delete</li>
            {/if}
            <li on:click={reportPost}>Report</li>
            <li>Share</li>
            <li>Embed</li>
          </ul>
        </div>
      </header>
      <div class="post-body">
        {#if post.type == "img"}
          <img
            src={`${config.base_url}/img/${post.image}`}
            alt={post.image_text}
            class="post-image"
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
            <i
              class="far fa-comment post-action-icon"
              on:click={goToComments}
            />
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
  {/if}
</main>

<!-- markup (zero or more items) goes here -->

<style>
  /* Styles for individual posts */
  .post {
    background-color: var(--color-post);
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.09);
    margin: 10px auto 20px;
    max-width: 90%;
    padding: 20px 10px;
    position: relative;
  }

  .post-header {
    align-items: center;
    display: flex;
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
    align-items: center;
    display: flex;
    justify-content: flex-start;
  }

  .user-info h3 {
    color: #444444;
    font-size: 18px;
    margin: 0 0 5px;
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
    background-color: var(--color-light);
    border: 1px solid #e2e2e2;
    border-radius: 5px;
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0;
    top: 20px;
    width: 120px;
    z-index: 1;
  }

  .dropdown ul li {
    cursor: pointer;
    padding: 5px 0;
    position: relative;
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
    color: var(--color-primary);
    text-decoration: none;
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
    display: flex;
    justify-content: space-around;
    width: 100%;
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

  /* Styles for the lightbox */
  .lightbox {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }

  .lightbox-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 104;
  }

  .left,
  .right {
    display: flex;
    height: 100%;
    width: 50%;
  }

  .right {
    justify-content: flex-end;
  }

  .lightbox-header .user-name {
    color: var(--color-primary-dark);
  }

  .text {
    color: var(--color-light);
    position: relative;
    top: 4em;
    z-index: 106;
  }

  .lightbox button,
  .right button {
    background-color: transparent;
    border: none;
    color: #9b9b9b;
    font-size: 20px;
  }

  .right button {
    color: var(--color-lighter);
    font-size: 1.4em;
    padding: 0.8rem;
  }
</style>
