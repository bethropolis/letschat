<script>
  import { config, login_token } from "../store";
  import {
    getPasswordStrength,
    isValidEmail,
    isValidUsername,
  } from "../extra.js";
  import { makeRequest } from "../api.js";
  import { DB } from "../db.js";
  import mail from "../assets/mail.png";
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
  let agree = false;
  let error = "";
  let itemError = "";
  let passStrenght = "strong";
  let signupInProgress = false;

  function updateExtAcc(newData) {
    const oldData = DB("get", "extAcc").users || [];

    DB("clear"); // this is to remove prev user's data

    if (!oldData.some((oldItem) => oldItem.username === newData.username)) {
      const combinedData = [...oldData, newData];
      DB("update", "extAcc", JSON.stringify({ users: combinedData }));
      return;
    }
    return DB("update", "extAcc", JSON.stringify({ users: oldData }));
  }

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
    signupInProgress = true;
    await makeRequest("signup", "POST", params, headers)
      .then((response) => {
        signupInProgress = false;
        if (response.data.type == "success") {
          updateExtAcc(response.data);
          DB("set", "login", response.data);
          DB("set", "token", response.data.user_token);
          $login_token = response.data.user_token;
          type = "rules";
          title = "server guidelines";

          return;
        } else {
          error = response.data.msg;
        }
      })
      .catch((error) => {
        error = "something went wrong, contact support";
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

<main class:bg={type == "email_sent"}>
  <Header {title} disableBack={type == "email_sent"} />
  {#if type === "signup"}
    <div class="form">
      <input
        type="text"
        bind:value={userData.name}
        title="optional"
        placeholder="your name(s)..."
      />
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
          userData.username === "" ||
          userData.email === "" ||
          userData.password === ""}
      >
        {#if signupInProgress}
          <i class="fas fa-spinner fa-spin" />
          signing up...
        {:else}
          Signup
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
            nav("login");
          }}>login</a
        >
      </div>
    </div>
  {:else if type === "rules"}
    <div class="rules">
      <!-- ul > li > p -->
      <ul>
        {#each $config["guide_lines"] as guide}
          <li>
            <p>
              {guide}
            </p>
          </li>
        {/each}
      </ul>

      <div class="accept_btn">
        <!-- a nice lable for hiden check box (well for styling).  -->
        <div class="checkbox">
          <input type="checkbox" id="agree" bind:checked={agree} />
          <label for="agree">I have read and agree to the rules</label>
        </div>
        <button
          class="sup_btn"
          on:click|preventDefault={() => {
            title = "";
            type = "email_sent";
          }}
          disabled={!agree}
        >
          continue
        </button>
      </div>
    </div>
  {:else if (type = "email_sent")}
    <div class="mail">
      <div class="topInfo">
        <h1>Email sent!</h1>
        <p>We have sent you an email to verify your account.</p>
      </div>
      <div class="imgContainer">
        <img alt="mail sent" src={mail} />
      </div>
      <div class="accept_btn">
        <button
          class="sup_btn"
          on:click={() => {
            nav("follow");
          }}>continue</button
        >
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
    height: 100vh;
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

  input:not([type="checkbox"]) {
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
    border-color: var(--primary-color);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  input::placeholder {
    color: #aaa;
  }

  input[type="checkbox"] {
    cursor: pointer;
    appearance: none;
    border: 1px solid var(--color-primary);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
  }

  input[type="checkbox"]:after {
    content: "";
    position: relative;
    left: 40%;
    top: 20%;
    width: 15%;
    height: 40%;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(50deg);
    display: none;
  }

  input[type="checkbox"]:checked {
    background: var(--color-primary);
  }

  input[type="checkbox"]:checked:after {
    display: block;
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
  }

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
    font-size: 20px;
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

  .accept_btn {
    position: absolute;
    bottom: 50px;
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 100%;
  }

  .rules .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1em;
  }

  .rules .checkbox label {
    font: 18px "Roboto", sans-serif;
    color: var(--color-text);
  }

  /* email  */
  .bg {
    background: #a89ef5;
  }
  .mail {
    width: 100%;
    color: var(--color-lighter);
  }
  .mail .topInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 2em;
  }
  .mail .topInfo h1 {
    font-size: 2em;
    margin-bottom: 1em;
    color: var(--color-lighter);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 400;
    font-family: "Roboto", sans-serif;
    line-height: 1.2;
  }
  .mail .topInfo p {
    font-size: 1.2em;
    color: var(--color-lighter);
    font-family: "Roboto", sans-serif;
    line-height: 1.2;
  }
  .mail .imgContainer {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  .imgContainer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
