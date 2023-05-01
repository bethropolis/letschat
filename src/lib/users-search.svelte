<script>
  import { login_token } from "../store.js";
  import { makeRequest } from "../api.js";
  import { nav } from "../route.js";
  import APP from "../app.json";
  import { DB } from "../db.js";
  import Snackbar from "./ui/snackbar.svelte";
  import Following from "./following.svelte";
  import { onMount } from "svelte";
  let user_token = $login_token;
  let users = [];
  export let query;
  export let type;
  let msg;
  let snackbar;
  export async function makeSearch(pass=false) {
    if (!query) {
      if (DB("get", "popular")) {
        return (users = DB("get", "popular"));
      }
    }

    const { data } = await makeRequest("search", "GET", {
      user_token,
      query,
      type,
    });
    console.log(data);
    users = data.data;
    !query && DB("set", "popular", data.data);
  }

  let selectedUser = null;
  let active;

  function selectUser(user) {
    selectedUser = user;
  }
  function loadProfile(user) {
    nav(`profile/${user.uidusers}`);
  }

  async function newFollow(user) {
    console.log("🚀 ~ file: users-search.svelte:43 ~ newFollow ~ user:", user)
    await makeRequest("follow", "POST", {
      user_token: $login_token,
      following: user.uidusers,
    }).then((data) => {
      snackbar?.showSnackbar(data.data.msg);
      console.log("🚀 ~ file: users-search.svelte:48 ~ newFollow ~ user:", user,msg)
      if(data.data.type == "success"){
        data.data.msg == "Followed" ? user.following = true : user.following = false;
        DB("set", "popular", users);
        makeSearch();
      console.log("🚀 ~ file: users-search.svelte:48 ~ newFollow ~ user:", user)
      }
    });
  }

 
  onMount(()=>{
    users = DB("get", "popular");
  })
</script>

<main>
  {#if users}
    <div class="user-list">
      {#each users as user}
        <div
          class="user"
          class:active={selectedUser === user}
          on:click={() => selectUser(user)}
        >
          <img
            src="{APP.base_url}/img/{user.profile_picture}"
            alt={user.uidusers}
            on:click={() => loadProfile(user)}
          />
          <div class="info">
            <div class="name" on:click={() => loadProfile(user)}>
              {user.uidusers}
            </div>
            <div class="username">{user.bio || "i am using suplike"}</div>
          </div>
          <div class="actions">
            <button
              class={user.following ? "active" : ""}
              on:click={async (elem) => {
                await newFollow(user);
                active = !active;
              }}
            >
              {#if user.following}
              <i class="fa fa-check" />
              {:else}
              <i class="fa fa-plus" />
              {/if}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="alert">
      <i class="fa fa-search" />
      <span>No users found</span>
    </div>
  {/if}
  <Snackbar bind:msg bind:this={snackbar}/>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-bottom: 4em;
  }
  .user-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  .user {
    display: flex;
    align-items: center;
    padding: 0.7em 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  .user:last-child {
    border-bottom: none;
  }

  .user:hover {
    background-color: #f5f5f5;
  }

  .user img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }

  .user .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user .name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  .user .username {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 5px;
  }

  .user .last-msg {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user .time {
    font-size: 0.8rem;
    color: #888;
    margin-left: auto;
  }
  .user .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
  }
  .user .actions button {
    background-color: transparent;
    border: none;
    color: #9b9b9b;
    cursor: pointer;
    font-size: 1.1rem;
    border-radius: 50%;
    transition: all 0.5s ease;
  }
  .user .actions button:hover {
    /* disable */
    color: var(--color-primary);
  }
  .user .actions button.active {
    color: var(--color-accent);
  }

  .active {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    .user img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .user .name {
      font-size: 1rem;
    }

    .user .username {
      font-size: 0.8rem;
    }

    .user .last-msg {
      display: none;
    }

    .user .time {
      font-size: 0.7rem;
    }
  }
</style>
