<script>
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import { makeRequest } from "../api.js";
  export let username = "my profile";
  export let page; 
  const activePage = "profile";
  let profile = {
    id: "waifu",
    name: " Bethuel kipsang",
    email: "rkiprotich081@gmail.com",
    picture: "https://suplike.xyz/img/waifu.svg",
    token: "2e5a66dc006db0575cfefb37c05a9484a6f8770cdb",
    isFollowing: true,
    followers: 150,
    following: 100,
    posts: 100,
    chat_key: "000f8411c193e8cc",
    gender: "M",
    bio: "What's popping, am a waifu bot. ",
    date_joined: "2020-12-16",
  };
 let navOptions = [ 
  {
    title: "chat",
    icon: "fas fa-cog",
    link: "/settings"
  }
  ]
  function updatePage(newPage) {
    console.log(newPage.detail);
    page = newPage.detail; // update the page prop with the new value
  }
</script>

<main>
  <Header title={username} {navOptions}/>

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
        on:click={() => {(profile.isFollowing = !profile.isFollowing)}} 
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
    color: var(--color-primary);
  }

  .profile-details h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .profile-details h3 {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    color: #555;
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
  .chat {
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
</style>
