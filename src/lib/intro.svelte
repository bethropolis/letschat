<script>
  import { onMount } from "svelte";
  import image from "../assets/intro.png";
  import { nav } from "../route";
  import { DB } from "../db";
  let main;
  function toSignup() {
    nav("signup");
  }
  function toLogin() {
    nav("login");
  }
  onMount(() => {
    if (DB("get", "login")) {
      nav("home");
    }
  });

</script>

<main bind:this={main}>
  <div class="cover">
    <img class="image" src={image} />
    <div class="shadow" />
  </div>
  <div class="text">
    <div class="button">
      <button class="sup_btn" on:click={toSignup}>Sign up to suplike</button>
    </div>

    <div class="button">
      <button class="sup_btn self">select your own server</button>
    </div>
  </div>
  <div class="container">
    <span class="line" />
    <span class="or">or</span>
    <span class="line" />
  </div>
  <div class="footer">
    <div class="item">
      <a href="http://">Github</a>
    </div>
    <div class="item">
      <a href="#" on:click={toLogin}>Log in</a>
    </div>
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    background: #a89ef5;
    overflow-y: hidden;
  }
  .cover {
    position: relative;
    display: grid;
    align-items: center;
    justify-content: center;
    height: 72vh;
  }
  .image {
    position: relative;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  .shadow {
    position: relative;
    width: 100%;
    height: 1px;
    bottom: -10px; /* adjust this value to change the distance of the shadow */
    left: 0;
    transform: scale(
      0.5
    ); /* adjust this value to change the size of the shadow */
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
  }
  .text {
    width: 100%;
    text-align: center;
    position: relative;
    font-size: 1.4em;
    color: white;
    font-family: monospace;
  }
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    margin-top: 0.5em;
  }
  :global(.sup_btn) {
    background-color: var(--color-primary);
    color: var(--color-light);
    border: none;
    padding: 12px;
    width: 95%;
    font-size: large;
    border-radius: calc(var(--spacing-medium) / 2);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: 0.2s all;
  }
  :global(.sup_btn:hover:not(.self)) {
    background-color: var(--color-light);
    color: var(--color-primary);
    outline: 2px solid var(--color-primary);
  }

  button.self {
    background-color: var(--lilac);
  }
  button.self:hover {
    background-color: var(--color-light);
    color: var(--lilac);
    outline: 2px solid var(--lilac);
  }
  .container {
    width: 100vw;
    display: flex;
    align-items: center;
    margin-top: 1em;
  }

  .line {
    flex: 1;
    height: 1px;
    background: var(--color-line);
  }

  .or {
    color: white;
    margin: 0 10px;
    font-size: 20px;
  }

  .footer {
    margin-top: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin: 0 auto;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .item a {
    text-decoration: none;
    color: white;
    font-size: 1.2em;
    margin: 0 10px;
    transition: 0.2s all;
  }
  .item a:hover {
    color: var(--color-primary);
    opacity: 0.8;
  }
</style>
