<script>
  import Header from "./header.svelte";
  import ModalBottom from "./ui/modalBottom.svelte";
  let comments = [{
      id: 1,
      username: "dddd",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      comment: "This is a great post!",
      date: "2021-08-01",
      replies: [
        {
          id: 1,
          username: "hugga",
          name: "Jane Smith",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          comment: "I totally agree with you!",
          date: "2021-08-02",
        },
      ],
    },
    {
      id: 2,
      username: "hugga",
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      comment: "Thanks for sharing!",
      date: "2021-08-03",
      replies: [],
    }
  ];
  let title = "hello";
  let activePage = "";
  function addComment(name_, comment_) {
    const name = name_;
    const username = "thisguy";
    const comment = comment_;
    const date = new Date().toISOString().slice(0, 10);
    const avatar = `https://randomuser.me/api/portraits/${
      Math.random() < 0.5 ? "men" : "women"
    }/${Math.floor(Math.random() * 100)}.jpg`;

    comments = [
      ...comments,
      {
        id: comments.length + 1,
        username,
        name,
        avatar,
        comment,
        date,
        replies: [],
      },
    ];
  }

  function addReply(commentId, comment_) {
    const name = "yakob";
    const username = "him";
    const comment = comment_;
    const date = new Date().toISOString().slice(0, 10);
    const avatar = `https://randomuser.me/api/portraits/${
      Math.random() < 0.5 ? "men" : "women"
    }/${Math.floor(Math.random() * 100)}.jpg`;

    const commentIndex = comments.findIndex((c) => c.id === commentId);
    comments[commentIndex].replies = [
      ...comments[commentIndex].replies,
      {
        id: comments[commentIndex].replies.length + 1,
        username,
        name,
        avatar,
        comment,
        date,
      },
    ];
  }
</script>

<main>
  <Header {title} />
 

  {#if comments.length === 0}
    <p>No comments yet.</p>
  {:else}
    {#each comments as comment}
      <div class="comment">
        <img src={comment.avatar} alt={comment.name} />
        <div class="comment-body">
          <h3>{comment.name}</h3>
          <p>{comment.comment}</p>
          <small>{comment.date}</small>
          <div class="actions">
            <button
              on:click={() => {
                addReply(comment.id, "hello");
              }}><i class="fas fa-reply" /> Reply</button
            >
            <button><i class="fas fa-flag" /> Report</button>
          </div>
          {#if comment.replies.length > 0}
            <div class="replies">
              {#each comment.replies as reply}
                <div class="reply">
                  <img src={reply.avatar} alt={reply.name} />
                  <div class="reply-body">
                    <h4>{reply.name}</h4>
                    <p>{reply.comment}</p>
                    <small>{reply.date}</small>
                    <div class="actions">
                      <button
                        on:click={() => {
                          addReply(comment.id, `@${reply.username} hello`);
                        }}
                      ><i class="fas fa-reply" /> Reply</button>
                        <button><i class="fas fa-flag" /> Report</button>
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

    
  <ModalBottom>
    <form on:submit|preventDefault={addComment}>
      <label for="comment">Comment:</label>
      <textarea id="comment" required placeholder="enter your coment..." />
  
      <button type="submit">Add Comment</button>
    </form>
    </ModalBottom>

</main>

<style>

  main {
    margin: 0 auto;
    max-width: 800px;
    background-color: var(--color-light);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }

  h1 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 2rem;
    color: var(--color-primary);
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
    width: 40px;
    height: 40px;
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
