<script>
  import Snackbar from "./ui/snackbar.svelte";
  import { makeRequest } from "../api";
  import { onMount } from "svelte";
  import Header from "./header.svelte";
  import ModalBottom from "./ui/modalBottom.svelte";
  import { DB } from "../db";
  import { formatTime } from "../extra";

  let modalComment = false;
  let disableBtn = false;
  export let post = "";
  let user_token = DB("get", "token"); // user
  let user_username = DB("get", "login", "username");
  let user_profile = DB("get", "login", "profile_picture");
  let reply;
  let replyId = ""; // parent_id
  let replyTo = "";
  let comments = [];

  let snack_msg;

  let title = "hello";

  let info = {
    icon: "fa-circle-question",
    txt: "hey, type your comments and click the add comment button",
  };

  const getComments = async (user_token, post_id) => {
    await makeRequest("comment", "GET", { user_token, post_id }).then(
      (response) => {
        if (response.data.type == "success") {
          comments = response.data.data || [];
        } else {
          comments = [];
          modalComment = true;
        }
      }
    );
  };

  const sendComment = async (comment) => {
    await makeRequest("comment", "POST", comment);
    if (Response) {
      getComments(user_token, post);
    } else {
      snack_msg = "failed to send";
    }
  };

  onMount(() => {
    getComments(user_token, post);
  });

  async function addComment() {
    disableBtn = true;
    const username = user_username;
    const comment = replyTo ? `${replyTo} ${reply}` : reply;

    let params = {
      post_id: post,
      comment,
      user_token,
      parent_id: replyId || null,
    };
    await sendComment(params);

    reply = "";
    replyTo = null;
    replyId = null;
    disableBtn = false;
    modalComment = false;
  }

  const addReply = (user) => {
    replyTo = user;
  };

  // yeah this one is normal toggle and on toggle
  const toggleModal = (open = false) => {
    if (open) {
      if (replyTo) return (replyTo = null) && (replyId = null);
      return (modalComment = !modalComment);
    }
    modalComment = true;
  };

  const snackMessage = (msg) => {
    snack_msg = msg;

    setTimeout(() => {
      snack_msg = null;
    }, 500);
  };
</script>

<main>
  <Header {title}>
    <i
      class="fa fa-plus"
      on:click={() => {
        toggleModal(true);
      }}
    />
  </Header>

  {#if comments.length === 0}
    <div class="alert">
      <i class="fa fa-comment" />
      <p>No comments yet. Be the first to comment!</p>
    </div>
  {:else}
    {#each comments as comment}
      <div class="comment">
        <img src={comment.avatar} alt={comment.username} />
        <div class="comment-body">
          <h3>{comment.username}</h3>
          <p>{comment.comment}</p>
          <small>{formatTime(comment.date)}</small>
          <div class="actions">
            <button
              on:click={() => {
                comment.likes++;
                comment.liked = !comment.liked;
              }}><i class="fa fa-thumbs-up" />{comment.likes || 0}</button
            >
            <button
              on:click={() => {
                replyId = comment.id;
                addReply(`@${comment.username}`);
                toggleModal(false);
              }}><i class="fas fa-reply" /> Reply</button
            >
            <button
              on:click={() => {
                snackMessage("reported");
              }}><i class="fas fa-flag" /> Report</button
            >
          </div>
          {#if comment.replies.length > 0}
            <div class="replies">
              {#each comment.replies as reply}
                <div class="reply">
                  <img src={reply.avatar} alt={reply.username} />
                  <div class="reply-body">
                    <h4>{reply.username}</h4>
                    <p>{reply.comment}</p>
                    <small>{formatTime(reply.date)}</small>
                    <div class="actions">
                      <button
                        on:click={() => {
                          reply.likes++;
                          reply.liked = !reply.liked;
                        }}
                        ><i class="fa fa-thumbs-up" />{reply.likes || 0}</button
                      >
                      <button
                        on:click={() => {
                          replyId = comment.id;
                          addReply(`@${reply.username}`);
                          toggleModal(false);
                        }}><i class="fas fa-reply" /> Reply</button
                      >
                      <button
                        on:click={() => {
                          snackMessage("reported");
                        }}><i class="fas fa-flag" /> Report</button
                      >
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  {/if}

  <ModalBottom bind:isOpen={modalComment} {info}>
    <form on:submit|preventDefault={addComment}>
      <label for="comment"
        >{replyTo ? `replying to: ${replyTo}` : "write comment:"}</label
      >
      <textarea
        id="comment"
        required
        placeholder="enter your coment..."
        bind:value={reply}
      />
      <button type="submit" disabled={disableBtn}
        >{disableBtn ? "sending comment..." : "Add comment"}</button
      >
    </form>
  </ModalBottom>
  <Snackbar msg={snack_msg} />
</main>

<style>
  main {
    margin: 0 auto;
    max-width: 800px;
    background-color: var(--color-light);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input,
  textarea {
    padding: 0.5rem;
    margin: 0 auto;
    border-radius: 0.25rem;
    outline: none;
    border: none;
    width: calc(100vw - 20%);
    font-size: 1rem;
    color: var(--color-dark);
    background-color: var(--color-input);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  button {
    margin: 0 auto;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    background-color: var(--color-primary);
    color: var(--color-light);
    cursor: pointer;
    max-width: 200px;
    transition: all 0.5s ease;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
  }

  button:hover {
    opacity: 0.7;
    background-color: var(--color-primary);
  }

  .comment {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .comment-body {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: var(--color-text);
  }

  .replies {
    margin-top: 1rem;
    padding-left: 2rem;
    border-left: 1px solid var(--color-gray);
  }

  .reply {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .reply img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }
  .actions {
    display: flex;
  }
  .actions button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: var(--color-text-light);
    font-size: 1rem;
    font-weight: bold;
  }

  .reply-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: var(--color-text);
  }

  small {
    color: var(--color-gray);
    font-size: 0.8rem;
  }

  .hidden {
    display: none;
  }
</style>
