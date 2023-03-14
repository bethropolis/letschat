<script>
 import Intro from './lib/intro.svelte'
  import Login from './lib/login.svelte'
  import Home from './lib/home.svelte'
  import Profile from './lib/profile.svelte'
  import Settings from './lib/settings.svelte'
  import Chat from './lib/chat.svelte'
  import Post from './lib/post.svelte'
  import Search from './lib/search.svelte'
  import Following from './lib/following.svelte'
  import Notification from './lib/notification.svelte'
  import Comment from './lib/comment.svelte'
  import List from './lib/list.svelte'
	let page = 3;
</script>

<main>
  {#if page == 1 }
    <Intro bind:page={page}/>
  {:else if page == 2 }
    <Login bind:page={page}/>
  {:else if page == 3 }
    <Home bind:page={page}/>
  {:else if page == 4 }
    <Profile bind:page={page}/>
  {:else if page == 5 }
    <Settings bind:page={page}/>
  {:else if page == 6 }
    <Chat bind:page={page}/>
  {:else if page == 7 }
    <Post bind:page={page}/>
  {:else if page == 8 }
    <Search bind:page={page}/>
  {:else if page == 9 }
    <Following bind:page={page}/>
  {:else if page == 10 }
    <Notification bind:page={page}/>
  {:else if page == 11 }
    <Comment bind:page={page}/>
  {:else if page == 12 }
    <List bind:page={page}/>
  {/if}
</main>



<style>
main{
	height:100vh;
	background: #a89ef5;	
 }
</style>