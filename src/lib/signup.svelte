<script>
  import {
    LogOut,
    getPasswordStrength,
    isValidEmail,
    isValidUsername,
  } from "../extra.js";
  import { makeRequest } from "../api.js";
  import { DB } from "../db.js";
  import { nav } from "../route.js";
  import { snack } from "../snack.js";
  import Header from "./header.svelte";
  const userData = {
    name: "",
    username: "",
    password: "",
    email: "",
  };
  let title = "sign up an account";
  let type = "signup";
  let error = "";
  let itemError = "";
  let passStrenght = "strong";
  //   similar to login.svelte
  async function signup(userData) {
    if (!(await validate())) return;
    if (DB("get", "login", "username") === userData.username) {
      await snack("You are already loggedin");
      return nav("home");
    }

    const headers = {
      "Content-Type": "text/plain",
    };
    const params = {
      name: userData.name,
      username: userData.username,
      password: userData.password,
      email: userData.email,
    };

    await makeRequest("signup", "POST", params, headers)
      .then((response) => {
        if (response.data.type !== "error") {
          LogOut();
          DB("set", "login", response.data);
          type = "rules";
		  title = "server rules";
		  return
        } else {
          error = response.data.msg;
        }
      })
      .catch((error) => {
        snack(error.response.data.msg);
      });
  }
  function validate() {
    if (isValidUsername(userData.username) !== "") {
      error = isValidUsername(userData.username);
      itemError = "username";
      return false;
    }
    if (isValidEmail(userData.email) !== "") {
      error = isValidEmail(userData.email);
      itemError = "email";
      return false;
    }
    if (getPasswordStrength(userData.password) === "Very weak") {
      error = getPasswordStrength(userData.password);
      itemError = "password";
      return false;
    } else {
      passStrenght = getPasswordStrength(userData.password);
    }
    return true;
  }
  function clearError() {
    error = "";
    itemError = "";
    passStrenght = "";
  }

  $: userData && clearError();
</script>

<Header {title} />
<main>
  {#if type === "signup"}
    <div class="form">
      <input type="text" bind:value={userData.name} placeholder="name..." />
      <input
        type="text"
        bind:value={userData.username}
        class:red-err={itemError === "username"}
        placeholder="username..."
      />
      <input
        type="email"
        bind:value={userData.email}
        class:red-err={itemError === "email"}
        placeholder="email@example.com..."
      />
      <input
        type="password"
        bind:value={userData.password}
        class:red-err={itemError === "password"}
        placeholder="password..."
        on:input={validate}
      />

      <div id="error">{error}</div>
      <div
        id="passStrength"
        style:color={passStrenght === "Fair" ? "#d7eb7f" : "green"}
      >
        {passStrenght}
      </div>
      <button
        type="submit"
        class="sup_btn"
        on:click={async () => await signup(userData)}
        disabled={error !== "" ||
          userData.name === "" ||
          userData.username === "" ||
          userData.email === "" ||
          userData.password === ""}
      >
        Signup</button
      >
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
            nav("login");
          }}>login</a
        >
      </div>
    </div>
  {:else if type === "rules"}
    <div class="rules">
      <ul>
        <li>
          <p>
            spam and trolls are not allowed and anyone going who violates these
            rules will be banned.
          </p>
        </li>
        <li>
          <p>
            hate speech and NSFW content are not allowed and anyone going who
            violates these rules will be banned.
          </p>
        </li>
      </ul>

      <div class="accept_btn">
        <button
          class="sup_btn"
          on:click|preventDefault={() => {
            nav("home");
          }}
        >
          I agree
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  /* *{
		outline: 2px solid var(--primary-color);
	} */
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
    background-color: var(--primary-color);
    width: 80%;
    border-radius: calc(var(--spacing-large) / 2);
  }

  input {
    margin-bottom: 1em;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    padding: 18px 12px;
    width: 78vw;
    border: 2px solid #cccccc;
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

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    background-color: var(--color-gray) !important;
    border-color: var(--color-grey) !important;
    outline: var(--color-gray) !important;
    color: var(--color-lighter) !important;
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

  .red-err {
    border: 2px solid red;
  }
  .form div {
    width: 90%;
    margin: 0 auto 15px;
    text-align: center;
    transition: opacity 0.3s ease-in-out;
  }
  #error {
    color: red;
    /* Use a transition for the opacity */
  }

  #error.show {
    /* Show the error message with full opacity */
    opacity: 1;
  }

  #error.hide {
    /* Hide the error message with zero opacity */
    opacity: 0;
  }

  /* RULES CSS */
  .rules {
    margin-top: 3em;
    height: auto;
    width: 100%;
    text-align: left;
  }
  .rules ul {
    list-style-type: none;
    margin: 0;
	padding: 0;
  }
  .rules li {
	padding: 8px;
    font-size: 18px;
    line-height: 1.2;
	border-bottom: 1px solid var(--color-line);
  }
  .rules li:last-child {
	border-bottom: none;
  }
  .rules li p {
	margin: 0;
	padding: 0;
	font-size: 16px;
	line-height: 1.2;
	margin-bottom: 1em;
  }
  .rules .accept_btn {
	position: absolute;
	bottom: 50px;
	margin-top: 1em;
	display: flex;
	justify-content: center;
	align-items: center;
	height: auto;
	width: 100%;
  }
</style>
