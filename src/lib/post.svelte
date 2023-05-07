<script>
  import VideoPlayer from "./ui/videoPlayer.svelte";
  import Header from "./header.svelte";
  import Snackbar from "./ui/snackbar.svelte";
  import { makeRequest } from "../api";
  import { login_token } from "../store";
  import MusicPlayer from "./ui/musicPlayer.svelte";
  import { checkFileExtension } from "../extra";
  import PostBox from "./ui/postBox.svelte";


  export let repost = null;
  let post;


  let activeTab = "text";
  let textContent = "";
  let user_token = $login_token;
  let isSending;
  let file;
  let fileName;
  let filePreview;
  let type = "txt";
  let characterLimit = 200;
  let msg;
  let title = "Post";
  let navOptions = [
    {
      title: "home",
      icon: "fas fa-home",
      link: "home",
    },
  ];
  const handleTabClick = (tab) => {
    activeTab = tab;
  };

  const handleTextSubmit = async () => {
    await makeRequest("post", "POST", {
      user_token,
      content: textContent,
      type,
      repost
    }).then((response) => {
      msg = response.data.msg;
      textContent = "";
      isSending = false;
    });
    // Reset text content field
  };

  const handleFileSubmit = async () => {

    await makeRequest("post", "POST", {
      user_token,
      file,
      type,
      content:textContent,
    }).then((response) => {
      if (response.data.msg) {
        msg = response.data.msg;
        textContent = "";
        isSending = false;
      }
    });
  };

  function handleFileUpload(event) {
    file = event.target.files[0];
    fileName = file.name;
    createFilePreview();
    type = checkFileExtension(fileName);
  }

  function createFilePreview() {
    const reader = new FileReader();
    reader.onload = function (event) {
      filePreview = event.target.result;
    };
    reader.readAsDataURL(file);
  }


  const handleSubmit = async () => {
    isSending = true;
    if (activeTab === "text") {
      await handleTextSubmit();
    } else if (activeTab === "file") {
      await handleFileSubmit();
    }
  };

  if(repost){
    title = "Repost"
    makeRequest("post", "GET", {
      user_token,
      post_id: repost,
    }).then((response) => {
      post = response.data[0];
    });
  }

  $: remainingCharacters = characterLimit - textContent.length;
</script>

<main>
  <Header {navOptions} {title} />
  <div class="tabs">
    <button
      class={activeTab === "text" ? "active" : ""}
      on:click={() => handleTabClick("text")}>Text</button
    >
    <button
      class={activeTab === "file" ? "active" : ""}
      on:click={() => handleTabClick("file")} disabled>File</button
    >
  </div>

  <div class="content">
    {#if activeTab === "file"}
      <div class="file-input">
        {#if !file}
          <div class="upload-container">
            <label for="file-upload" class="upload-button">
              <span><i class="fa fa-upload" /> Upload File </span></label
            >
            <input
              type="file"
              id="file-upload"
              on:change={handleFileUpload}
              hidden
            />
          </div>
        {/if}

        {#if file}
          <div class="file-container">
            {#if filePreview}
              <div class="preview">
                {#if file.type.includes("image")}
                  <img
                    src={filePreview}
                    alt="File Preview"
                    class="selected-image"
                  />
                {:else if file.type.includes("video")}
                  <VideoPlayer
                    videoProps={{ src: filePreview, controls: true }}
                  />
                {:else if file.type.includes("audio")}
                  <MusicPlayer musicProps={{src: filePreview, controls: true }} />
                {:else}
                  <p>{fileName}</p>
                {/if}
              </div>
            {:else}
              <p>{fileName}</p>
            {/if}
            <i
              title="remove"
              class="fa fa-times"
              on:click={() => {
                file = null;
                filePreview = null;
              }}
            />
          </div>
        {/if}
      </div>
    {/if}

    {#if repost}
      <PostBox {post} isRepost={true} />
    {/if}
    <div class="text-input">
      <textarea
        bind:value={textContent}
        maxlength={characterLimit}
        placeholder=" Enter text here..."
      />
      {#if textContent.length > 0}
        <p class="character-count">{remainingCharacters}</p>
      {/if}
    </div>
  </div>

  <div class="submit">
    <button on:click={handleSubmit} class="btn"
      >{repost ? "Repost" : "Submit"}
      <!-- a loader -->
    </button>
  </div>
  <Snackbar {msg} />
</main>

<style>
  main {
    margin-bottom: 20px;
  }
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 1em;
  }

  .tabs button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: var(--color-text);
    margin-right: 10px;
    outline: none;
    border-radius: 0;
  }

  .tabs button:hover,
  .tabs button.active {
    border-bottom: 2px solid var(--color-primary);
    color: var(--color-primary);
  }

  .tabs button:disabled{
    color: var(--color-text-light);
    border: none;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    place-content: center;
    margin-bottom: 50px;
  }
  .content-title {
    text-align: center;
    margin-bottom: 50px;
  }

  .content textarea,
  .content input[type="text"] {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    resize: vertical;
    min-height: 100px;
    border-radius: 5px;
    outline: none;
    font-size: 16px;
  }
  .text-input {
    position: relative;
    width: 90%;
    margin: 0 auto;
  }

  .character-count {
    position: absolute;
    bottom: 5px;
    right: 5px;
    margin: 0;
    color: #aaa;
    font-size: 12px;
  }

  /* IMAGE */
  .image-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
  }

  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px dotted #ccc;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
  }

  .upload-container:hover {
    background-color: #f9f9f9;
  }

  .upload-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: white;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .upload-button i {
    font-size: 20px;
    margin-right: 8px;
  }

  .file-container {
    margin-top: 16px;
    position: relative;
    border: 2px dotted #ccc;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
  }

  .file-container {
    max-width: 90%;
    height: auto;
    margin: 0 auto 16px;
    object-fit: contain;
  }
  .file-container .fa {
    position: absolute;
    bottom: 0;
    right: 5px;
    font-size: 2em;
    cursor: pointer;
  }

  .selected-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .select-image-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #ccc;
  }

  textarea {
    width: 100%;
    height: 250px;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    font-size: 16px;
    resize: none;
    margin-bottom: 16px;
    box-sizing: border-box;
  }
  .submit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2em;
  }
  button.btn {
    background-color: var(--color-primary);
    color: var(--color-light);
    border: none;
    padding: 10px 20px;
    width: 50%;
    border-radius: calc(var(--spacing-large) / 2);
    cursor: pointer;
  }
  button.btn:hover {
    background-color: var(--color-light);
    color: var(--color-primary);
    outline: 2px solid var(--color-primary);
  }
</style>
