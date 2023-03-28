<script>
  import { Router, Route } from 'svelte-routing';
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
</script>

<main>
  <Router>
    <Route path="/" component={Intro} />
    <Route path="/login" component={Login} />
    <Route path="/home" component={Home} />
    <Route path="/profile" component={Profile} />
    <Route path="/profile/:username" component={Profile} />
    <Route path="/settings" component={Settings} />
    <Route path="/chat" component={Chat} />
    <Route path="/chat/:username" component={Chat} />
    <Route path="/post" component={Post} />
    <Route path="/search" component={Search} />
    <Route path="/following" component={Following} />
    <Route path="/notification" component={Notification} />
    <Route path="/comment" component={Comment} />
  </Router>
</main>

<style>
  @font-face {
  font-family: 'Roboto';
  src: url('assets/roboto/Roboto-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: regular;
  }
  :global(:root) {
    --color-primary: rgba(152, 158, 240, 0.844);
    --color-primary-dark: #a068c4;
    --color-accent: rgba(152, 158, 240, 0.844);
    --color-gray: #ccc;
    --color-light: #232323;
    --color-dark: #fff;
    --color-icon: #3f3f3f;
    --color-text: #221e1e;
    --color-text-light: #858585;
    --spacing-small: 1rem;
    --spacing-medium: 2rem;
    --spacing-large: 3rem;
    --font: 'Roboto', sans-serif;
  }
  :global(body,main){
    background-color: var(--color-light);
    color: var(--color-dark);
    font-family: var(--font);
  }
  
  :global(*:focus) {
  outline: none;
}

:global(*){
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
  </style>

