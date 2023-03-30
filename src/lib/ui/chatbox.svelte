<script>
  import { convertDateToTime } from "../../extra";
  import { makeRequest } from "../../api";
  import { DB } from "../../db";

  let messages = [];
  let start = 1;
  let data;
  export let username;
  let key;
  let users = DB("get", "ChatList");
  let chatwith = {};
  const chat_key = DB("get", "login", "chat_key");
  const users_avatar = DB("get", "login", "profile_picture");
  let reciever_avatar = "";

  async function updateChatWith() {
    chatwith = (await users.find((user) => user.username === username)) || null;
  }

  async function getMessages(data) {
    console.log("chat_key:", data.from);
    console.log("other_chat_key:", data.to);
    try {
      const response = await makeRequest("chat", "GET", data);
      const chats = await response.data;
      console.log("chats: ", chats);
      if (chats.type == "success") {
        const newMessages = chats.data.map((chat) => ({
          sender: chat.from,
          time: convertDateToTime(chat.timestamp),
          content: chat.message,
          type: chat.type,
          id: chat.id,
        }));
        console.log("newMessages: ", newMessages);
        messages = [...messages, ...newMessages];
      } else {
        console.log("no messages");
      }
      start = messages[messages.length - 1].id;
       setTimeout(
          () => getMessages({ to: data.to, from: data.from, start }),
          5500
        );
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  function renderText(text, emojiClass = "emoji") {
    const emojiRegex = /[\uD800-\uDFFF]/;
    const chars = Array.from(text);
    const hasNonEmoji = chars.some((char) => !emojiRegex.test(char));
    if (hasNonEmoji || chars.length !== 1) {
      return text;
    }
    const newText = `<span class="${emojiClass}">${text}</span>`;
    return newText;
  }

  updateChatWith();

  $: if (key) {
    getMessages({ to: chatwith.chat_key, from: chat_key, start: 1 });
  }

  $: reciever_avatar = chatwith.image;
  $: key = chatwith.chat_key
</script>

<main>
  <div class="chat-box">
    {#each messages as message}
      <div
        class="chat-bubble {message.sender == chat_key ? 'sender' : 'receiver'}"
      >
        <div class="message">
          {#if message.sender !== chat_key}
            <div class="avatar">
              <img src={reciever_avatar} alt="" class="avatar" />
            </div>
          {/if}

          <div class="content">
            {#if message.type === "image"}
              <img src={message.content} alt="shot" class="image" />
            {:else if message.type === "txt"}
              <div class="text">{@html renderText(message.content)}</div>
            {:else}
              <div class="text unsupported">unsuppoarted format</div>
            {/if}
            <div class="time">{message.time}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    width: 100%;
    height: auto;
    margin-bottom: 4.2em;
  }

  .chat-box {
    width: 100%;
  }

  .chat-bubble {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border-radius: 10px;
  }

  .message {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 10px;
  }

  .receiver .message {
    justify-content: flex-start;
  }

  .sender,
  .message {
    justify-content: flex-end;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .content {
    padding: 8px 12px;
    max-width: 70%;
    border-radius: 20px;
    font-size: 14px;
    line-height: 1.4;
    background-color: var(--color-accent-dark);
  }
  .content:has(.image){
    background-color: transparent !important;
  }
  .image{
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 10px;
    margin: 10px;
  }

  .text {
    padding: 8px 12px;
    max-width: 70%;
    border-radius: 20px;
    font-size: 14px;
    line-height: 1.4;
  }
  .unsupported {
    color: var(--mauve);
    font-weight: bold;
  }

  :global(.emoji) {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    margin: 0 0.2em;
    font-size: 5.4em;
    line-height: 2em;
    text-align: center;
    background-color: var(--color-lighter);
    border-radius: 50%;
  }
  :global(.text a) {
    text-decoration: none;
    color: var(--plum);
  }
  .receiver .content {
    color: var(--color-lighter);
    background-color: var(--color-primary);
  }
  .content:has(.unsupported) {
    background-color: #f2f2f2;
  }
  .content:has(.emoji) {
    background-color: transparent;
  }
  :global(.receiver .emoji) {
    padding: 0;
    text-align: left;
  }
  
  .time {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0.2em 0;
    margin-right: 10px;
    font-size: 0.7em;
    color: var(--color-gray);
  }

  .sender .time {
    color: var(--color-text-light);
  }
</style>
