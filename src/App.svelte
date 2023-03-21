<script>
  import Intro from "./lib/intro.svelte";
  import Login from "./lib/login.svelte";
  import Home from "./lib/home.svelte";
  import Profile from "./lib/profile.svelte";
  import Settings from "./lib/settings.svelte";
  import Chat from "./lib/chat.svelte";
  import Post from "./lib/post.svelte";
  import Search from "./lib/search.svelte";
  import Following from "./lib/following.svelte";
  import Notification from "./lib/notification.svelte";
  import Comment from "./lib/comment.svelte";
  import List from "./lib/list.svelte";
  let page = 5;
</script>

<main>
  {#if page == 1}
    <Intro bind:page />
  {:else if page == 2}
    <Login bind:page />
  {:else if page == 3}
    <Home bind:page />
  {:else if page == 4}
    <Profile />
  {:else if page == 5}
    <Settings />
  {:else if page == 6}
    <Chat />
  {:else if page == 7}
    <Post />
  {:else if page == 8}
    <Search />
  {:else if page == 9}
    <Following />
  {:else if page == 10}
    <Notification />
  {:else if page == 11}
    <Comment />
  {:else if page == 12}
    <List />
  {/if}
</main>

<style>
  main {
    height: 100vh;
  }
</style>
