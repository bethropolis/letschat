<script>
  import { login_token } from "../store";
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import { makeRequest } from "../api.js";
  import ModalBottom from "./ui/modalBottom.svelte";
  import { nav } from "../route";
  import { DB } from "../db";
  export let username = {
    title: "my profile",
    action: function () {
     isOpen = !isOpen;
    }
  };
  let isOpen = false;
  export let page;
  const activePage = "profile";
  let profile = {
    id: "hey",
    name: " Bethuel kipsang",
    email: "rkiprotich081@gmail.com",
    picture: "http://192.168.9.101/suplike/img/download.jpg",
    token: "2e5a66dc006db0575cfefb37c05a9484a6f8770cdb",
    isFollowing: true,
    followers: 150,
    following: 100,
    posts: 100,
    chat_key: "000f8411c193e8cc",
    gender: "M",
    bio: "What's popping, am a bot. ",
    date_joined: "2020-12-16",
  };

  let navOptions = [
    {
      title: "chat",
      icon: "fas fa-cog",
      link: "settings",
    },
  ];

  const existingAccounts = DB("get","extAcc","users")|| [];
  console.log("🚀 ~ file: profile.svelte:43 ~ existingAccounts:", existingAccounts)

  function selectAccount(account) {
    DB("remove","homePost");
    DB("remove","ChatList");
    DB("remove","ChatListTime");
    DB("login", account);
    DB("token", account.user_token);
    $login_token = account.user_token;
    isOpen = false;
  }

  function switchAccount() {
    nav("login");
  }

  function updatePage(newPage) {
    console.log(newPage.detail);
    page = newPage.detail; // update the page prop with the new value
  }
</script>

<main>
  <Header title={username} {navOptions} />

  <div class="container">
    <div class="profile-details">
      <img src={profile.picture} alt="Profile picture" />
      <div class="user-name">
        <h2>{profile.name}</h2>
        <h3>@{profile.id}</h3>
        <p class="muted">joined: {profile.date_joined}</p>
      </div>
    </div>
    <div class="info">
      <div class="bio"><p>{profile.bio}</p></div>
    </div>
    <div class="numbers">
      <span class="posts" title="Posts">{profile.posts} posts</span>
      <span class="followers" title="Followers"
        >{profile.followers} followers</span
      >
      <span class="following" title="Following"
        >{profile.following} following</span
      >
    </div>
    <div class="actions flex">
      <button
        on:click={() => {
          profile.isFollowing = !profile.isFollowing;
        }}
        class={profile.isFollowing ? "unfollow" : "follow"}
      >
        <i class="fa fa-plus" />
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </button>
      <button class="chat">
        <i class="fa fa-comment" />
        Chat
      </button>
    </div>
  </div>



  <ModalBottom {isOpen}>
    <div class="modal-content">
      <h2>login with existing account</h2>
      <ul>
        {#if existingAccounts}
        {#each existingAccounts as account}
          <li on:click={() => selectAccount(account)}>
            <img src={account.profile_picture} alt={account.full_name} />
            <span>{account.full_name}</span>
          </li>
        {/each}
        {/if}
      </ul>
      <button class="btn" on:click={switchAccount}>login to account</button>
    </div>
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
  .chat ,.btn{
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
</style>
