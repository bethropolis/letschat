<script>
  import { login_token } from "../store.js";
  import { makeRequest } from "../api.js";
  import { DB } from "../db.js";
  import { nav } from "../route.js";
  import { snack } from "../snack.js";
  import Header from "./header.svelte";
  const userData = {
    name: "",
    pass: "",
    email: "",
  };
  let title = "login to account";
  let loginInProgress = false;

  async function login(userData) {
    if (DB("get", "login", "username") === userData.name) {
      await snack("You are already loggedin");
      return nav("home");
    }

    const headers = {
      "Content-Type": "text/plain",
    };
    const params = {
      usermail: userData.name,
      userpass: userData.pass,
    };

    function updateExtAcc(newData) {
      const oldData = DB("get", "extAcc").users || [];

      DB("clear"); // this is to remove prev user's data

      if (!oldData.some((oldItem) => oldItem.username === newData.username)) {
        const combinedData = [...oldData, newData];
        DB("update", "extAcc", JSON.stringify({ users: combinedData }));
        return
      }
      return DB("update", "extAcc", JSON.stringify({ users: oldData }));
    }

    loginInProgress = true;
    await makeRequest("login", "POST", params, headers)
      .then(async (response) => {
        loginInProgress = false;
        if (response.data.username) {
          updateExtAcc(response.data);
          DB("set", "login", response.data);
          DB("set", "token", response.data.user_token);
          $login_token = response.data.user_token;
          nav("home");
        } else {
          snack(response.data.msg);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
</script>

<Header {title} to={"intro"} />
<main>
  <div class="form">
    <input
      type="text"
      bind:value={userData.name}
      placeholder="username or mail..."
      id="f_mail"
    />
    <input
      type="password"
      bind:value={userData.pass}
      placeholder="password..."
      id="f_pass"
    />

    <button
      type="submit"
      class="sup_btn"
      on:click={async () => await login(userData)}
    >
      {#if loginInProgress}
        <i class="fas fa-spinner fa-spin" />
        logging in...
      {:else}
        login
      {/if}
    </button>
  </div>
  <div class="container">
    <span class="line" />
    <span class="or">or</span>
    <span class="line" />
  </div>
  <div class="footer">
    <div class="item">
      <a href="http://">help</a>
    </div>
    <div class="item">
      <a
        href="#"
        on:click|preventDefault={() => {
          nav("signup");
        }}>sign up</a
      >
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    text-align: center;
  }

  a {
    color: var(--secondary-color);
  }

  .form {
    margin-top: 3em;
    height: auto;
    width: 100%;
    text-align: center;
  }

  .sup_btn {
    width: 80%;
    border-radius: calc(var(--spacing-large) / 2);
  }

  input {
    margin-bottom: 1em;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    padding: 18px 12px;
    width: 78vw;
    border: 2px solid #ccc;
    background-color: var(--color-lighter);
    outline: none;
    border-radius: 4px;
    transition: all 0.3s ease-in-out;
  }

  input:focus {
    /* Change the border color to a darker gray */
    border-color: var(--primary-color);
    /* Add a subtle box shadow */
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  input::placeholder {
    /* Use a lighter font color for the placeholder text */
    color: #aaa;
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
    color: var(--text-dark);
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
    color: var(--mauve);
    font-size: 1.2em;
    margin: 0 10px;
    transition: 0.2s all;
  }
  .item a:hover {
    color: var(--color-primary);
    opacity: 0.8;
  }
</style>
