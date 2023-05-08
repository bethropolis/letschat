<script>
  import { login_token, config } from "../../store.js";
  import { snack } from "../../snack";
  import { DB } from "../../db";
  import { makeRequest } from "../../api.js";

  export let postToShare = null;

  let userToken = $login_token;
  // share to friend
  const shareToFriend = async function (postId, friends_token) {
    const send_data = {
      to: friends_token,
      from: userToken,
      message: `post|${postId}`,
      type: "share",
    };
    await makeRequest("chat", "POST", send_data).then((response) => {
      if (response.data.type == "success") {
        return snack("shared successfully");
      }
      snack("failed to share");
    });
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
      try {
        await navigator.share(shareData);
      } catch (err) {
        snack("can't share");
      }
    } else {
      snack("Share not supported");
    }
  };
</script>

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
                shareToFriend(postToShare.post_id, friend.chat_key);
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
      on:click={() => {
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
</div>

<!-- markup (zero or more items) goes here -->

<style>
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
