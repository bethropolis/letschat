<script>
  import { Router, Route } from "svelte-routing";
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
  import StoriesBox from "./lib/ui/storiesBox.svelte";
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
    <Route path="/chat/:username" component={Chat} let:params />
    <Route path="/post" component={Post} />
    <Route path="/search" component={Search} />
    <Route path="/following" component={Following} />
    <Route path="/notification" component={Notification} />
    <Route path="/comment/:post" component={Comment} />
  </Router>
</main>

<style>
  @font-face {
    font-family: "Roboto";
    src: url("assets/roboto/Roboto-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: regular;
  }
  :global(:root) {
    --color-primary: #6c5ce7;
    --color-primary-dark: rgba(159, 165, 241, 0.945);
    --color-accent: rgba(50, 159, 192, 0.844);
    --color-accent-dark: rgba(110, 207, 236, 0.863);
    --color-lighter: rgba(255, 255, 255, 0.9);
    --color-gray: #ccc;
    --color-post: #ffffffff;
    --color-light: #fff;
    --color-lighgter: #f8f8f8;
    --color-input: #f8f8f8;
    --color-text: #333;
    --color-text-light: #666;
    --color-text-lighter: #999;
    --color-text-dark: #666;
    --color-dark: #232323;
    --color-icon: #858181;
    --color-text: #221e1e;
    --color-text-light: #858585;
    --lavender: #e6e6fa;
    --lilac: #c8a2c8;
    --mauve: #b19cd9;
    --amethyst: #9966cc;
    --violet: #8f00ff;
    --plum: #dda0dd;
    --orchid: #da70d6;
    --magenta: #ff00ff;
    --fuchsia: #ff00ff;
    --indigo: #4b0082;
    --spacing-small: 1rem;
    --spacing-medium: 2rem;
    --spacing-large: 3rem;
    --font: "Roboto", sans-serif;
  }
  
  :global(body, main) {
    background-color: var(--color-light);
    color: var(--color-dark);
    font-family: var(--font);
  }

  :global(*:focus) {
    outline: none;
  }

  :global(*) {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
