<script>
  import { nav } from "../route.js";
  export let activePage = "";

  function setActivePage(ispage, num) {
    activePage = ispage;
    nav(ispage);
  }
  export { setActivePage };
</script>

<main>  
  <!-- svelte-ignore component-name-lowercase -->
  <nav>
    <a
      class:selected={activePage === "home"}
      href="#"
      on:click|preventDefault={() => setActivePage("home", 3)}
    >
      <i class="fas fa-home" />
      <span>Home</span>
    </a>
    <a
      class:selected={activePage === "search"}
      href="#"
      on:click|preventDefault={() => setActivePage("search", 8)}
    >
      <i class="fas fa-search" />
      <span>Search</span>
    </a>
    <a
      class:selected={activePage === "notifications"}
      href="#"
      on:click|preventDefault={() => setActivePage("notification", 10)}
    >
      <i class="fas fa-bell" />
      <span>Notifications</span>
    </a>
    <a
      class:selected={activePage === "profile"}
      href="#"
      on:click|preventDefault={() => setActivePage("profile", 4)}
    >
      <i class="fas fa-user" />
      <span>Profile</span>
    </a>
  </nav>

  <!-- your app content goes here -->
</main>

<style>
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: transparent;
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
    -o-tap-highlight-color: transparent;
    -o-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  main {
    position: relative;
    height: fit-content;
    overflow: hidden;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: var(--color-light);
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
    color: #aaa;
    font-size: 12px;
    text-decoration: none;
    user-select: none;
  }

  a i {
    font-size: 20px;
    user-select: none;
  }

  a span {
    margin-top: 3px;
  }

  a.selected {
    color: var(--color-primary);
  }
</style>
