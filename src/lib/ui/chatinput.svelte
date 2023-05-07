<script>
	import MusicPlayer from './musicPlayer.svelte';
	import VideoPlayer from './videoPlayer.svelte';
  import { DB } from "../../db";
  import { makeRequest } from "../../api";
  import {checkFileExtension} from "../../extra"

  let message = "";
  let isExpanded = false;
  export let username;
  let file;
  let fileName;
  let filePreview;
  let type = "txt";
  let sendingmsg = false;

  let users = DB("get", "ChatList");
  let chatwith = {};
  const chat_key = DB("get", "login", "chat_key");

  async function updateChatWith() {
    chatwith = (await users.find((user) => user.username === username)) || null;
  }

  async function pushMessage(send_data) {
    try {
      await makeRequest("chat", "POST", send_data);
      return true;
    } catch (error) {
      console.error(error);
      return
    }
  }

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

  const toggleExpansion = () => {
    isExpanded = !isExpanded;
  };

  const sendMessage = async () => {
    sendingmsg = true;
    if (message !== "" || file) {
      let data = {
      to: chatwith.chat_key,
      from: chat_key,
      message,
      type
    } 
    if (type !== "txt") {
      data.file = file
    }
    await pushMessage(data);
    message = ""
    file = null
    filePreview = null
    sendingmsg = false
  }
  };

  updateChatWith();
  
</script>
<div class="chat-input">
  {#if file}
  <div class="container">
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
            videoProps={{ src: filePreview, controls: false }}
          />
        {:else if file.type.includes("audio")}
          <MusicPlayer musicProps={{src: filePreview, controls: false }} />
        {:else}
          <p>{fileName}</p>
        {/if}
      </div>
    {:else}
      <p>file not supported</p>
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

  <button class="sup_btn" on:click={sendMessage}>
    {#if sendingmsg}
   <i class="fa fa-spinner fa-spin" /> sending file...
  {:else}
   send file <i class="fas fa-paper-plane" />
  {/if}
  </button>
</div>
{:else}
  {#if isExpanded}
    <div class="attachment-options">
      <label for="image-upload"><i class="fas fa-image"  /></label>
      <label for="audio-upload"><i class="fas fa-music" /></label>
      <label for="file-upload"><i class="fas fa-video" /></label>
      <input type="file" id="image-upload" name="image" on:change={handleFileUpload} accept="image/*" hidden />
      <input type="file" id="audio-upload" name="audio" on:change={handleFileUpload}  accept="audio/*" hidden />
      <input type="file" id="file-upload" name="video" on:change={handleFileUpload}  accept="video/*" hidden />
    </div>
  {/if}

  <div class="input-wrapper">
    <button class="add-attachment" on:click={toggleExpansion}>
      <i class="fas fa-plus" />
    </button>
    <textarea
      class={isExpanded ? "expanded" : ""}
      placeholder="Type your message here..."
      bind:value={message}
    />
    <button class="send-button" on:click={sendMessage}>
      <i class="fas fa-paper-plane" />
    </button>
  </div>
  {/if}
</div>

<style>
  .chat-input {
    position: fixed;
    display: grid;
    background-color: var(--lavender);
    height: fit-content;
    border-radius: 30px 30px 0 0;
    width: 100%;
    bottom: 0;
    margin: 0 auto;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: var(--color-input);
    border-radius: 30px;
  }

  .add-attachment {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: var(--color-dark);
    border: none;
    cursor: pointer;
    margin-right: 8px;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: color 0.2s ease-in-out;
  }

  .add-attachment:hover {
    color: var(--color-primary);
  }

  .send-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
    color: var(--color-lighter);
    border: none;
    cursor: pointer;
    margin-right: 8px;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }

  .send-button:hover {
    background-color: #7289da;
  }
  .send-button:active {
    transform: scale(0.9);
  }

  textarea {
    flex: 1;
    font-size: 1rem;
    padding: 10px 16px;
    border: none;
    color: var(--color-dark);
    background-color: inherit;
    border-radius: 30px;
    outline: none;
    resize: none;
    transition: all 0.2s ease-in-out;
  }

  textarea.expanded {
    height: 80px;
  }

  .attachment-options {
    display: flex;
    justify-content: space-evenly;
    height: 70px;
    align-items: center;
  }
  .container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }
  .file-container{
    width: 80%;
    height: min-content;
     max-width: 300px;
     max-height: 400px;
     margin: 0.5em auto;
     border-radius: 10px;
  }
  .file-container img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .file-container .preview{
    width: 100%;
    height: 200px;
    border-radius: 10px;
  }

  .attachment-options label {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: var(--color-icon);
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: color 0.2s ease-in-out;
  }
</style>
