<script>
  import { login_token } from "../store";
  import PostBox from "./ui/postBox.svelte";
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import { makeRequest } from "../api.js";
  import ModalBottom from "./ui/modalBottom.svelte";
  import { nav } from "../route";
  import { DB } from "../db";
  import { snack } from "../snack";
  import { LogOut } from "../extra";

  export let username = {
    title: "my profile",
    username: DB("get", "login", "username"),
    action: function () {
      isOpen = !isOpen;
    },
  };
  let info = {
    icon: "fa-arrow-right-from-bracket",//
    type: "action",
    action: function () {
      LogOut();
    }
  };
  let isOpen = false;
  export let page;
  const activePage = "profile";
  let profile = null;
  let is_switching = false;
  let navOptions = [
    {
      title: "chat",
      icon: "fas fa-cog",
      link: "settings",
    },
  ];

  async function getProfile(user) {
    let name = typeof username == "object" ? username.username : username;
    name = user ? user : name;

    await makeRequest("profile", "GET", {
      user_token: $login_token,
      username: name,
    })
      .then((res) => {
        profile = res.data;
      })
      .catch((err) => {
      });
  }

  const existingAccounts = DB("get", "extAcc", "users") || [];

  async function selectAccount(account) {
    is_switching = true;
    let ext_acc = DB("get", "extAcc");
    DB("clear");
    DB("set", "extAcc", ext_acc);
    await DB("set", "login", account);
    await DB("set", "token", account.user_token);
    $login_token = account.user_token;
    await getProfile(account.username);
    await setTimeout(() => {
      isOpen = false;
    }, 1000);
    await setTimeout(() => {
      is_switching = false;
    }, 1000);
  }

  function switchAccount() {
    LogOut();
    nav("login");
  }
  async function followUser() {
    await makeRequest("follow", "POST", {
      user_token: $login_token,
      following: typeof username === "object" ? username.username : username,
    }).then((res) => {
      if (res.data.type === "error") {
        return snack(res.data.msg);
      }
      profile.isFollowing = !profile.isFollowing;
    });
  }

  function updatePage(newPage) {
    console.log(newPage.detail);
    page = newPage.detail; // update the page prop with the new value
  }

  $: username && getProfile();
</script>

<main>
  <Header title={username} {navOptions} />
 {#if profile}
  <div class="container">
    <div class="profile-details">

      <img src={profile.picture} alt="Profile picture" />
      <div class="user-name">
        <h2>{profile.name === " " ? profile.username : profile.name||" "}</h2>
        <h3>@{profile.username || ""}</h3>
        <p class="muted">joined: {profile.date_joined||""}</p>
      </div>
    </div>
    <div class="info">
      <div class="bio"><p>{profile.bio || "im using suplike"}</p></div>
    </div>
    <div class="numbers">
      <span class="posts" title="Posts">{profile.post||""} posts</span>
      <span class="followers" title="Followers"
        >{profile.followers||""} followers</span
      >
      <span class="following" title="Following"
        >{profile.following||""} following</span
      >
    </div>
    <div class="actions flex">
      {#if DB('get',"login","username") != profile.username}
      <button
        on:click={followUser}
        class={profile.isFollowing ? "unfollow" : "follow"}
      >
        <i class="fa fa-plus" />
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </button>

      <button
        class="chat"
        on:click={() => {
          nav(`chat/${profile.username}`);
        }}
      >
        <i class="fa fa-comment" />
        Chat
      </button>
      {/if}
    </div>
  </div>
  {/if}
  <div class="posts-page">
    {#if profile && profile.posts?.length > 0}
      {#each profile.posts as post}
        <PostBox {post} />
      {/each}
    {/if}
  </div>
  <ModalBottom bind:isOpen {info}>
    {#if !is_switching && isOpen}
      <div class="modal-content">
        <h2>login with existing account</h2>
        <ul>
          {#if existingAccounts}
            {#each existingAccounts as account}
              <li on:click={() => selectAccount(account)}>
                <img src={account.profile_picture} alt={account.full_name} />
                <span>{account.full_name === " " ? account.username : account.full_name}</span>
              </li>
            {/each}
          {/if}
        </ul>
        <button class="btn" on:click={switchAccount}>login to account</button>
      </div>
    {:else}
      <!-- a loader is shown, switching accounts -->
      <div class="loader">
        <i class="fa fa-spinner fa-spin" />
          {#if DB('get',"login","username") != profile.username}
        <span> switching accounts...</span>
        {:else}
        <span>you're logged in...</span>
        {/if}
      </div>
    {/if}
  </ModalBottom>
  <Footer {activePage} on:updatePage={updatePage} />
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Roboto", sans-serif;
    padding: 20px;
    margin-bottom: 4em;
  }

  .profile-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 700px;
    margin-bottom: 20px;
  }

  .profile-details img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
  }

  .profile-details .user-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .profile-details h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: var(--color-dark);
  }

  .profile-details h3 {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    color: var(--color-gray);
  }

  .profile-details .muted {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    color: #999;
  }

  .info {
    width: 100%;
    max-width: 700px;
    margin-bottom: 20px;
    padding: 20px;
    background-color: var(--color-light);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    text-align: center;
  }

  .info p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }

  .numbers {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 700px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #555;
  }

  .numbers span {
    margin-right: 20px;
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 700px;
  }

  .follow,
  .unfollow,
  .chat,
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-light);
    background-color: var(--color-primary);
    border: none;
    border-radius: calc(2em + 4vw);
    width: 100%;
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .follow:hover,
  .chat:hover {
    /* outline */
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
  .unfollow {
    background-color: var(--color-light);
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    transition: all 0.2s ease-in-out;
  }

  .fa {
    margin-right: 10px;
  }

  .posts-page {
    margin-bottom: 4.5em;
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
  }

  .modal-content h2 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .modal-content ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    max-height: 240px;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .modal-content li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px;
    border-radius: 8px;
    background-color: #f2f2f2;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .modal-content li:hover {
    background-color: #e0e0e0;
  }

  .modal-content li img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 16px;
  }

  .modal-content li span {
    font-weight: bold;
    flex-grow: 1;
    margin-right: 16px;
  }
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    font: 16px sans-serif;
  }
</style>
