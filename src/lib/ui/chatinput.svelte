<script>
  import { DB } from "../../db";
  import { makeRequest } from "../../api";

  let message = "";
  let isExpanded = false;
  let data;
  export let username;

  let users = DB("get", "ChatList");
  let chatwith = {};
  const chat_key = DB("get", "login", "chat_key");

  async function updateChatWith() {
    chatwith = (await users.find((user) => user.username === username)) || null;
  }

  async function pushMessage(data) {
    console.log("chat_key:", data.from);
    console.log("other_chat_key:", data.to);
    try {
      const response = await makeRequest("chat", "POST", data);
      const message = await response.data;
      console.log("message sent: ", message);
      return true;
    } catch (error) {
      console.error(error);
      return
    }
  }

  const toggleExpansion = () => {
    isExpanded = !isExpanded;
  };

  const sendMessage = () => {
    if (message !== "") {
    pushMessage({
      to: chatwith.chat_key,
      from: chat_key,
      message: message
    });
    message = ""
  }
  };

  updateChatWith();
  
</script>

<div class="chat-input">
  {#if isExpanded}
    <div class="attachment-options">
      <button><i class="fas fa-image" /></button>
      <button><i class="fas fa-music" /></button>
      <button><i class="fas fa-file" /></button>
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
</div>

<style>
  .chat-input {
    position: fixed;
    display: grid;
    grid-template-columns: repeat(1fr auto, 2);
    background-color: var(--color-post);
    padding: 8px;
    height: fit-content;
    border-radius: 45px 45px 0 0;
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

  .attachment-options button {
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
