<script>
  import { nav } from "../route";
  import { DB } from "../db";
  import Header from "./header.svelte";
  import Snack from "./ui/snackbar.svelte";

  const title = "settings";
  let msg = "hey";
  let user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://via.placeholder.com/150",
  };

  const settingsPage = {
  header: {
    avatar: "https://via.placeholder.com/80",
    title: "Settings",
    subtitle: "Configure your account settings"
  },
  sections: [
    {
      title: "Account",
      items: [
        {
          type: "input",
          label: "Username",
          value: "johndoe",
          icon: "fas fa-user",
          action: {
            type: "func",
            name: "updateUsername"
          }
        },
        {
          type: "input",
          label: "Email",
          value: "johndoe@example.com",
          icon: "fas fa-envelope",
          action: {
            type: "func",
            name: "updateEmail"
          }
        },
        {
          type: "input",
          label: "Password",
          value: "",
          icon: "fas fa-lock",
          action: {
            type: "func",
            name: "updatePassword"
          }
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          type: "checkbox",
          label: "Email Notifications",
          value: true,
          icon: "fas fa-envelope",
          action: {
            type: "func",
            name: "toggleEmailNotifications"
          }
        },
        {
          type: "checkbox",
          label: "Push Notifications",
          value: false,
          icon: "fas fa-bell",
          action: {
            type: "func",
            name: "togglePushNotifications"
          }
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          type: "select",
          label: "Theme",
          value: "light",
          icon: "fas fa-palette",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" }
          ],
          action: {
            type: "func",
            name: "changeTheme"
          }
        },
        {
          type: "li",
          label: "Change Avatar",
          icon: "fas fa-camera",
          action: {
            type: "func",
            name: "changeAvatar"
          }
        }
      ]
    }
  ]
};

  function logOut() {
    DB("remove","token")
    DB("remove","login")
    msg = "you have successfully logged out";
    nav('login')
  }
  function codeEval(data){
    if (data == "logOut") return logOut();
  }
</script>

<!-- Settings.svelte -->
<!-- Settings.svelte -->
<main class="settings">
  <Header {title} />
  <header class="settings-header">
    <div class="settings-header-avatar">
      <img src={user.avatar} alt="User Avatar" />
    </div>
    <h1 class="settings-header-title">{user.name}</h1>
    <p class="settings-header-subtitle">{user.email}</p>
  </header>
  <ul class="settings-list">
    {#each settingsPage.sections as section}
      <li class="settings-list-section">
        <h2 class="settings-list-section-title">{section.title}</h2>
        <ul class="settings-list-items">
          {#each section.items as item}
            <li class="settings-list-item">
              {#if item.type === "checkbox"}
                <label class="settings-list-item-label">
                  <input
                    class="settings-list-item-checkbox"
                    type="checkbox"
                    checked={Boolean(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              {:else if item.type === "select"}
                <label class="settings-list-item-label">
                  <span>{item.label}</span>
                  <select class="settings-list-item-select" value={item.value}>
                    {#each item.options as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </label>
              {:else if item.type === "date"}
                <label class="settings-list-item-label">
                  <span>{item.label}</span>
                  <input
                    class="settings-list-item-date"
                    type="date"
                    value={item.value}
                  />
                </label>
              {:else if item.type === "textarea"}
                <label class="settings-list-item-label">
                  <span>{item.label}</span>
                  <textarea
                    class="settings-list-item-textarea"
                    value={String(item.value)}
                  />
                </label>
              {:else if item.type === "li"}
                <li
                  class="settings-list-item-li"
                  on:click={()=>{codeEval(item.action.name)}}
                >
                  <span>{item.label}</span>
                  <i class={item.icon} />
                </li>
              {:else}
                <label class="settings-list-item-label">
                  <span>{item.label}</span>
                  <input
                    class="settings-list-item-input"
                    type={item.type}
                    value={item.value}
                  />
                </label>
              {/if}
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
  <Snack bind:msg />
</main>

<style>
  /* Main Settings Container */
  .settings {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 10px;
  }

  /* Settings Header */
  .settings-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }

  .settings-header-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .settings-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .settings-header-title {
    font-size: 28px;
    margin-bottom: 5px;
    text-align: center;
  }

  .settings-header-subtitle {
    font-size: 16px;
    color: #999;
    text-align: center;
  }

  /* Settings List */
  .settings-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Settings List Section */
  .settings-list-section {
    margin-bottom: 20px;
  }

  .settings-list-section-title {
    font-size: 24px; 
    margin-bottom: 10px;
  }

  /* Settings List Items */
  .settings-list-items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Settings List Item */
  .settings-list-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
  }

  .settings-list-item:hover {
    background-color: #f9f9f9;
  }

  /* Settings List Item Label */
  .settings-list-item-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1em;
  }

  /* Settings List Item Input */
  .settings-list-item-input {
    display: block;
    border: none;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    color: #333;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* settings List Item textarea  */
  .settings-list-item-textarea {
    display: block;
    border: none;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    color: #333;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    outline: none;
  }

  /* date */
  .settings-list-item-date {
    display: block;
    border: none;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    color: #333;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    outline: none;
  }

  .settings-list-item-input:focus {
    outline: none;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  }

  /* Settings List Item Checkbox */
  .settings-list-item-checkbox {
    position: relative;
    width: 26px;
    height: 26px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border: 2px solid #aaa;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
  }

  .settings-list-item-checkbox:checked {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: white;
  }

  .settings-list-item-checkbox:checked:after {
    content: "";
    position: absolute;
    top: 12%;
    left: 13%;
    width: 16px;
    height: 16px;
    padding: 0;
    background-image: url("../assets/check-solid.svg");
    background-repeat: no-repeat;
    background-size: contain;
    transition: all 0.2s ease-in-out;
  }

  .settings-list-item-label {
    display: flex;
    align-items: center;
  }

  .settings-list-item-label:has(input[type="checkbox"]) span {
    font-size: 16px;
    color: #333;
    text-align: left;
    width: 100%;
  }

  .settings-list-item-checkbox:hover {
    cursor: pointer;
  }

  /* Settings List Item Select */
  .settings-list-item-select {
    padding: 5px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .settings-list-item-select:focus {
    outline: none;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  }

  /* Settings List Item Li */
  .settings-list-item-li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .settings-list-item-li:hover {
    background-color: var(--color-gray);
  }

  .settings-list-item-li i {
    margin-left: 10px;
    flex-grow: 2;
  }

  .settings-list-item-li span {
    font-size: 16px;
    color: #333;
    text-align: left;
    width: 100%;
    margin-right: 10px;
    flex-grow: 1;
  }
</style>
