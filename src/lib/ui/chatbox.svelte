<script>
  import { convertDateToTime } from "../../extra";
  import { makeRequest } from "../../api";
  import { DB } from "../../db";
  import VideoPlayer from "./videoPlayer.svelte";
  import MusicPlayer from "./musicPlayer.svelte";
  import Lightbox from "./lightbox.svelte";
  import { nav } from "../../route";

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
  const emojiRegex = /[\uD800-\uDFFF]/;
  let y;
  let lightbox;

  async function updateChatWith() {
    console.log("🚀 ~ file: chatbox.svelte:26 ~ updateChatWith ~ chatwith:", users)
    chatwith = (await users.find((user) => user.username === username)) || {};
  }

  async function getMessages(data) {
    try {
      const response = await makeRequest("chat", "GET", data);
      const chats = await response.data;
      if (chats.type == "success") {
        const newMessages = chats.data.map((chat) => ({
          sender: chat.from,
          time: convertDateToTime(chat.timestamp),
          content: chat.message,
          type: chat.type,
          id: chat.id,
        }));
        messages = [...messages, ...newMessages];
      }
      if (messages.length > 0) {
        start = messages[messages.length - 1].id;
      }
      setTimeout(
        () => getMessages({ to: data.to, from: data.from, start }),
        4000
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function renderText(text) {
    if (emojiRegex.test(text)) {
      // Render emoji if there are emoji characters in the text
      text = renderEmoji(text);
    }

    // Check for code blocks enclosed in triple backticks
    const codeRegex = /```([\s\S]*)```/;
    if (codeRegex.test(text)) {
      // Replace code blocks with <pre><code> elements
      text = text.replace(codeRegex, (match, p1) => {
        return renderCode(p1);
      });
    }
    if (text.includes("\n")) {
      // Add line breaks if there are "\n" characters in the text
      text = addBreaks(text);
    }

    // Add other checks for additional text formatting functions here
    return text;
  }

  function renderEmoji(text, emojiClass = "emoji") {
    // Add an emoji class if the first character of the text is an emoji
    if (emojiRegex.test(text) && text.length === 2) {
      text = `<span class="${emojiClass}">${text}</span>`;
    }
    return text;
  }

  function addBreaks(text, separator = "r\n") {
    // Replace separator with line breaks
    return text.replace(new RegExp(separator, "g"), "<br>");
  }

  function renderCode(code) {
    // Wrap code block in <pre><code> element
    return `<pre><code>${code.trim()}</code></pre>`;
  }

  function renderShare(text, num=false) {
    const parts = text.split("|");
    if (num) return parts[1];
    return parts[0];
  }

  updateChatWith();

  $: if (key) {
    getMessages({ to: chatwith.chat_key, from: chat_key, start: 1 });
  }
  $: if (messages) {
    setTimeout(() => {
      y = document.body.scrollHeight;
    }, 300);
  }

  $: reciever_avatar = chatwith.image;
  $: key = chatwith?.chat_key || "";
</script>

<svelte:window bind:scrollY={y} />
<main>
  <Lightbox bind:this={lightbox} />
  <div class="chat-box">
    {#each messages as message}
      <div
        class="chat-bubble {message.sender == chat_key
          ? 'sender'
          : 'receiver'} {message.type}"
      >
        <div class="message">
          {#if message.sender !== chat_key}
            <div class="avatar">
              <img src={reciever_avatar} alt="" class="avatar" />
            </div>
          {/if}

          <div class="content">
            {#if message.type === "image" || message.type === "img"}
              <img
                src={message.content}
                alt="shot"
                class="image"
                on:click={() => {
                  lightbox.openLightbox(message.content);
                }}
              />
            {:else if message.type === "txt"}
              <div class="text">{@html renderText(message.content)}</div>
            {:else if message.type === "vid"}
              <div class="image">
                <VideoPlayer
                  videoProps={{ src: message.content, controls: true }}
                />
              </div>
            {:else if message.type === "mus"}
              <div class="image">
                <MusicPlayer musicProps={{ src: message.content }} />
              </div>
            {:else if message.type === "share"}
              <div class="image share">
                <div class="share">
                  <span>{username} shared a {renderShare(message.content)} with you</span>
                  <button class="btn" on:click={() =>nav(`${renderShare(message.content)}/${renderShare(message.content, true)}`)}>view {renderShare(message.content)}</button>
                </div>
              </div>
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
    margin-bottom: 5.2em;
  }

  .chat-box {
    width: 100%;
    margin-bottom: 20px;
    height: auto;
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
  .content:has(.image) {
    background-color: transparent !important;
  }

  .image {
    width: 100%;
    height: auto;
    max-width: 100%;
    object-fit: contain;
    border-radius: 10px;
    margin: 10px;
  }
  .content img {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }

  .text {
    padding: 8px 12px;
    max-width: 70%;
    border-radius: 20px;
    font-size: 14px;
    line-height: 1.4;
  }

  .share{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:10px;
  }

  .share span {
    font-weight: bold;
    font-size: 14px;
    color: var(--color-text-lighter);
  }

  .share .btn{
    background-color: var(--color-primary);
    color: var(--color-lighter);
    border: none;
    border-radius: 10px;
    padding: 5px 10px;
    font-size: 14px;
    font-weight: bold;
    width: 90%;
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
  :global(code) {
    /* wrap text */
    white-space: pre-wrap;
    padding: 0.2em 0.4em;
    font-size: 0.8em;
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
