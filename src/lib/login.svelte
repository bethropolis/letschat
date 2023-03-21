<script>
  import { navigate } from "svelte-routing";
  import swal from "sweetalert";
  import { makeRequest } from "../api.js";
  import { DB } from "../db.js";
  const userData = {
    name: "test",
    pass: "Bethro77",
    email: "",
  };
  let type = "login";

  function login(userData) {
    if (DB("get", "login")) {
      return swal("hey", "You are already loggedin", "info");
    }
    const headers = {
      "Content-Type": "text/plain",
    };
    const params = {
      usermail: userData.name,
      userpass: userData.pass,
    };
    makeRequest("login", "POST", params, headers)
      .then((response) => {
        if (response.data.username) {
          DB("set", "login", response.data);
          DB("set", "token", response.data.user_token);
          navigate("/home");
          console.log(DB("get", "login", "user"));
        } else {
          swal("Error", response.data.msg, "error");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
</script>

<main>
  {#if type === "login"}
    <div class="form">
      <h1>login</h1>
      <input
        type="text"
        bind:value={userData.name}
        placeholder="username..."
        id="f_mail"
      />
      <input
        type="password"
        bind:value={userData.pass}
        placeholder="password..."
        id="f_pass"
      />
      <button type="submit" class="btn" on:click={async () => await login(userData)}> login</button>
      <br />
      <p>
        Don't have an account <b
          ><a on:click={() => (type = "signup")}>Signup</a></b
        >
        or <a href="#">forgot password?</a>
      </p>
    </div>
  {:else}
    <div class="form">
      <h1>sign up</h1>
      <input
        type="text"
        bind:value={userData.name}
        placeholder="username..."
        id="f_mail"
      />
      <input
        type="email"
        bind:value={userData.email}
        placeholder="email"
        id="f_email"
      />
      <input
        type="password"
        bind:value={userData.pass}
        placeholder="password..."
        id="f_pass"
      />
      <button type="submit" class="btn" on:click={async () => await login(userData)}> Signup</button>
      <br />
      <p>
        Already have an account? <a on:click={() => (type = "login")}>Login</a>
      </p>
    </div>
  {/if}
</main>

<style>
  main {
    display: grid;
    place-content: center;
    width: 100vw;
    height: 100vh;
    text-align: center;
  }
  a {
    color: hsl(275, 100%, 56%);
  }
  .h1 {
    background: none;
    padding: 0;
    margin: 0;
  }
  .form {
    padding: 10vh 0;
    height: auto;
    width: 100vw;
    text-align: center;
  }
  .btn {
    width: 60vw;
    max-width: 200px;
    padding: 15px;
    border-radius: 30px;
    font-size: 1.2rem;
    border: none;
    outline: none;
    background: #6c5ce7;
    color: white;
    transition: 0.1s all;
  }
  .btn:active {
    background: white;
    color: #6c5ce7;
    box-shadow: 0 0 7px #6c5ce7;
    transition: 1s all;
  }
  input {
    width: 85%;
    padding: 1em;
    margin: 0.5rem 0;
    background: #eee;
    border-radius: 2px;
    outline: none;
    border: none;
  }
  .form p {
    width: 90%;
    padding: 1em;
    text-align: left;
  }
</style>
