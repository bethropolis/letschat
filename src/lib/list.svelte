<script>
  import { makeRequest } from "../api";
  import { nav } from "../route";
  let chats = [
    {
      name: "steven webb",
      username: "bob",
      image: "https://example.com/1",
      msg: "Okay, see you there than!",
      time: "14:24",
    },
    {
      name: "jane doe",
      image: "https://example.com/2",
      msg: "Just finished my workout!",
      time: "10:45",
    },
    {
      name: "john doe",
      image: "https://example.com/3",
      msg: "Let's grab a coffee later",
      time: "09:12",
    },
    {
      name: "maria garcia",
      image: "https://example.com/4",
      msg: "Can you send me the details?",
      time: "yesterday",
    },
    {
      name: "jason smith",
      image: "https://example.com/5",
      msg: "Happy birthday!",
      time: "2 days ago",
    },
    {
      name: "susan brown",
      image: "https://example.com/6",
      msg: "Looking forward to seeing you!",
      time: "3 days ago",
    },
    {
      name: "peter parker",
      image: "https://example.com/7",
      msg: "Thanks for the help!",
      time: "last week",
    },
  ];
  let users = [];
  let navOptions = [
    {
      title: "home",
      icon: "fas fa-home",
      link: "/home",
    },
  ];
  let searchActive = true;
  let searchQuery = "";

  function toggleSearch() {
    searchActive = !searchActive;
  }

  function handleSearchInput(event) {
    searchQuery = event.target.value;
  }

  function clearSearch() {
    searchQuery = "";
  }
  function letsChat(user) {
    nav(`/chat/${user}`);
  }

  $: users = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            letsChat(chat.name);
          }}
        >
          <img src={chat.image} alt="" class="avatar" />
          <div>
            <h3 class="name">{chat.name}</h3>
            <span class="last-message">{chat.msg} - {chat.time}</span>
          </div>
        </div>
      {/each}
    </section>
    {#if users.length == 0}
      <p>There are no users found for query: {searchQuery}</p>
    {/if}
  </div>
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
    width: (100% - 20px);
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
  .last-message {
    font-size: 14px;
    color: #9b9b9b;
  }
</style>
