<script>
  import Header from "./header.svelte";
  let comments = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      comment: "This is a great post!",
      date: "2021-08-01",
      replies: [
        {
          id: 1,
          name: "Jane Smith",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          comment: "I totally agree with you!",
          date: "2021-08-02",
        },
      ],
    },
    {
      id: 2,
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      comment: "Thanks for sharing!",
      date: "2021-08-03",
      replies: [],
    },
  ];
  let title = "hello";
  let activePage = "";
  function addComment() {
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    const date = new Date().toISOString().slice(0, 10);
    const avatar = `https://randomuser.me/api/portraits/${
      Math.random() < 0.5 ? "men" : "women"
    }/${Math.floor(Math.random() * 100)}.jpg`;

    comments = [
      ...comments,
      {
        id: comments.length + 1,
        name,
        avatar,
        comment,
        date,
        replies: [],
      },
    ];

    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
  }

  function addReply(commentId) {
    const name = document.getElementById(`name-${commentId}`).value;
    const comment = document.getElementById(`comment-${commentId}`).value;
    const date = new Date().toISOString().slice(0, 10);
    const avatar = `https://randomuser.me/api/portraits/${
      Math.random() < 0.5 ? "men" : "women"
    }/${Math.floor(Math.random() * 100)}.jpg`;

    const commentIndex = comments.findIndex((c) => c.id === commentId);
    comments[commentIndex].replies = [
      ...comments[commentIndex].replies,
      {
        id: comments[commentIndex].replies.length + 1,
        name,
        avatar,
        comment,
        date,
      },
    ];

    document.getElementById(`name-${commentId}`).value = "";
    document.getElementById(`comment-${commentId}`).value = "";
  }
</script>

<main>
  <Header {title} />
  <form on:submit|preventDefault={addComment}>
    <label for="name">Name:</label>
    <input type="text" id="name" required />

    <label for="comment">Comment:</label>
    <textarea id="comment" required />

    <button type="submit">Add Comment</button>
  </form>

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
              on:click={() =>
                document
                  .getElementById(`reply-${comment.id}`)
                  .classList.toggle("hidden")}
              ><i class="fas fa-reply" /> Reply</button
            >
            <button><i class="fas fa-flag" /> Report</button>
          </div>
          <form
            on:submit|preventDefault={() => addReply(comment.id)}
            class="hidden"
            id={`reply-${comment.id}`}
          >
            <label for={`name-${comment.id}`}>Name:</label>
            <input type="text" id={`name-${comment.id}`} required />

            <label for={`comment-${comment.id}`}>Comment:</label>
            <textarea id={`comment-${comment.id}`} required />

            <button type="submit">Add Reply</button>
          </form>
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
                      <button><i class="fas fa-reply" /> Reply</button>
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
</main>

<style>
  main {
    margin: 0 auto;
  }

  h1 {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
    width: 90vw;
    margin: 0 auto;
  }

  label {
    font-weight: bold;
  }

  input,
  textarea {
    padding: 0.5rem;
    border-radius: 0.25rem;
    outline: none;
    border: 1px solid #ccc;
  }

  button {
    margin: 0 auto;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: none;
    background-color: var(--color-primary);
    color: #fff;
    cursor: pointer;
    max-width: 200px;
    transition: all 0.5s ease;
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
  }

  .replies {
    margin-top: 1rem;
    padding-left: 2rem;
    border-left: 1px solid #ccc;
  }

  .reply {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .reply img {
    width: 40px;
    height: 40px;
  }
  .actions button {
    background: transparent;
    color: #777;
  }
  .reply-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  h4 {
    margin-bottom: 0.5rem;
  }

  small {
    color: #777;
  }

  .hidden {
    display: none;
  }
</style>
