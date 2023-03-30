<script>
	import Snackbar from './ui/snackbar.svelte';
  import { onMount } from "svelte";
  import ModalBottom from "./ui/modalBottom.svelte";
  import { nav } from "../route";
  import { formatTime } from "../extra";
  import { DB } from "../db";

  export let chats = [];
  export let users = [];
  let chatwith = null;
;
  let searchActive = true;
  let searchQuery = "";
  let msg;

  function toggleSearch() {
    searchActive = !searchActive;
  }

  function handleSearchInput(event) {
    searchQuery = event.target.value;
  }

  function clearSearch() {
    searchQuery = "";
  }
  async function letsChat(username) {
    nav(`/chat/${username}`);
  }
  let isSheetOpen = false;

  const toggleSheet = () => {
    isSheetOpen = !isSheetOpen;
  };
  
  onMount(() => {
    if (DB("get", "ChatList")) {
      if(typeof DB("get", "ChatList") == "object"){ 
      chats = DB("get", "ChatList");
     }
    }
  });

  $: users = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<main>
  <div class="app">
    <div class="header">
      {#if searchActive}
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search"
            on:input={handleSearchInput}
            value={searchQuery}
          />
          <button on:click={clearSearch}>Clear</button>
        </div>
      {:else}
        <h1>
          <span>Messages</span>
          <i class="fas fa-search" on:click={toggleSearch} />
        </h1>
      {/if}
    </div>

    <section class="chat-list">
      {#each users as chat}
        <div
          class="item"
          on:click={() => {
            letsChat(chat.username);
          }}
        >
          <img
            src="{chat.image}"
            alt=""
            class="avatar"
          />
          <div class="message">
            <h3 class="name">
              {chat.firstname
                ? chat.firstname + " " + " " || chat.lastname
                : chat.username}
            </h3>
            <div class="last-message"
              ><p class="msg ellipsis">{@html chat.msg||"empty chat"}</p><div class="time"
                > {formatTime(chat.time)}</div
              >
            </div>
          </div>
        </div>
      {/each}
    </section>
    {#if users.length == 0}
      <p>There are no users found for query: {searchQuery}</p>
    {/if}
  </div>
  <Snackbar {msg}/>
  <ModalBottom isOpen={isSheetOpen}>hello</ModalBottom>
</main>

<style>
  main {
    margin: 0;
  }
  .app {
    margin: 0;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  h1 span {
    display: inline-block;
    margin-right: 10px;
  }
  .search-bar {
    margin: 1em auto;
    width: calc(100% - 40px);
    /* light sunken search background color */
    background-color: #f0f0f0;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: calc(1em + 5px);
    z-index: 1;
  }
  .search-bar input[type="text"] {
    background: inherit;
    border: none;
    outline: none;
    flex: 1;
    margin-right: 10px;
    padding: 0.7rem;
  }
  .search-bar button {
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
  }
  .chat-list {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .item {
    margin: 0;
    padding: 20px 10px;
    border-radius: 4px;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: var(--color-light);
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  }
  .item:hover {
    background-color: #f2f2f2;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .message {
    width: 100%;
  }
  .last-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 5vw);
    font-size: 14px;
    color: #9b9b9b;
  }
  .last-message p.msg {
    width: 200px;
  }
  .ellipsis {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

  .last-message .time {
    display: flex;
    width: 100%;
    justify-content: end;
  }
</style>
