<script>
  import { DB } from "../db.js";
  import { login_token, config } from "../store.js";
  import { onMount } from "svelte";
  import { makeRequest } from "../api.js";
  import PostBox from "./ui/postBox.svelte";
  import ModalBottom from "./ui/modalBottom.svelte";
  import { snack } from "../snack.js";
  import { nav } from "../route.js";

  let userToken = $login_token;
  let posts = [];
  let isLoading = false;
  let hasMorePosts = true;
  let scrollInfo = "load more posts";
  let modal = false;
  let postToShare = null;
  let loadMoreButton;

  // hiding the floating action button
  let scrollY = 0;
  let prevScrollY = 0;
  let show = true;
  let threshold = 60; // the scroll threshold in pixels

  // close modal
  let info = {
    icon: "fa-close", //
    type: "action",
    action: function () {
      modal = false;
    },
  };
  // Load more posts function
  const loadMorePosts = async () => {
    if (!hasMorePosts || isLoading) {
      return;
    }

    isLoading = true;

    // Get the last post ID
    const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : 0;

    // Get stored data or initialize it
    const fifteenMinutes = 5 * 20 * 1000;
    const storedData = DB("get", "homePost") || { data: [], timestamp: 0 };

    // Clear stored data if it's older 100s (it was fifteen minutes at first)
    if (Date.now() - storedData.timestamp > fifteenMinutes) {
      DB("remove", "homePost");
      storedData.data = [];
      storedData.timestamp = 0;
    }

    // Make a request for new data
    const response = await makeRequest("post", "GET", {
      user_token: userToken,
      last_id: lastPostId,
    }).then((response) => {
      if (response.data.length > 0) {
        return response.data;
      }
      return [];
    });

    // Update posts and hasMorePosts
    if (response.length === 0) {
      scrollInfo = "No more posts";
    }
    posts = [...storedData.data, ...response];
    DB(
      "update",
      "homePost",
      JSON.stringify({ data: posts, timestamp: Date.now() })
    );
    isLoading = false;
    hasMorePosts = response.length > 0;
  };

  // Load more button clicked function
  const loadMoreButtonClicked = async () => {
    await loadMorePosts();
  };

  // Intersection observer onMount function
  onMount(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && posts) {
        loadMorePosts();
      }
    }, options);

    observer.observe(loadMoreButton);
    return () => {
      observer.disconnect();
    };
  });

  // Share post function
  const sharePost = (post) => {
    modal = true;
    postToShare = post;
  };

  // Copy text to clipboard function
  const copyTextToClipboard = (text) => {
    const tempElement = document.createElement("textarea");
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
  };

  // Share link or text function
  const shareLinkOrText = async (text, url) => {
    const title = $config.name;
    if (navigator.share) {
      let shareData = {
        title,
        text,
        url,
      };
      console.log(
        "🚀 ~ file: home-post.svelte:116 ~ shareLinkOrText ~ shareData:",
        shareData
      );
      try {
        await navigator.share(shareData);
      } catch (err) {
        snack("can't share");
      }
    } else {
      snack("Share not supported");
    }
  };

  const storeState = () => {
    const data = {
      data: [...posts],
      timestamp: DB("get", "homePost", "timestamp"),
    };
    DB("update", "homePost", JSON.stringify(data));
  };

  // Watch for changes to the posts array
  $: if (posts.length > 0) {
    hasMorePosts = true;
  }

  $: {
    if (scrollY > prevScrollY) {
      // scrolling down
      show = false;
    } else if (scrollY < prevScrollY - threshold) {
      // scrolling up more than the threshold
      show = true;
    }
    prevScrollY = scrollY;
  }
</script>

<svelte:window bind:scrollY />
<main>
  {#each posts as post}
    <PostBox
      {post}
      on:like={storeState}
      on:share={() => {
        sharePost(post);
      }}
    />
  {/each}
  <div id="load-more">
    {#if isLoading}
      <span class="loader" />
      Loading more posts...
    {:else}
      <span bind:this={loadMoreButton} on:click={loadMoreButtonClicked}>
        {scrollInfo}
      </span>
    {/if}
  </div>
  <button class="float-btn" on:click={() => nav("post")} class:show>
    <i class="fa fa-plus" />
  </button>

  <ModalBottom bind:isOpen={modal} {info}>
    <div class="modal-content">
      <div class="modal-content-header">
        <h3>share to</h3>
      </div>
      <div class="modal-content-body">
        <!-- share to  list of friends-->
        {#if DB("get", "ChatList")}
          <ul>
            {#each DB("get", "ChatList") as friend}
              <div class="item">
                <div class="info">
                  <img src={friend.image} alt="" />
                  <span>{friend.username}</span>
                </div>
                <button
                  on:click={() => {
                    sharePost(postToShare);
                  }}>share</button
                >
              </div>
            {/each}
          </ul>
        {/if}
      </div>
      <div class="modal-content-footer">
        <button
          title="share link"
          on:click={(elem) => {
            let url = $config.base_url + "/post/" + postToShare.post_id;
            let text = postToShare.image_text;
            shareLinkOrText(text, url);
          }}
        >
          <i class="fas fa-share-alt" />
          <span>share</span>
        </button>
        <button
          title="copy link"
          on:click={(elem) => {
            let text = `${$config.base_url}/post/${postToShare.post_id}`;
            copyTextToClipboard(text);
            let spanElem = elem.currentTarget.querySelector(".copy");
            spanElem.innerHTML = "Copied!";
          }}
        >
          <i class="fas fa-link" />
          <span class="copy">copy</span>
        </button>
      </div>
    </div></ModalBottom
  >
</main>

<style>
  /* Main component styles */
  main {
    max-width: 800px;
    padding: 20px 10px;
    margin: 5px auto 6em;
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
  .float-btn {
    position: fixed;
    bottom: 70px;
    right: 20px;
    height: 50px;
    width: 50px;
    border: none;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: white;
    font-size: 24px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
  }

  .float-btn:hover {
    transform: scale(1.1);
  }

  .float-btn:active {
    transform: scale(0.9);
  }
  .float-btn.show {
    display: block;
  }
  .float-btn:not(.show) {
    display: none;
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .modal-content-body {
    max-height: 300px;
    padding: 5px 10px;
    width: 100%;
    overflow-y: auto;
    background-color: var(--color-input);
  }
  .modal-content-body .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 0;
  }
  .modal-content-body .info {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 80%;
  }
  .modal-content-body .item span {
    font-size: 1.2rem;
  }
  .modal-content-body .item button {
    padding: 5px 10px;
    background-color: var(--primary-color);
    color: var(--color-light);
    border: none;
    border-radius: 5px;
  }
  .modal-content-body .item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .modal-content-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0;
    gap: 10px;
  }
  .modal-content-footer button {
    padding: 5px 10px;
    background-color: var(--primary-color);
    color: var(--color-input);
    border: none;
    border-radius: 5px;
  }
</style>
